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
import { Play, Square, RotateCcw, Settings2, Files, Search, GitGraph, Bug, ChevronRight, ChevronDown, Terminal, FileCode } from "lucide-react";

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

    return (
        <div className="flex h-screen flex-col bg-[#050505] text-white pt-20 overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Ambient Background Glows & Grid */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[130px] rounded-full opacity-50 mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 blur-[130px] rounded-full opacity-50 mix-blend-screen" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex min-h-0 p-6 gap-6 z-10">
                {/* Left Panel: Editor */}
                <div className="flex-1 flex flex-col bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5 hover:border-blue-500/30 transition-all duration-500">
                    {/* Glass Toolbar */}
                    <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 transition-all shadow-inner">
                                <FileCode className="w-4 h-4 text-blue-400" />
                                <LanguageSelect
                                    value={language.id}
                                    onChange={handleLanguageChange}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                <span className="opacity-60 text-neutral-400">Editing:</span>
                                <span className="text-white/90 tracking-wide font-semibold text-blue-100">{language.fileName}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
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
                                    className="h-9 px-6 gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all"
                                >
                                    <Square className="h-4 w-4 fill-current" />
                                    <span className="font-semibold tracking-wide text-xs uppercase">Stop</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleRun}
                                    className="h-9 px-8 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                    <span className="font-semibold tracking-wide text-xs uppercase">Run Code</span>
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

                {/* Right Panel: I/O & Terminal */}
                <div className="w-[420px] flex flex-col gap-6">
                    {/* Input Panel */}
                    <div className="flex-1 flex flex-col bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden ring-1 ring-white/5 hover:border-purple-500/30 transition-all duration-500">
                        <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-wider">Standard Input</span>
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
                    <div className="h-[45%] flex flex-col bg-[#0a0a0a]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden ring-1 ring-white/5 hover:border-green-500/30 transition-all duration-500">
                        <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-green-400" />
                                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 uppercase tracking-wider">Output</span>
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

            {/* Floating Status Bar */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-6 shadow-2xl z-50 text-[11px] text-neutral-400 font-medium">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50"></span>
                    <span>Ready</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div>{language.name}</div>
                <div className="w-px h-3 bg-white/10" />
                <ExecutionStatusBar
                    result={result}
                    isRunning={isRunning}
                    fileName={language.fileName}
                />
            </div>
        </div>
    );
}
