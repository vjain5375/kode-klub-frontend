"use client";

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function NavbarDemo() {
    const navItems = [
        { name: "DPPs", link: "/dpp" },
        { name: "Compiler", link: "/compiler" },
        { name: "Leaderboard", link: "/leaderboard" },
        { name: "Resources", link: "/resources" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="fixed top-0 z-50 w-full">
            <Navbar className="backdrop-blur-md bg-black/60 border-b border-neutral-800">
                {/* Desktop */}
                <NavBody>
                    <NavbarLogo />

                    <NavItems items={navItems} className="text-sm tracking-wide" />

                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <NavbarButton
                                variant="secondary"
                                className="text-neutral-300 hover:text-white"
                            >
                                Sign In
                            </NavbarButton>
                        </Link>

                        <Link href="/compiler">
                            <NavbarButton variant="primary" className="font-medium">
                                Open Compiler
                            </NavbarButton>
                        </Link>
                    </div>
                </NavBody>

                {/* Mobile */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                        className="backdrop-blur-xl bg-black/90"
                    >
                        <div className="flex flex-col gap-4 pt-6">
                            {navItems.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-lg font-medium text-neutral-200 hover:text-white hover:pl-2 transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-800 mt-2">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <NavbarButton variant="secondary" className="w-full">
                                        Sign In
                                    </NavbarButton>
                                </Link>
                                <Link href="/dpp" onClick={() => setIsMobileMenuOpen(false)}>
                                    <NavbarButton variant="primary" className="w-full">
                                        Solve Today&apos;s DPP
                                    </NavbarButton>
                                </Link>
                            </div>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
