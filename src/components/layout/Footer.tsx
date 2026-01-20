"use client";

import Link from "next/link";
import { FooterSocialDock } from "./FooterSocialDock";
import { Code2, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "DPPs", href: "/dpp" },
    { name: "Quiz", href: "/quiz" },
    { name: "Compiler", href: "/compiler" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Resources", href: "/resources" },
];

const resourceLinks = [
    { name: "Codeforces", href: "https://codeforces.com", external: true },
    { name: "LeetCode", href: "https://leetcode.com", external: true },
    { name: "GeeksforGeeks", href: "https://geeksforgeeks.org", external: true },
    { name: "CP Algorithms", href: "https://cp-algorithms.com", external: true },
];

export function Footer() {
    return (
        <footer className="bg-black border-t border-neutral-800">
            {/* Social Dock */}
            <FooterSocialDock />

            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* About Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/kode-club-logo.png"
                                alt="Kode Club"
                                className="w-10 h-10 object-contain"
                            />
                            <span className="text-xl font-bold text-white">Kode Club</span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                            The official coding club of RGIPT. We foster a community of passionate programmers, organize coding events, and help students excel in competitive programming.
                        </p>
                        <p className="text-xs text-neutral-500">
                            Rajiv Gandhi Institute of Petroleum Technology
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-neutral-400 text-sm hover:text-blue-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {resourceLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-neutral-400 text-sm hover:text-blue-400 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="mailto:kodeclub@gmail.com"
                                    className="text-neutral-400 text-sm hover:text-blue-400 transition-colors"
                                >
                                    kodeclub@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <span className="text-neutral-400 text-sm">
                                    RGIPT, Jais, Amethi<br />
                                    Uttar Pradesh - 229304
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-800 mt-10 pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-neutral-500 text-xs">
                            © {new Date().getFullYear()} Kode Club, RGIPT. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href="/privacy"
                                className="text-neutral-500 text-xs hover:text-neutral-300 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-neutral-500 text-xs hover:text-neutral-300 transition-colors"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
