import { type PropsWithChildren, useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import { cn } from "@/lib/utils";

type ProblemItemProps = {
    description: string;
    progress: MotionValue<number>;
    last?: boolean;
    offset?: number;
    className?: string;
    left?: string;
};

type AnimatedNumberProps = {
    from?: number;
    prefix?: string;
    suffix?: string;
};

export default function ProblemItem({
    description,
    offset = 0,
    last,
    progress,
    children,
    className,
    left = "left-[5%]",
}: PropsWithChildren<ProblemItemProps & AnimatedNumberProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", `start ${offset}%`],
    });
    const scale = useSpring(
        useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.5, 1, 1, 0.85]),
        {
            stiffness: 25,
        }
    );
    const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    const exitOpacity = useTransform(
        progress,
        [last ? 0.38 : 0.34, 0.38],
        [1, last ? 1 : 0]
    );
    const exitScale = useTransform(
        progress,
        last ? [0.42, 0.55] : [0.34, 0.425],
        [1, 0.65]
    );

    const originTop = last && { className: "lg:origin-top" };

    return (
        <motion.div ref={ref} {...originTop} style={{ scale, opacity }}>
            <motion.div
                {...originTop}
                style={{ scale: exitScale, opacity: exitOpacity }}
            >
                <AspectRatio
                    ratio={1}
                    className={cn(
                        "flex flex-col items-center justify-center overflow-hidden rounded-full bg-muted text-center max-w-[min(100vw,100%)] max-h-[min(100vw,100%)] sm:max-w-[min(100vw,70%)] sm:max-h-[min(100vw,70%)]",
                        className,
                        last && "scale-200"
                    )}
                >
                    <span className={cn("absolute sm:top-[5%] sm:w-1/2", left)}>
                        {children}
                    </span>
                    <span className="z-1 pt-[70%] sm:pt-[40%] leading-none sm:text-[0.65vw] lg:text-[min(0.5vw,0.5rem)]">
                        <span className="block max-w-52 text-balance text-base sm:text-[2rem]">
                            {description}
                        </span>
                    </span>
                </AspectRatio>
            </motion.div>
        </motion.div>
    );
}
