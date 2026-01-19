"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { QuizResult, LeaderboardEntry } from "@/lib/quiz/types";
import { fetchLeaderboard } from "@/lib/quiz/api";
import { IconTrophy, IconClock, IconRefresh, IconArrowLeft, IconMedal } from "@tabler/icons-react";
import Link from "next/link";

interface QuizResultsProps {
    quizId: string;
    result: QuizResult;
    timeTaken: number;
}

export function QuizResults({ quizId, result, timeTaken }: QuizResultsProps) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const percentage = Math.round((result.score / result.totalQuestions) * 100);

    useEffect(() => {
        fetchLeaderboard(quizId)
            .then(data => setLeaderboard(data.leaderboard.slice(0, 10)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [quizId]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getScoreColor = () => {
        if (percentage >= 80) return "from-green-500 to-emerald-500";
        if (percentage >= 60) return "from-yellow-500 to-orange-500";
        return "from-red-500 to-pink-500";
    };

    const getScoreMessage = () => {
        if (percentage >= 90) return "Excellent! Outstanding performance! 🌟";
        if (percentage >= 80) return "Great job! Well done! 🎉";
        if (percentage >= 60) return "Good effort! Keep practicing! 💪";
        if (percentage >= 40) return "Not bad! Room for improvement. 📚";
        return "Keep learning! Practice makes perfect. 🔄";
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Score Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800 mb-8"
            >
                <h2 className="text-2xl font-bold text-white mb-6">Quiz Completed!</h2>

                {/* Score Circle */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${percentage * 2.83} 283`}
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" className={`stop-color-${getScoreColor().split(" ")[0].replace("from-", "")}`} style={{ stopColor: percentage >= 80 ? "#22c55e" : percentage >= 60 ? "#eab308" : "#ef4444" }} />
                                <stop offset="100%" style={{ stopColor: percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f97316" : "#ec4899" }} />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
                            {percentage}%
                        </span>
                        <span className="text-neutral-400 text-sm">
                            {result.score}/{result.totalQuestions}
                        </span>
                    </div>
                </div>

                <p className="text-xl text-neutral-200 mb-4">{getScoreMessage()}</p>

                {/* Stats */}
                <div className="flex justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <IconTrophy className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400">Score: {result.score}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <IconClock className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-400">Time: {formatTime(timeTaken)}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <Link href="/quiz">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-all">
                            <IconArrowLeft className="w-5 h-5" />
                            Back to Quizzes
                        </button>
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all"
                    >
                        <IconRefresh className="w-5 h-5" />
                        Try Again
                    </button>
                </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800"
            >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <IconMedal className="w-6 h-6 text-yellow-400" />
                    Leaderboard
                </h3>

                {loading ? (
                    <div className="text-center py-8 text-neutral-400">Loading leaderboard...</div>
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400">
                        Be the first to complete this quiz!
                    </div>
                ) : (
                    <div className="space-y-2">
                        {leaderboard.map((entry, index) => (
                            <div
                                key={index}
                                className={`
                                    flex items-center justify-between p-3 rounded-xl
                                    ${index === 0 ? "bg-yellow-500/10 border border-yellow-500/30" :
                                        index === 1 ? "bg-neutral-400/10 border border-neutral-400/30" :
                                            index === 2 ? "bg-orange-500/10 border border-orange-500/30" :
                                                "bg-neutral-800/30 border border-neutral-700/50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                                        ${index === 0 ? "bg-yellow-500 text-black" :
                                            index === 1 ? "bg-neutral-400 text-black" :
                                                index === 2 ? "bg-orange-500 text-black" :
                                                    "bg-neutral-700 text-neutral-300"
                                        }
                                    `}>
                                        {index + 1}
                                    </span>
                                    <span className="text-white font-medium">{entry.studentName}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-green-400">{entry.score} pts</span>
                                    <span className="text-neutral-500">{formatTime(entry.timeTaken)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
