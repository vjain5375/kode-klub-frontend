"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchQuizById, submitQuizAttempt, checkUserAttempt } from "@/lib/quiz/api";
import type { Quiz, QuizResult } from "@/lib/quiz/types";
import { QuizPlayer } from "@/components/features/quiz/QuizPlayer";
import { QuizResults } from "@/components/features/quiz/QuizResults";
import { IconUser, IconArrowRight, IconLoader2, IconAlertCircle, IconCheck, IconLock } from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type QuizState = "loading" | "error" | "start" | "playing" | "submitting" | "results" | "already_attempted";

export default function QuizPlayPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id as string;
    const { user, loading: authLoading } = useAuth();

    const [state, setState] = useState<QuizState>("loading");
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string>("");
    const [studentName, setStudentName] = useState("");
    const [result, setResult] = useState<QuizResult | null>(null);
    const [timeTaken, setTimeTaken] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [previousScore, setPreviousScore] = useState<{ score: number, timeTaken: number } | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (!user) return;

        const loadData = async () => {
            try {
                // Fetch quiz and attempt status in parallel
                const [quizData, attemptData] = await Promise.all([
                    fetchQuizById(quizId),
                    checkUserAttempt(quizId)
                ]);

                setQuiz(quizData);
                setStudentName(user.name || user.email);

                if (attemptData.attempted) {
                    setResult({
                        studentName: user.name || user.email,
                        score: attemptData.score || 0,
                        totalQuestions: quizData.quizData.questions.length
                    });
                    setTimeTaken(attemptData.timeTaken || 0);
                    setUserAnswers(attemptData.answers || []);
                    setState("results");
                } else {
                    setState("start");
                }
            } catch (err: any) {
                setError(err.message || "Failed to load quiz");
                setState("error");
            }
        };

        loadData();
    }, [quizId, user, authLoading, router]);

    const handleStartQuiz = () => {
        setState("playing");
    };

    const handleQuizComplete = async (answers: number[], time: number) => {
        setState("submitting");
        setTimeTaken(time);
        setUserAnswers(answers);

        try {
            const result = await submitQuizAttempt({
                quizId,
                studentName: user?.name || user?.email || "Anonymous",
                studentId: user?.email,
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

    if (state === "already_attempted" && quiz && previousScore) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto px-4">
                    <div className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800 text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                            <IconCheck className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed</h2>
                        <p className="text-neutral-400 mb-6">
                            You have already attempted the <strong>{quiz.title}</strong> regarding this quiz.
                            Multiple submissions are not allowed.
                        </p>

                        <div className="bg-neutral-800/50 rounded-xl p-4 mb-8">
                            <div className="text-sm text-neutral-500 mb-1">Your Score</div>
                            <div className="text-3xl font-bold text-white">
                                {previousScore.score} / {quiz.quizData.questions.length}
                            </div>
                        </div>

                        <Link href="/quiz">
                            <button className="w-full px-6 py-3 rounded-xl font-medium bg-neutral-700 text-white hover:bg-neutral-600 transition-all">
                                Back to Quizzes
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (state === "start" && quiz) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="max-w-lg w-full mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
                            <p className="text-neutral-400">{quiz.quizData.questions.length} Questions</p>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                            <IconAlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-medium mb-1">One Attempt Policy</h3>
                                <p className="text-sm text-yellow-200/80">
                                    You can submit this quiz <strong>only once</strong> per email account.
                                    Submissions are final and cannot be retaken.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <IconUser className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-neutral-500">Signed in as</div>
                                    <div className="text-white font-medium">{user?.email}</div>
                                </div>
                            </div>

                            <button
                                onClick={handleStartQuiz}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/20"
                            >
                                Start Quiz Now
                                <IconArrowRight className="w-5 h-5" />
                            </button>
                        </div>
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

    if (state === "results" && result && quiz) {
        return (
            <div className="min-h-screen pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <QuizResults
                        quizId={quizId}
                        result={result}
                        timeTaken={timeTaken}
                        quiz={quiz}
                        userAnswers={userAnswers}
                    />
                </div>
            </div>
        );
    }

    return null;
}
