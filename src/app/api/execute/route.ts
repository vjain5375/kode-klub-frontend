import { NextRequest, NextResponse } from "next/server";
import { ExecutionResponse, ExecutionStatus } from "@/types/compiler";

// Wandbox API - Free, no API key required!
const WANDBOX_API_URL = "https://wandbox.org/api/compile.json";

// Language mapping for Wandbox compilers
const WANDBOX_COMPILERS: Record<string, string> = {
    python: "cpython-3.12.7",
    javascript: "nodejs-20.17.0",
    typescript: "typescript-5.6.2",
    c: "gcc-13.2.0-c",
    cpp: "gcc-13.2.0",
    java: "openjdk-jdk-22+36",
    go: "go-1.23.2",
    rust: "rust-1.82.0",
    bash: "bash",
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

interface WandboxResult {
    status: string;
    signal: string;
    compiler_output: string;
    compiler_error: string;
    compiler_message: string;
    program_output: string;
    program_error: string;
    program_message: string;
    permlink: string;
    url: string;
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { success: false, error: 'Rate limit exceeded. Please wait.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { language, code, stdin } = body;

        if (!language || !code) {
            return NextResponse.json(
                { success: false, error: 'Language and code are required' },
                { status: 400 }
            );
        }

        const compiler = WANDBOX_COMPILERS[language];
        if (!compiler) {
            return NextResponse.json(
                { success: false, error: `Unsupported language: ${language}` },
                { status: 400 }
            );
        }

        // Check code size
        if (code.length > 64 * 1024) {
            return NextResponse.json(
                { success: false, error: 'Code exceeds maximum size of 64KB' },
                { status: 400 }
            );
        }

        // Execute with Wandbox API
        const startTime = Date.now();

        const wandboxResponse = await fetch(WANDBOX_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                compiler,
                stdin: stdin || '',
            }),
        });

        const executionTime = Date.now() - startTime;

        if (!wandboxResponse.ok) {
            const errorText = await wandboxResponse.text();
            console.error('Wandbox error:', wandboxResponse.status, errorText);
            return NextResponse.json(
                { success: false, error: 'Execution service error' },
                { status: 502 }
            );
        }

        const result: WandboxResult = await wandboxResponse.json();

        // Determine status
        const exitCode = parseInt(result.status, 10) || 0;
        let status: ExecutionStatus = 'SUCCESS';

        if (result.compiler_error && result.compiler_error.trim() !== '') {
            // Check if it's a compilation error (non-zero status with compiler errors)
            // For some languages, compiler_error contains warnings even on success
            if (exitCode !== 0 && !result.program_output && !result.program_error) {
                status = 'COMPILATION_ERROR';
            }
        }

        if (status === 'SUCCESS' && exitCode !== 0) {
            status = 'RUNTIME_ERROR';
        }

        if (result.signal && result.signal === 'SIGKILL') {
            status = 'TIME_LIMIT_EXCEEDED';
        }

        const response: ExecutionResponse = {
            success: status === 'SUCCESS',
            data: {
                stdout: result.program_output || '',
                stderr: result.program_error || '',
                exitCode,
                executionTime,
                memoryUsed: null,
                status,
                compileOutput: result.compiler_error || result.compiler_message || undefined,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Execution error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
