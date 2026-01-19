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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IconSearch, IconUser, IconLogout } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function NavbarDemo() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, loading, logout } = useAuth();

    const navItems = [
        { name: "DPPs", link: "/dpp" },
        { name: "Compiler", link: "/compiler" },
        { name: "Quiz", link: "/quiz" },
        { name: "Leaderboard", link: "/leaderboard" },
        { name: "Resources", link: "/resources" },
    ];

    const openCommandBar = () => {
        if (typeof window !== "undefined" && (window as any).__openCommandBar) {
            (window as any).__openCommandBar();
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="fixed top-0 z-50 w-full">
            <Navbar className="bg-black/80 backdrop-blur-xl border-b border-neutral-800">
                {/* DESKTOP */}
                <NavBody>
                    <NavbarLogo />

                    {/* NAV ITEMS WITH ACTIVE STATE */}
                    <div className="flex gap-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.link;
                            return (
                                <a
                                    key={item.name}
                                    href={item.link}
                                    className={`relative text-sm transition
                    ${isActive
                                            ? "text-green-400"
                                            : "text-neutral-400 hover:text-white"
                                        }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-green-400 rounded-full" />
                                    )}
                                </a>
                            );
                        })}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3">
                        {/* Quick Actions Button */}
                        <button
                            onClick={openCommandBar}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 hover:border-neutral-600 transition-all text-sm"
                        >
                            <IconSearch className="w-4 h-4 text-neutral-500" />
                            <span className="text-neutral-400 hidden lg:inline">Quick Actions</span>
                            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-neutral-700 text-[10px] text-neutral-400 font-mono">
                                ⌘K
                            </kbd>
                        </button>

                        {loading ? (
                            <div className="w-20 h-8 bg-neutral-800 rounded animate-pulse" />
                        ) : user ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
                                    <IconUser className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 text-sm max-w-[120px] truncate">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm"
                                >
                                    <IconLogout className="w-4 h-4" />
                                    <span className="hidden lg:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link href="/login">
                                <NavbarButton
                                    variant="secondary"
                                    className="text-neutral-300 hover:text-white"
                                >
                                    Sign In
                                </NavbarButton>
                            </Link>
                        )}

                        <Link href="/compiler">
                            <NavbarButton
                                variant="primary"
                                className="font-medium shadow-lg"
                            >
                                Run Code
                            </NavbarButton>
                        </Link>
                    </div>
                </NavBody>

                {/* MOBILE */}
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
                        className="bg-black/95 backdrop-blur-xl"
                    >
                        <div className="flex flex-col gap-6 pt-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.link}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-medium text-neutral-200 hover:text-green-400 transition"
                                >
                                    {item.name}
                                </a>
                            ))}

                            <div className="mt-6 flex flex-col gap-3">
                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="secondary"
                                    className="w-full"
                                >
                                    Sign In
                                </NavbarButton>

                                <NavbarButton
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Solve Today's DPP
                                </NavbarButton>
                            </div>

                            <p className="pt-6 text-xs text-neutral-600 text-center">
                                Built by students • For coders
                            </p>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
