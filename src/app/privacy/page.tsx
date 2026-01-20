"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconShieldCheck, IconArrowLeft } from "@tabler/icons-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300 py-20 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-blue-400 transition-colors mb-8 group"
                    >
                        <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                            <IconShieldCheck className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                            <p className="text-neutral-500 uppercase tracking-widest text-xs font-semibold">Last Updated: January 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-blue max-w-none space-y-8">
                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                Introduction
                            </h2>
                            <p className="leading-relaxed">
                                Welcome to Kode Club. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform at RGIPT.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                Information We Collect
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-blue-400 font-medium mb-1">Account Information</h3>
                                    <p>When you register, we collect your name, email address, and profile picture (if using Google OAuth) to identify you and provide access to features.</p>
                                </div>
                                <div>
                                    <h3 className="text-blue-400 font-medium mb-1">Usage Data</h3>
                                    <p>We track quiz attempts, code submissions on the compiler, and daily progress to provide you with your performance statistics and leaderboard rankings.</p>
                                </div>
                                <div>
                                    <h3 className="text-blue-400 font-medium mb-1">Technical Data</h3>
                                    <p>We collect your IP address and browser type for security monitoring and to prevent unauthorized access or spam.</p>
                                </div>
                            </div>
                        </section>

                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                How We Use Your Data
                            </h2>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>To manage your account and provide authentication.</li>
                                <li>To display your name on the public Leaderboards.</li>
                                <li>To track and display site statistics for club administrative purposes.</li>
                                <li>To send important club updates or technical notifications.</li>
                            </ul>
                        </section>

                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                Data Security
                            </h2>
                            <p className="leading-relaxed">
                                We implement industry-standard security measures, including data encryption and secure authentication via JWT and Google OAuth, to protect your personal information from unauthorized access.
                            </p>
                        </section>

                        <div className="text-center pt-8 border-t border-neutral-800">
                            <p className="text-sm text-neutral-500">
                                If you have questions about this policy, contact us at the Kode Club administrative office.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
