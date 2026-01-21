"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { QuizGrid } from "@/components/features/quiz/QuizGrid";
import { IconTrophy, IconClock, IconBrain } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function QuizPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="container mx-auto px-4 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
                    >
                        <IconBrain className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-400 font-medium">Test Your Skills</span>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="text-neutral-200">Master Coding Through </span>
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            Quizzes
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Challenge yourself with curated quizzes across multiple domains.
                        Track your progress, compete with peers, and level up your coding skills.
                    </p>


                </motion.div>
            </div>

            {/* Quiz Categories */}
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                        Browse by Category
                    </h2>
                    <QuizGrid />
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    const colorClasses = {
        blue: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-400",
        purple: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400",
        green: "from-green-500/10 to-emerald-500/10 border-green-500/20 text-green-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`
                p-4 rounded-xl border backdrop-blur-xl
                bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]}
            `}
        >
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <div className="text-left">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-neutral-400">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}
