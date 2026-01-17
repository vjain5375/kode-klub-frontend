"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Cpu, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: <Code2 className="h-8 w-8" />,
        title: "Daily Practice",
        description: "Consistency is key. New challenges every single day.",
        color: "from-blue-500/20 to-cyan-500/20",
        shadow: "group-hover:shadow-blue-500/10",
    },
    {
        icon: <Cpu className="h-8 w-8" />,
        title: "Instant Execution",
        description: "Run code in 4+ languages with our sandboxed compiler.",
        color: "from-purple-500/20 to-pink-500/20",
        shadow: "group-hover:shadow-purple-500/10",
    },
    {
        icon: <Users className="h-8 w-8" />,
        title: "Live Leaderboards",
        description: "Compete with peers and climb the global rankings.",
        color: "from-amber-500/20 to-orange-500/20",
        shadow: "group-hover:shadow-amber-500/10",
    },
];

export function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const headerY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <section ref={containerRef} className="py-32 relative">
            <div className="container">
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="mx-auto max-w-2xl text-center mb-20"
                >
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                        Everything you need <br /> to <span className="text-primary">excel</span>.
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        A platform designed for growth, performance, and competition.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -12, scale: 1.02 }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border bg-background/50 p-8 transition-all duration-300 hover:border-primary/20 hover:shadow-2xl",
                feature.shadow
            )}
        >
            <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br", feature.color)} />

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-background/80 text-primary group-hover:shadow-inner">
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        {feature.icon}
                    </motion.div>
                </div>
                <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-primary">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">{feature.description}</p>
            </div>
        </motion.div>
    );
}
