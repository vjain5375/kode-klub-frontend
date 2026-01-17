"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconBrandGithub,
    IconBrandX,
    IconBrandLinkedin,
    IconMail,
    IconBrandDiscord,
} from "@tabler/icons-react";

export function FooterSocialDock() {
    const socialLinks = [
        {
            title: "GitHub",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-400 hover:text-white transition" />
            ),
            href: "https://github.com/kodeclub-rgipt",
        },
        {
            title: "LinkedIn",
            icon: (
                <IconBrandLinkedin className="h-full w-full text-neutral-400 hover:text-white transition" />
            ),
            href: "https://linkedin.com",
        },
        {
            title: "Discord",
            icon: (
                <IconBrandDiscord className="h-full w-full text-neutral-400 hover:text-white transition" />
            ),
            href: "https://discord.com",
        },
        {
            title: "X (Twitter)",
            icon: (
                <IconBrandX className="h-full w-full text-neutral-400 hover:text-white transition" />
            ),
            href: "https://twitter.com",
        },
        {
            title: "Email",
            icon: (
                <IconMail className="h-full w-full text-neutral-400 hover:text-white transition" />
            ),
            href: "mailto:kodeclub@rgipt.ac.in",
        },
    ];

    return (
        <div className="w-full py-12 flex flex-col items-center gap-4 border-t border-neutral-800 bg-black">
            <p className="text-xs text-neutral-500 tracking-wide">
                Connect with Kode Club • RGIPT
            </p>

            <FloatingDock
                items={socialLinks}
                mobileClassName="translate-y-0"
            />

            <p className="text-[11px] text-neutral-600">
                Built by students. Maintained by coders.
            </p>
        </div>
    );
}
