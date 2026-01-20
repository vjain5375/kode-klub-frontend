"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { IconMail, IconLock, IconUser, IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { register } from "@/lib/auth/api";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await register({ name, email, password });
            // For now, redirect to login so they can sign in with new credentials
            // and we can confirm the account exists
            router.push('/login?message=registration_success');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Registration failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
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
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-neutral-400 text-sm">Join Kode Club today</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-8 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 shadow-xl"
                >
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

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
                        <div className="relative">
                            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                        <div className="relative">
                            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
                        <div className="relative">
                            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-neutral-800/50 border border-neutral-700 text-white focus:outline-none focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/50 transition-all"
                    >
                        {loading ? <IconLoader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-400">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-500 hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
