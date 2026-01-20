"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconBrandGithub,
    IconBrandWhatsapp,
    IconBrandInstagram,
    IconMail,
    IconHome,
} from "@tabler/icons-react";

export function FooterSocialDock() {
    const socialIcons = [
        {
            title: "GitHub",
            icon: <IconBrandGithub className="h-full w-full" />,
            href: "https://github.com/vjain5375?tab=repositories",
        },
        {
            title: "Instagram",
            icon: <IconBrandInstagram className="h-full w-full" />,
            href: "https://www.instagram.com/kode_club_rgipt/",
        },
        {
            title: "Home",
            icon: <IconHome className="h-full w-full" />,
            href: "/",
        },
        {
            title: "WhatsApp",
            icon: <IconBrandWhatsapp className="h-full w-full" />,
            href: "https://chat.whatsapp.com/KIknb8dNIWy7ANX0aEKjpZ",
        },
        {
            title: "Email",
            icon: <IconMail className="h-full w-full" />,
            href: "mailto:kodeclub@gmail.com",
        },
    ];

    const socialLinks = socialIcons.map((item) => ({
        ...item,
        icon: <div className="h-full w-full flex items-center justify-center text-neutral-400 hover:text-blue-400 transition-colors">{item.icon}</div>,
    }));

    return (
        <div className="w-full py-12 flex flex-col items-center gap-4 border-t border-neutral-800 bg-black">
            <p className="text-xs text-neutral-500 tracking-wide">
                Connect with Kode Club • RGIPT
            </p>

            <FloatingDock
                items={socialLinks}
                desktopClassName="bg-black/40 border border-neutral-800 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:bg-black/60"
                mobileClassName="translate-y-0"
            />

            <p className="text-[11px] text-neutral-600">
                Built by students. Maintained by coders.
            </p>
        </div>
    );
}
