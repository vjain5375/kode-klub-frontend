// Quiz-related TypeScript types

export interface QuizQuestion {
    id: number;
    question: string;
    image?: string | null;
    options: string[];
    correctAnswer?: number; // Only available after submission
}

export interface Quiz {
    _id: string;
    title: string;
    createdAt: string;
    showLeaderboard?: boolean; // Admin toggle
    quizData: {
        quizTitle: string;
        questions: QuizQuestion[];
    };
}

export interface QuizListItem {
    _id: string;
    title: string;
    questionCount: number;
    createdAt: string;
}

export interface QuizAttemptSubmission {
    quizId: string;
    studentName: string;
    studentId?: string;
    answers: number[];
    timeTaken: number;
}

export interface QuizResult {
    studentName: string;
    score: number;
    totalQuestions: number;
}

export interface LeaderboardEntry {
    studentName: string;
    studentId?: string;
    score: number;
    timeTaken: number;
    createdAt: string;
}

export interface LeaderboardResponse {
    totalAttempts: number;
    leaderboard: LeaderboardEntry[];
}
