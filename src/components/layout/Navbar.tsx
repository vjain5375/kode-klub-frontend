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
import { usePathname } from "next/navigation";
import { useState } from "react";

export function NavbarDemo() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "DPPs", link: "/dpp" },
        { name: "Compiler", link: "/compiler" },
        { name: "Leaderboard", link: "/leaderboard" },
        { name: "Resources", link: "/resources" },
    ];

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

                    {/* COMMAND CTA */}
                    <div className="flex items-center gap-3">
                        <span className="hidden md:block text-xs text-neutral-500">
                            ⌘ Dev Mode
                        </span>

                        <NavbarButton
                            variant="secondary"
                            className="text-neutral-300 hover:text-white"
                        >
                            Sign In
                        </NavbarButton>

                        <NavbarButton
                            variant="primary"
                            className="font-medium shadow-lg"
                        >
                            Run Code
                        </NavbarButton>
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
