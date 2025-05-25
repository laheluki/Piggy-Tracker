import { PropsWithChildren, useRef } from "react";
import { useScroll } from "framer-motion";

import AnimatedTitle from "@/components/motion/animated-title";
import ProblemItem from "@/components/landing/problem-item";

import FaceOne from "@/assets/face/1.svg?react";
import FaceTwo from "@/assets/face/2.svg?react";
import FaceThree from "@/assets/face/3.svg?react";
import FaceFour from "@/assets/face/4.svg?react";

export default function ProblemIncome({ children }: PropsWithChildren) {
    const ref = useRef<HTMLUListElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end 0.7"],
    });

    return (
        <section className="pt-16">
            <AnimatedTitle>
                <h2 className="text-center font-capriola text-3xl font-bold leading-normal tracking-tighter sm:text-4xl md:text-5xl">
                    Kesenjangan{" "}
                    <span className="text-primary">penghasilan...</span>
                </h2>
            </AnimatedTitle>

            <ul
                ref={ref}
                className="relative mt-24 grid grid-cols-12 lg:px-[15%]"
            >
                <li className="sticky top-[20%] col-start-3 col-end-12 sm:col-start-5 sm:col-end-10 lg:top-[5%]">
                    <ProblemItem
                        className="bg-primary"
                        description="Baru gajian"
                        offset={20}
                        left="sm:left-[15%]"
                        progress={scrollYProgress}
                    >
                        <FaceOne />
                    </ProblemItem>
                </li>
                <li className="sticky top-[20%] col-start-1 col-end-10 sm:col-start-3 sm:col-end-9">
                    <ProblemItem
                        className="bg-emerald-300"
                        left="sm:left-[25%]"
                        description="1 minggu gajian"
                        offset={20}
                        progress={scrollYProgress}
                    >
                        <FaceTwo />
                    </ProblemItem>
                </li>
                <li className="sticky top-[20%] col-start-3 col-end-12 sm:col-start-6 sm:col-end-12">
                    <ProblemItem
                        className="bg-emerald-700"
                        left="sm:left-[25%]"
                        description="2 minggu gajian"
                        offset={20}
                        progress={scrollYProgress}
                    >
                        <FaceThree />
                    </ProblemItem>
                </li>

                <li className="z-1 col-start-2 col-end-12 sm:col-end-10 pb-20 sm:pb-60">
                    <div>{children}</div>
                </li>

                <li className="top-[20%] col-start-3 col-end-12 sm:col-start-4 sm:col-end-11 pb-20 sm:pb-0">
                    <ProblemItem
                        className="bg-slate-300"
                        left="sm:left-[25%]"
                        description="Hari ini"
                        offset={20}
                        progress={scrollYProgress}
                        last
                    >
                        <FaceFour />
                    </ProblemItem>
                </li>
            </ul>
        </section>
    );
}
