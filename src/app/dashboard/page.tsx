"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserHistory } from "@/lib/quiz/api";
import { motion } from "framer-motion";
import { IconTrophy, IconHistory, IconChartBar, IconClock, IconLoader2, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            loadHistory();
        }
    }, [user, authLoading, router]);

    const loadHistory = async () => {
        try {
            const data = await fetchUserHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || (loading && user)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <IconLoader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!user) return null;

    // Calculate stats
    const totalAttempts = history.length;
    const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = totalAttempts > 0 ? (totalScore / totalAttempts).toFixed(1) : 0;
    const bestScore = history.reduce((max, curr) => Math.max(max, curr.score), 0);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, <span className="text-blue-400">{user.name}</span>
                </h1>
                <p className="text-neutral-400">Here's an overview of your learning progress</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: "Total Quizzes", value: totalAttempts, icon: IconHistory, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { label: "Best Score", value: bestScore, icon: IconTrophy, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                    { label: "Average Score", value: avgScore, icon: IconChartBar, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-neutral-400">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-neutral-800 bg-black/40 backdrop-blur-xl overflow-hidden"
            >
                <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                    <Link href="/quiz">
                        <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                            Take New Quiz <IconArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {history.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500">
                        <IconHistory className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No quizzes taken yet. Start learning!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800">
                        {history.map((attempt) => (
                            <div key={attempt._id} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                <div>
                                    <h3 className="text-white font-medium mb-1">
                                        {attempt.quizId?.title || attempt.quizId?.quizData?.quizTitle || 'Quiz'}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                                        <span className="flex items-center gap-1">
                                            <IconClock className="w-4 h-4" />
                                            {new Date(attempt.createdAt).toLocaleDateString()}
                                        </span>
                                        <span>•</span>
                                        <span>Time: {attempt.timeTaken}s</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white">
                                            {attempt.score}<span className="text-neutral-500 text-sm font-normal"> pts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
