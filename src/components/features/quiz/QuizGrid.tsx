"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconBrain, IconLoader2, IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import Link from "next/link";
import { fetchActiveQuizzes } from "@/lib/quiz/api";
import type { QuizListItem } from "@/lib/quiz/types";

export function QuizGrid() {
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadQuizzes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchActiveQuizzes();
            setQuizzes(data);
        } catch (err) {
            setError("Failed to load quizzes. Make sure the backend is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuizzes();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <IconLoader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Loading quizzes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-red-500/30 max-w-md">
                    <IconAlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                    <p className="text-neutral-300 mb-4">{error}</p>
                    <button
                        onClick={loadQuizzes}
                        className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
                    >
                        <IconRefresh className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800 max-w-md">
                    <IconBrain className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Quizzes Available</h3>
                    <p className="text-neutral-400">
                        Check back later for new quizzes!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
                <QuizCard key={quiz._id} quiz={quiz} index={index} />
            ))}
        </div>
    );
}

function QuizCard({ quiz, index }: { quiz: QuizListItem; index: number }) {
    const colors = [
        "from-blue-500 to-cyan-500",
        "from-purple-500 to-pink-500",
        "from-green-500 to-emerald-500",
        "from-orange-500 to-red-500",
        "from-indigo-500 to-purple-500",
    ];
    const color = colors[index % colors.length];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
        >
            <Link href={`/quiz/${quiz._id}`}>
                <div
                    className={`
                        relative overflow-hidden rounded-2xl p-6 h-full min-h-[200px]
                        bg-black/40 backdrop-blur-xl border border-neutral-800
                        transition-all duration-300
                        hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-pointer
                    `}
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                    <div className="relative z-10 flex flex-col h-full">
                        {/* Icon */}
                        <div className={`
                            mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl
                            bg-gradient-to-br ${color} bg-opacity-20
                            group-hover:scale-110 transition-transform
                        `}>
                            <IconBrain className="w-7 h-7 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                            {quiz.title}
                        </h3>

                        {/* Spacer */}
                        <div className="flex-grow" />

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs mt-4">
                            <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {quiz.questionCount} Questions
                            </span>
                            <span className="text-neutral-500">
                                {formatDate(quiz.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
