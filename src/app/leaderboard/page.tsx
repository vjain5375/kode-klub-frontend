"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Clock, ListOrdered, BarChart2, Lock } from "lucide-react";
import { fetchOverallLeaderboard, fetchQuizLeaderboard, fetchActiveQuizzes } from "@/lib/quiz/api";
import type { QuizListItem } from "@/lib/quiz/types";

interface OverallEntry {
    userId: string;
    studentName: string;
    totalQuizzes: number;
    totalScore: number;
    totalQuestions: number;
    avgPercentage: number;
    overallPercentage: number;
}

interface QuizEntry {
    studentName: string;
    studentId?: string;
    score: number;
    timeTaken: number;
    createdAt: string;
}

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<"overall" | string>("overall");
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
    const [overallData, setOverallData] = useState<{ visible: boolean; leaderboard: OverallEntry[] }>({ visible: false, leaderboard: [] });
    const [quizData, setQuizData] = useState<{ visible: boolean; quizTitle?: string; leaderboard: QuizEntry[] }>({ visible: false, leaderboard: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch available quizzes for tabs
        fetchActiveQuizzes()
            .then(setQuizzes)
            .catch(console.error);

        // Fetch overall leaderboard by default
        fetchOverallLeaderboard()
            .then(setOverallData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (activeTab === "overall") {
            setLoading(true);
            fetchOverallLeaderboard()
                .then(setOverallData)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            fetchQuizLeaderboard(activeTab)
                .then(setQuizData)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
        if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
        if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
        return <span className="text-neutral-400 font-medium">{rank}</span>;
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Leaderboard
                        </span>
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        Top performers across all quizzes. Keep learning to climb the ranks!
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-2 mb-8"
                >
                    <button
                        onClick={() => setActiveTab("overall")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === "overall"
                                ? "bg-blue-600 text-white"
                                : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50"
                            }`}
                    >
                        <BarChart2 className="w-4 h-4" />
                        Overall
                    </button>
                    {quizzes.map((quiz) => (
                        <button
                            key={quiz._id}
                            onClick={() => setActiveTab(quiz._id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === quiz._id
                                    ? "bg-blue-600 text-white"
                                    : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50"
                                }`}
                        >
                            <ListOrdered className="w-4 h-4" />
                            {quiz.title}
                        </button>
                    ))}
                </motion.div>

                {/* Leaderboard Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    {loading ? (
                        <div className="text-center py-16 text-neutral-400">
                            Loading leaderboard...
                        </div>
                    ) : activeTab === "overall" ? (
                        // Overall Leaderboard
                        !overallData.visible ? (
                            <div className="text-center py-16 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                                <Lock className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Leaderboard Not Published</h3>
                                <p className="text-neutral-400">
                                    The overall leaderboard has not been published yet by the admin.
                                </p>
                            </div>
                        ) : overallData.leaderboard.length === 0 ? (
                            <div className="text-center py-16 text-neutral-400">
                                No quiz attempts yet. Be the first!
                            </div>
                        ) : (
                            <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/50">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-neutral-800 hover:bg-transparent">
                                            <TableHead className="text-neutral-400 w-20">Rank</TableHead>
                                            <TableHead className="text-neutral-400">User</TableHead>
                                            <TableHead className="text-neutral-400 text-center">Quizzes</TableHead>
                                            <TableHead className="text-neutral-400 text-center">Avg Score</TableHead>
                                            <TableHead className="text-neutral-400 text-right">Overall %</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {overallData.leaderboard.map((entry, index) => (
                                            <TableRow key={entry.userId} className="border-neutral-800">
                                                <TableCell className="font-medium">
                                                    {getRankIcon(index + 1)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xs">
                                                                {entry.studentName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium text-white">{entry.studentName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="border-neutral-700">
                                                        {entry.totalQuizzes} quizzes
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center text-neutral-300">
                                                    {entry.totalScore}/{entry.totalQuestions}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className={`font-bold ${entry.avgPercentage >= 80 ? 'text-green-400' :
                                                            entry.avgPercentage >= 60 ? 'text-yellow-400' :
                                                                'text-red-400'
                                                        }`}>
                                                        {entry.avgPercentage}%
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    ) : (
                        // Quiz-specific Leaderboard
                        !quizData.visible ? (
                            <div className="text-center py-16 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                                <Lock className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Leaderboard Not Published</h3>
                                <p className="text-neutral-400">
                                    The leaderboard for this quiz has not been published yet.
                                </p>
                            </div>
                        ) : quizData.leaderboard.length === 0 ? (
                            <div className="text-center py-16 text-neutral-400">
                                No attempts for this quiz yet.
                            </div>
                        ) : (
                            <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/50">
                                {quizData.quizTitle && (
                                    <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-800/30">
                                        <h2 className="text-lg font-bold text-white">{quizData.quizTitle}</h2>
                                    </div>
                                )}
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-neutral-800 hover:bg-transparent">
                                            <TableHead className="text-neutral-400 w-20">Rank</TableHead>
                                            <TableHead className="text-neutral-400">User</TableHead>
                                            <TableHead className="text-neutral-400 text-center">Score</TableHead>
                                            <TableHead className="text-neutral-400 text-center">Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {quizData.leaderboard.map((entry, index) => (
                                            <TableRow key={index} className="border-neutral-800">
                                                <TableCell className="font-medium">
                                                    {getRankIcon(index + 1)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                                                                {entry.studentName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium text-white">{entry.studentName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="font-bold text-green-400">{entry.score}</span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1 text-neutral-400">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatTime(entry.timeTaken)}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    )}
                </motion.div>
            </div>
        </div>
    );
}
