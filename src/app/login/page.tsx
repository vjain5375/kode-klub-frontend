"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IconMail, IconLock, IconLogin, IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(email, password);
            // Force full page reload to ensure AuthContext initializes
            window.location.href = "/quiz";
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Login failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };

    // Handle OAuth callback token
    useEffect(() => {
        const token = searchParams.get('token');
        const authError = searchParams.get('error');

        if (token) {
            localStorage.setItem('token', token);
            // Force reload to initialize auth context with new token
            window.location.href = '/quiz';
        }

        if (authError) {
            setError('Google authentication failed. Please try again.');
        }
    }, [searchParams]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10"
        >
            {/* Logo/Brand */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center mb-5">
                    <Image
                        src="/kode-club-logo.png"
                        alt="Kode Club"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Sign in to Kode Club
                </h1>
                <p className="text-neutral-400 text-sm">
                    Enter your credentials to continue
                </p>
            </div>

            {/* Login Form */}
            <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 shadow-xl"
            >
                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-5"
                    >
                        <IconAlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </motion.div>
                )}

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all
                        ${loading
                            ? "bg-blue-600/50 text-blue-200 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <IconLoader2 className="w-5 h-5 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            <IconLogin className="w-5 h-5" />
                            Sign in
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-neutral-900/50 text-neutral-500 text-xs">
                            or
                        </span>
                    </div>
                </div>

                {/* Google Sign In Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Continue with Google</span>
                </button>

                {/* Footer Links */}
                <div className="mt-6 text-center space-y-2">
                    <Link
                        href="/"
                        className="block text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
                    >
                        ← Back to home
                    </Link>
                    <p className="text-sm text-neutral-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
                    </p>
                </div>
            </form>

            {/* Terms */}
            <p className="text-center text-xs text-neutral-600 mt-6">
                By continuing, you agree to our{" "}
                <a href="#" className="text-neutral-500 hover:text-neutral-400">Terms</a>
                {" "}and{" "}
                <a href="#" className="text-neutral-500 hover:text-neutral-400">Privacy Policy</a>
            </p>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <IconLoader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-neutral-400 animate-pulse">Loading login...</p>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
