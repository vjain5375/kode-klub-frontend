import type { Metadata } from "next";
import { Outfit, Inter, Fira_Code } from "next/font/google"; // Ensure Outfit is imported
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { NavbarDemo } from "@/components/layout/NavbarDemo";
import { Footer } from "@/components/layout/Footer";
import { GlobalVideoBackground } from "@/components/layout/GlobalVideoBackground";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CommandBar } from "@/components/features/navigation/CommandBar"; // Restore CommandBar
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

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
                    outfit.variable,
                    inter.variable,
                    firaCode.variable,
                    "font-[family-name:var(--font-outfit)]"
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <GlobalVideoBackground />
                        <SmoothScroll>
                            <div className="relative z-10 flex min-h-screen flex-col">
                                <NavbarDemo />
                                <main className="flex-1 pt-16">{children}</main>
                                <Footer />
                                <CommandBar />
                            </div>
                        </SmoothScroll>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
