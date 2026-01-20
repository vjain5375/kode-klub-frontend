"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProblemCard } from "@/components/features/dpp/problem-card";
import { ExternalLink, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

interface DPP {
    _id: string;
    title: string;
    slug: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    description: string;
    leetcodeUrl?: string;
    publishDate: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DPPPage() {
    const [dpps, setDpps] = useState<DPP[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDPPs();
    }, []);

    const fetchDPPs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/dpp/all`);
            const data = await response.json();
            setDpps(data.dpps || []);
        } catch (error) {
            console.error("Failed to fetch DPPs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                            Daily Practice Problems
                        </h1>
                        <p className="text-neutral-400">
                            Solve a new problem every day to improve your coding skills.
                        </p>
                    </div>

                    {/* LeetCode Button */}
                    <Link
                        href="https://leetcode.com/problemset/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                        >
                            <BookOpen className="w-5 h-5" />
                            Practice on LeetCode
                            <ExternalLink className="w-4 h-4" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                >
                    <p className="text-blue-300 text-sm">
                        💡 <strong>Tip:</strong> Practice consistently for best results. Each DPP is curated to help you master important DSA concepts.
                        For additional practice, use the LeetCode button above!
                    </p>
                </motion.div>

                {/* Problems Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : dpps.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <BookOpen className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Problems Available</h3>
                        <p className="text-neutral-400 mb-6">
                            New practice problems will be published soon. Meanwhile, practice on LeetCode!
                        </p>
                        <Link
                            href="https://leetcode.com/problemset/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                        >
                            Go to LeetCode
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {dpps.map((dpp, index) => (
                            <motion.div
                                key={dpp._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <ProblemCard
                                    problem={{
                                        id: dpp._id,
                                        title: dpp.title,
                                        slug: dpp.slug,
                                        difficulty: dpp.difficulty,
                                        tags: dpp.tags as any,
                                        description: dpp.description,
                                        solveRate: 0,
                                        publishDate: dpp.publishDate,
                                        leetcodeUrl: dpp.leetcodeUrl
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
