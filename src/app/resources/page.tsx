"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Target, BookOpen, Code2, Trophy, Users, MessageCircle } from "lucide-react";

// Platform logo components
const CodeforcesLogo = () => (
    <img src="/codeforces-logo.png" alt="Codeforces" className="w-8 h-8 object-contain" />
);

const LeetCodeLogo = () => (
    <img src="/leetcode-logo.png" alt="LeetCode" className="w-8 h-8 object-contain" />
);

const WhatsAppLogo = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const resources = [
    {
        title: "Codeforces",
        description: "The ultimate competitive programming platform. Participate in rated contests, solve challenging problems, and climb the global rankings.",
        link: "https://codeforces.com",
        Logo: CodeforcesLogo,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        iconBg: "bg-white",
        useBgColor: true,
        features: ["Weekly Contests", "Problem Archive", "Global Rankings", "Editorial Solutions"]
    },
    {
        title: "LeetCode Contests",
        description: "Weekly and biweekly coding contests to sharpen your problem-solving skills. Perfect preparation for technical interviews.",
        link: "https://leetcode.com/contest/",
        Logo: LeetCodeLogo,
        color: "from-orange-500 to-yellow-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        iconBg: "bg-white",
        useBgColor: false,
        features: ["Weekly Contest", "Biweekly Contest", "Interview Prep", "Company Problems"]
    },
    {
        title: "Join Kode Club",
        description: "Connect with fellow coders from RGIPT. Get updates on events, share resources, and grow together as a community.",
        link: "https://chat.whatsapp.com/KIknb8dNIWy7ANX0aEKjpZ",
        Logo: WhatsAppLogo,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
        useBgColor: true,
        features: ["Community Support", "Event Updates", "Resource Sharing", "Peer Learning"]
    }
];

const quickLinks = [
    { title: "Daily Practice", href: "/dpp", icon: Target },
    { title: "Take a Quiz", href: "/quiz", icon: BookOpen },
    { title: "Code Compiler", href: "/compiler", icon: Code2 },
    { title: "Leaderboard", href: "/leaderboard", icon: Trophy }
];

export default function ResourcesPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Resources
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Everything you need to level up your competitive programming skills and stay connected with the community.
                    </p>
                </motion.div>

                {/* Main Resource Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={resource.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block h-full"
                            >
                                <div className={`h-full p-6 rounded-2xl ${resource.bgColor} border ${resource.borderColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}>
                                    {/* Icon & Title */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-xl ${resource.iconBg} flex items-center justify-center shadow-lg text-white`}>
                                            <resource.Logo />
                                        </div>
                                        <ExternalLink className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {resource.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                                        {resource.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2">
                                        {resource.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/5 text-neutral-300 border border-white/10"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Links Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Access</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickLinks.map((link, index) => (
                            <Link
                                key={link.title}
                                href={link.href}
                                className="group p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center"
                            >
                                <link.icon className="w-6 h-6 text-neutral-400 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 p-8"
                >
                    <div className="relative z-10 text-center">
                        <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
                        <p className="text-neutral-400 mb-6 max-w-lg mx-auto">
                            Be part of RGIPT's most active coding community. Learn together, compete together, grow together.
                        </p>
                        <Link
                            href="https://chat.whatsapp.com/KIknb8dNIWy7ANX0aEKjpZ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Join WhatsApp Group
                        </Link>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                </motion.div>
            </div>
        </div>
    );
}
