import { useNavigate } from "react-router";
import type { Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
    AnimatedList,
    AnimatedListItem,
} from "@/components/motion/animated-list";
import AnimatedTitle from "@/components/motion/animated-title";
import AnimatedDecor from "@/components/motion/animated-decor";
import DialogAuth from "@/components/landing/dialog-auth";

import { cn } from "@/lib/utils";
import { useModalAuth } from "@/store/use-modal-auth";
import { useAuthStore } from "@/store/use-auth";
import { useBlur } from "@/store/use-blur";

import Illustration1 from "@/assets/illustration/1.svg?react";
import Illustration2 from "@/assets/illustration/2.svg?react";
import Illustration3 from "@/assets/illustration/3.svg?react";
import Illustration4 from "@/assets/illustration/4.svg?react";

const list = {
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.08,
            delayChildren: 0.5,
        },
    },
    hidden: { opacity: 0 },
} satisfies Variants;

const item = {
    visible: { opacity: 1, y: "0%", scale: 1, transition: { duration: 0.45 } },
    hidden: { opacity: 0, y: "100%", scale: 0.85 },
} satisfies Variants;

export default function Hero() {
    const { setModalOpen, setView } = useModalAuth();
    const setBlur = useBlur((state) => state.setIsBlur);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    return (
        <section className={cn("relative overflow-hidden pb-8 pt-32 lg:pt-24")}>
            {/* titles */}
            <AnimatedTitle>
                <h1 className="flex w-full flex-col items-center justify-center gap-2 text-balance py-6 text-center text-3xl font-bold capitalize leading-normal tracking-tighter sm:text-4xl sm:leading-snug md:gap-4 md:text-6xl">
                    <span>
                        Sebenarnya nggak{" "}
                        <span className="rounded-full border border-primary/50 px-[0.35em] py-[0.125em] text-primary">
                            boros.
                        </span>
                    </span>
                    <span className=" flex flex-wrap items-center justify-center ">
                        cuma lupa{" "}
                        <span className="relative stroke-current ml-3">
                            {" "}
                            nyatet aja.
                            <svg
                                className="absolute -bottom-0  w-full max-h-3"
                                viewBox="0 0 55 5"
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0.652466 4.00002C15.8925 2.66668 48.0351 0.400018 54.6853 2.00002"
                                    strokeWidth="3"
                                ></path>
                            </svg>
                        </span>
                    </span>
                </h1>
            </AnimatedTitle>

            {/* CTA */}
            <div className="mx-auto my-16 min-h-40 max-w-80 space-y-2">
                <AnimatedList variants={list} className="flex flex-col gap-3">
                    {user ? (
                        <AnimatedListItem variants={item}>
                            <Button
                                variant="link"
                                size="lg"
                                className="w-full"
                                onClick={() => navigate("/dashboard")}
                            >
                                <span className="truncate">Lanjut yuk...</span>
                            </Button>
                        </AnimatedListItem>
                    ) : (
                        <>
                            <AnimatedListItem variants={item}>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => {
                                        setModalOpen(true);
                                        setView("sign-in");
                                        setBlur(true);
                                    }}
                                >
                                    <span className="truncate">
                                        Udah punya akun? Gaskeun!
                                    </span>
                                </Button>
                            </AnimatedListItem>
                            <AnimatedListItem variants={item}>
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={() => {
                                        setModalOpen(true);
                                        setView("sign-up");
                                        setBlur(true);
                                    }}
                                >
                                    <span className="truncate">
                                        Daftar dulu, biar rapi 💸
                                    </span>
                                </Button>
                            </AnimatedListItem>
                        </>
                    )}
                </AnimatedList>
            </div>

            <div className="absolute -left-[3%] top-[17%] sm:top-[13%] -z-1 sm:left-[10%]">
                <AnimatedDecor className="origin-bottom-right" delay={0.8}>
                    <div className="size-20 -rotate-12 rounded-lg bg-gradient-to-br from-primary/70  to-transparent p-2 text-background sm:size-24 lg:size-32">
                        <Illustration1 />
                    </div>
                </AnimatedDecor>
            </div>
            <div className="absolute right-[10%] top-[13%] -z-1 max-md:hidden">
                <AnimatedDecor
                    className="origin-bottom-left"
                    move={60}
                    delay={1}
                >
                    <div className="size-24 rotate-12 rounded-lg bg-gradient-to-bl from-primary/70  to-transparent p-2 text-background lg:size-32">
                        <Illustration2 />
                    </div>
                </AnimatedDecor>
            </div>
            <div className="absolute bottom-[10%] left-[10%] -z-1 max-md:hidden">
                <AnimatedDecor
                    className="origin-top-right"
                    move={60}
                    delay={1.2}
                >
                    <div className="size-24 -rotate-6 rounded-lg bg-gradient-to-r from-cyan-200/30  to-transparent p-2 text-background lg:size-32">
                        <Illustration3 />
                    </div>
                </AnimatedDecor>
            </div>
            <div className="absolute -right-[5%] top-[31%] -z-1 sm:right-[10%] md:top-2/3">
                <AnimatedDecor className="origin-top-left" delay={1.4}>
                    <div className="size-20 rotate-12 rounded-lg bg-gradient-to-l from-cyan-200/30  to-transparent p-2 text-background sm:size-24 lg:size-32">
                        <Illustration4 />
                    </div>
                </AnimatedDecor>
            </div>

            {/* auth modal */}
            <DialogAuth />
        </section>
    );
}
