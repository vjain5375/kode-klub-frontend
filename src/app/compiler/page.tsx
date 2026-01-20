"use client";

import { useState, useCallback } from "react";
import { CodeEditor } from "@/components/features/compiler/code-editor";
import { LanguageSelect } from "@/components/features/compiler/language-select";
import { StdinPanel } from "@/components/features/compiler/stdin-panel";
import { OutputPanel } from "@/components/features/compiler/output-panel";
import { ExecutionStatusBar } from "@/components/features/compiler/execution-status";
import { Button } from "@/components/ui/button";
import { LANGUAGES, getLanguage } from "@/lib/compiler/languages";
import { executeCode } from "@/lib/compiler/api";
import { Language, ExecutionResult } from "@/types/compiler";
import { Play, Square, RotateCcw, Settings2, Files, Search, GitGraph, Bug, ChevronRight, ChevronDown, Terminal, FileCode, Copy, Download } from "lucide-react";

export default function CompilerPage() {
    const [language, setLanguage] = useState<Language>(LANGUAGES.python);
    const [code, setCode] = useState(LANGUAGES.python.template);
    const [stdin, setStdin] = useState("");
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const handleLanguageChange = useCallback((newLanguage: Language) => {
        setLanguage(newLanguage);
        setCode(newLanguage.template);
        setResult(null);
    }, []);

    const handleReset = useCallback(() => {
        setCode(language.template);
        setStdin("");
        setResult(null);
    }, [language]);

    const handleRun = useCallback(async () => {
        setIsRunning(true);
        setResult({
            stdout: '',
            stderr: '',
            exitCode: null,
            executionTime: null,
            memoryUsed: null,
            status: 'RUNNING',
        });

        try {
            const response = await executeCode({
                language: language.id,
                code,
                stdin,
                timeLimit: 5,
                memoryLimit: 256,
            });

            setResult(response.data);
        } catch (error) {
            setResult({
                stdout: '',
                stderr: error instanceof Error ? error.message : 'Execution failed',
                exitCode: 1,
                executionTime: null,
                memoryUsed: null,
                status: 'INTERNAL_ERROR',
            });
        } finally {
            setIsRunning(false);
        }
    }, [language, code, stdin]);

    const handleStop = useCallback(() => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
        }
        setIsRunning(false);
        setResult({
            stdout: '',
            stderr: 'Execution cancelled by user',
            exitCode: null,
            executionTime: null,
            memoryUsed: null,
            status: 'INTERNAL_ERROR',
        });
    }, [abortController]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            // Optional: Add toast notification here
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    }, [code]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = language.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [code, language.fileName]);

    return (
        <div className="flex h-screen flex-col bg-[#0a0a0a] text-white pt-16 overflow-hidden font-sans">
            {/* Subtle Background */}
            <div className="fixed inset-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 px-8 py-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Code Compiler</h1>
                        <p className="text-sm text-neutral-400">20+ languages • Real-time execution</p>
                    </div>
                    <Button
                        onClick={() => window.location.href = '/compiler'}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all"
                    >
                        Try Compiler
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex min-h-0 p-8 gap-6 z-10">
                {/* Left Panel: Editor */}
                <div className="flex-1 flex flex-col bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Toolbar */}
                    <div className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-[#0f0f0f]">
                        <div className="flex items-center gap-4">
                            {/* macOS-style dots */}
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="text-sm text-neutral-400 font-medium">{language.fileName}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <LanguageSelect
                                value={language.id}
                                onChange={handleLanguageChange}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Copy Code"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDownload}
                                className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Download Code"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleReset}
                                className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Reset Code"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>

                            {isRunning ? (
                                <Button
                                    onClick={handleStop}
                                    className="h-10 px-6 gap-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                                >
                                    <Square className="h-4 w-4 fill-current" />
                                    <span className="font-medium">Stop</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleRun}
                                    className="h-10 px-8 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                    <span className="font-medium">Run Code</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Editor Container */}
                    <div className="flex-1 relative">
                        <CodeEditor
                            language={language.monacoId}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            fileName={language.fileName}
                            readOnly={isRunning}
                        />
                    </div>
                </div>

                {/* Right Panel: I/O */}
                <div className="w-[420px] flex flex-col gap-4">
                    {/* Input Panel */}
                    <div className="flex-1 flex flex-col bg-[#1a1a1a] rounded-xl border border-white/10 shadow-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/10 bg-[#0f0f0f] flex items-center gap-2">
                            <span className="text-sm font-semibold text-neutral-300">Input</span>
                        </div>
                        <div className="flex-1 p-0">
                            <StdinPanel
                                value={stdin}
                                onChange={setStdin}
                                disabled={isRunning}
                            />
                        </div>
                    </div>

                    {/* Output Panel */}
                    <div className="h-[45%] flex flex-col bg-[#1a1a1a] rounded-xl border border-white/10 shadow-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-white/10 bg-[#0f0f0f] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-neutral-300">Output</span>
                            </div>
                            {result && (
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider shadow-sm ${result.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-green-900/20' :
                                    (result.status === 'IDLE' || result.status === 'RUNNING') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-900/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-900/20'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${result.status === 'SUCCESS' ? 'bg-green-400' :
                                        (result.status === 'IDLE' || result.status === 'RUNNING') ? 'bg-blue-400 animate-pulse' :
                                            'bg-red-400'
                                        }`} />
                                    {result.status.replace(/_/g, ' ')}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 relative bg-black/20">
                            <OutputPanel
                                result={result}
                                isRunning={isRunning}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="relative z-10 px-8 py-3 border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span>Ready</span>
                        </div>
                        <span>{language.name}</span>
                    </div>
                    <ExecutionStatusBar
                        result={result}
                        isRunning={isRunning}
                        fileName={language.fileName}
                    />
                </div>
            </div>
        </div>
    );
}
