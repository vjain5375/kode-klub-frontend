import type { AuthResponse, LoginCredentials, RegisterData, User } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('Attempting login to:', `${API_BASE_URL}/api/auth/login`);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        console.log('Login response:', response.status, data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
            console.log('Token stored in localStorage');
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Register new user
 */
export async function register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    // Store token in localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
    }

    return data;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            localStorage.removeItem('token');
            return null;
        }

        const data = await response.json();
        return data.user;
    } catch {
        return null;
    }
}

/**
 * Logout user
 */
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

/**
 * Get stored token
 */
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}
