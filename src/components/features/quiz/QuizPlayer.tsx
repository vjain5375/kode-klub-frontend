"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quiz } from "@/lib/quiz/types";
import { IconChevronLeft, IconChevronRight, IconClock, IconCheck } from "@tabler/icons-react";

interface QuizPlayerProps {
    quiz: Quiz;
    onComplete: (answers: number[], timeTaken: number) => void;
}

export function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(
        new Array(quiz.quizData.questions.length).fill(null)
    );
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);

    const questions = quiz.quizData.questions;
    const currentQuestion = questions[currentQuestionIndex];

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSelectAnswer = useCallback((optionIndex: number) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQuestionIndex] = optionIndex;
            return newAnswers;
        });
    }, [currentQuestionIndex]);

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        // Replace nulls with -1 for unanswered questions
        const finalAnswers = answers.map(a => a ?? -1);
        onComplete(finalAnswers, timeTaken);
    };

    const answeredCount = answers.filter(a => a !== null).length;
    const allAnswered = answeredCount === questions.length;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header with Timer and Progress */}
            <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-black/40 backdrop-blur-xl border border-neutral-800">
                <div className="flex items-center gap-2 text-blue-400">
                    <IconClock className="w-5 h-5" />
                    <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
                </div>
                <div className="text-neutral-400">
                    Question <span className="text-white font-bold">{currentQuestionIndex + 1}</span> of{" "}
                    <span className="text-white">{questions.length}</span>
                </div>
                <div className="text-neutral-400">
                    Answered: <span className="text-green-400 font-bold">{answeredCount}</span>/{questions.length}
                </div>
            </div>

            {/* Question Navigation Dots */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {questions.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`
                            w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium
                            transition-all duration-200 border
                            ${idx === currentQuestionIndex
                                ? "bg-blue-500 border-blue-400 text-white"
                                : answers[idx] !== null
                                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                                    : "bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-500"
                            }
                        `}
                    >
                        {answers[idx] !== null ? <IconCheck className="w-4 h-4" /> : idx + 1}
                    </button>
                ))}
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800 mb-6"
                >
                    {/* Question Text */}
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                        {currentQuestion.question}
                    </h2>

                    {/* Question Image */}
                    {currentQuestion.image && (
                        <div className="mb-6 rounded-xl overflow-hidden">
                            <img
                                src={currentQuestion.image}
                                alt="Question"
                                className="max-w-full h-auto mx-auto"
                            />
                        </div>
                    )}

                    {/* Options */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, optIdx) => (
                            <button
                                key={optIdx}
                                onClick={() => handleSelectAnswer(optIdx)}
                                className={`
                                    w-full p-4 rounded-xl text-left transition-all duration-200 border
                                    ${answers[currentQuestionIndex] === optIdx
                                        ? "bg-blue-500/20 border-blue-500 text-blue-400"
                                        : "bg-neutral-800/30 border-neutral-700 text-neutral-300 hover:bg-neutral-700/50 hover:border-neutral-500"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                                        ${answers[currentQuestionIndex] === optIdx
                                            ? "bg-blue-500 text-white"
                                            : "bg-neutral-700 text-neutral-300"
                                        }
                                    `}>
                                        {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="text-base">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                        ${currentQuestionIndex === 0
                            ? "bg-neutral-800/30 text-neutral-600 cursor-not-allowed"
                            : "bg-neutral-800 text-white hover:bg-neutral-700"
                        }
                    `}
                >
                    <IconChevronLeft className="w-5 h-5" />
                    Previous
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all"
                    >
                        Next
                        <IconChevronRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className={`
                            flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all
                            ${allAnswered
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-neutral-800/30 text-neutral-500 cursor-not-allowed"
                            }
                        `}
                    >
                        <IconCheck className="w-5 h-5" />
                        Submit Quiz
                    </button>
                )}
            </div>
        </div>
    );
}
