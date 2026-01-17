import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { NavbarDemo } from "@/components/layout/NavbarDemo";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CommandBar } from "@/components/features/navigation/CommandBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Kode Club - Learn, Code, Compete",
    description: "The official platform for Kode Club.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    inter.className
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SmoothScroll>
                        <div className="flex min-h-screen flex-col">
                            <NavbarDemo />
                            <main className="flex-1 pt-16">{children}</main>
                            <Footer />
                            <CommandBar />
                        </div>
                    </SmoothScroll>
                </ThemeProvider>
            </body>
        </html>
    );
}
