// Auth types

export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}
