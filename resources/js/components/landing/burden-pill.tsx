import { type PropsWithChildren, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { type PillProps, Pill } from "@/components/ui/pill";

export type PillVariant = PillProps["variant"];

type BurdenPillProps = {
    name: string;
    emoji: string;
    tilt?: -1 | 0 | 1;
    variant?: PillVariant;
    className?: string;
};

export function BurdenPill({
    name,
    emoji,
    tilt = 0,
    variant,
}: PropsWithChildren<BurdenPillProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", `end start`],
    });

    const progress = scrollYProgress;

    const opacity = useTransform(progress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0, 0.2, 0.9, 1], [0.5, 1, 1, 0.75]);
    const rotate = useTransform(progress, [0.2, 0.4], [0, 3 * tilt]);
    const skewX = useTransform(progress, [0.2, 0.4], [0, -3 * tilt]);
    const x = useTransform(progress, [0.2, 0.4], ["0%", `${-50 * tilt}%`]);
    const left = useTransform(progress, [0.2, 0.4], ["0%", `${50 * tilt}%`]);

    return (
        <motion.div
            ref={ref}
            className="relative"
            style={{ opacity, scale, rotate, skewX, x, left }}
        >
            <Pill
                variant={variant}
                className="gap-4 px-4 text-[7vw] shadow-2xl sm:pl-8 sm:text-[5vw] lg:text-[min(4vw,4rem)]"
            >
                <span className="capitalize">{name}</span>
                <span className="rounded-full bg-white p-[0.15em] shadow-md grid place-items-center">
                    <span className="text-[1em]">{emoji}</span>
                </span>
            </Pill>
        </motion.div>
    );
}
