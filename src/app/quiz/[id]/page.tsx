"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchQuizById, submitQuizAttempt } from "@/lib/quiz/api";
import type { Quiz, QuizResult } from "@/lib/quiz/types";
import { QuizPlayer } from "@/components/features/quiz/QuizPlayer";
import { QuizResults } from "@/components/features/quiz/QuizResults";
import { IconUser, IconArrowRight, IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";

type QuizState = "loading" | "error" | "registration" | "playing" | "submitting" | "results";

export default function QuizPlayPage() {
    const params = useParams();
    const quizId = params.id as string;

    const [state, setState] = useState<QuizState>("loading");
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string>("");
    const [studentName, setStudentName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [result, setResult] = useState<QuizResult | null>(null);
    const [timeTaken, setTimeTaken] = useState(0);

    useEffect(() => {
        fetchQuizById(quizId)
            .then(data => {
                setQuiz(data);
                setState("registration");
            })
            .catch(err => {
                setError(err.message);
                setState("error");
            });
    }, [quizId]);

    const handleStartQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        if (studentName.trim()) {
            setState("playing");
        }
    };

    const handleQuizComplete = async (answers: number[], time: number) => {
        setState("submitting");
        setTimeTaken(time);

        try {
            const result = await submitQuizAttempt({
                quizId,
                studentName: studentName.trim(),
                studentId: studentId.trim() || undefined,
                answers,
                timeTaken: time,
            });
            setResult(result);
            setState("results");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
            setError(errorMessage);
            setState("error");
        }
    };

    if (state === "loading") {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <IconLoader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-red-500/30 max-w-md">
                    <IconAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
                    <p className="text-neutral-400 mb-6">{error}</p>
                    <Link href="/quiz">
                        <button className="px-6 py-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all">
                            Back to Quizzes
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (state === "registration" && quiz) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-lg mx-auto"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {quiz.title}
                            </h1>
                            <p className="text-neutral-400">
                                {quiz.quizData.questions.length} questions
                            </p>
                        </div>

                        <form onSubmit={handleStartQuiz} className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <IconUser className="w-5 h-5 text-blue-400" />
                                Enter Your Details
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-2">
                                        Your Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full p-3 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-neutral-400 mb-2">
                                        Roll No / Student ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        placeholder="Enter your roll number"
                                        className="w-full p-3 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!studentName.trim()}
                                className={`
                                    w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                                    ${studentName.trim()
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                    }
                                `}
                            >
                                Start Quiz
                                <IconArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (state === "playing" && quiz) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-white text-center mb-8">
                        {quiz.title}
                    </h1>
                    <QuizPlayer quiz={quiz} onComplete={handleQuizComplete} />
                </div>
            </div>
        );
    }

    if (state === "submitting") {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <IconLoader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Submitting your answers...</p>
                </div>
            </div>
        );
    }

    if (state === "results" && result) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <QuizResults quizId={quizId} result={result} timeTaken={timeTaken} />
                </div>
            </div>
        );
    }

    return null;
}
