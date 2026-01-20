"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconFileText, IconArrowLeft } from "@tabler/icons-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300 py-20 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

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
                        <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
                            <IconFileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
                            <p className="text-neutral-500 uppercase tracking-widest text-xs font-semibold">Last Updated: January 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-blue max-w-none space-y-8">
                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                01. Acceptance of Terms
                            </h2>
                            <p className="leading-relaxed">
                                By accessing or using the Kode Club platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                02. User Conduct
                            </h2>
                            <p className="mb-4">As a member of Kode Club, you agree not to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Cheat or use unauthorized resources during Quizzes.</li>
                                <li>Submit malicious code or attempt to bypass security on the Compiler.</li>
                                <li>Use offensive language or harass other members on leaderboards.</li>
                                <li>Attempt to hack or scrape content from the platform.</li>
                            </ul>
                        </section>

                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                03. Account Responsibility
                            </h2>
                            <p className="leading-relaxed">
                                You are responsible for maintaining the confidentiality of your login credentials. Any activity occurring under your account is your sole responsibility.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                04. Educational Use Only
                            </h2>
                            <p className="leading-relaxed">
                                All resources, DPPs, and compiler tools are provided for educational purposes only. Redistribution of club-proprietary material without authorization is prohibited.
                            </p>
                        </section>

                        <section className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                05. Termination
                            </h2>
                            <p className="leading-relaxed">
                                The Kode Club administration reserves the right to suspend or terminate accounts that violate these terms or engage in disruptive behavior.
                            </p>
                        </section>

                        <div className="text-center pt-8 border-t border-neutral-800">
                            <p className="text-sm text-neutral-500 italic">
                                Thank you for being a part of the RGIPT Kode Club community.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
