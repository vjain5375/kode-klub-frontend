import type { Quiz, QuizListItem, QuizAttemptSubmission, QuizResult, LeaderboardResponse } from './types';

// API base URL - uses environment variable for production (Render) or localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch all quizzes for the listing page
 */
export async function fetchAllQuizzes(): Promise<QuizListItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/quiz/all`);

    if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
    }

    const data = await response.json();
    return data.quizzes;
}

export async function fetchActiveQuizzes(): Promise<QuizListItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/quiz/active`);

    if (!response.ok) {
        throw new Error('Failed to fetch active quizzes');
    }

    const data = await response.json();
    return data.quizzes;
}

/**
 * Fetch a specific quiz by ID
 */
export async function fetchQuizById(id: string): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/api/quiz/${id}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Quiz not found');
        }
        throw new Error('Failed to fetch quiz');
    }

    return response.json();
}

/**
 * Submit quiz answers
 */
export async function submitQuizAttempt(submission: QuizAttemptSubmission): Promise<QuizResult> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}/api/attempt/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify(submission),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit quiz');
    }

    return response.json();
}

/**
 * Fetch leaderboard for a quiz
 */
export async function fetchLeaderboard(quizId: string): Promise<LeaderboardResponse> {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/${quizId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
    }

    return response.json();
}

/**
 * Fetch user's quiz history
 */
export async function fetchUserHistory(): Promise<any[]> {
    if (typeof window === 'undefined') return [];

    const token = localStorage.getItem('token');
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/api/attempt/history`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch history');
    }

    return response.json();
}

/**
 * Create a new quiz (Admin only)
 */
export async function createQuiz(quizData: any): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/quiz/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quizData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create quiz');
    }

    return response.json();
}

/**
 * Delete a quiz (Admin only)
 */
export async function deleteQuiz(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/quiz/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete quiz');
    }
}

/**
 * Update a quiz (Admin only)
 */
export async function updateQuiz(id: string, data: any): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/quiz/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update quiz');
    }
    return response.json();
}

/**
 * Toggle quiz active status (Admin only)
 */
export async function toggleQuizStatus(id: string): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/quiz/${id}/toggle`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to toggle quiz status');
    }
    return response.json();
}

/**
 * Fetch all attempts history (Admin only)
 */
export async function fetchAllHistory(): Promise<any[]> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/api/attempt/all`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch global history');
    }

    return response.json();
}
