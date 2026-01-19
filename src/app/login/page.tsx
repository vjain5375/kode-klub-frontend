"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IconMail, IconLock, IconLogin, IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
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

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-neutral-400">
                        Sign in to access Kode Club
                    </p>
                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-neutral-800"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 mb-4"
                        >
                            <IconAlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-sm text-neutral-400 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-sm text-neutral-400 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                            ${loading
                                ? "bg-blue-500/50 text-blue-200 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
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
                                Sign In
                            </>
                        )}
                    </button>

                    {/* Back Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-neutral-400 hover:text-blue-400 transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
