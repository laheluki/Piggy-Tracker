import { type PropsWithChildren, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type AnimatedMockupProps = {
    className?: string;
    move?: number;
};

export default function AnimatedMockup({
    move = 20,
    children,
    className,
}: PropsWithChildren<AnimatedMockupProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"], // Animasi mulai saat elemen mulai masuk viewport
    });

    const scroll = useSpring(scrollYProgress, {
        stiffness: 30,
        damping: 15,
    });

    // Efek scale, opacity, dan posisi bergerak saat scroll
    const scale = useTransform(scroll, [0, 1], [0.8, 1]);
    const opacity = useTransform(scroll, [0, 1], [0, 1]);
    const y = useTransform(scroll, [0, 1], [`${move}%`, "0%"]);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                y, // Gerakan vertikal berdasarkan scroll
                scale, // Skala berubah dari kecil ke besar
                opacity, // Transparansi berubah
            }}
        >
            {children}
        </motion.div>
    );
}
