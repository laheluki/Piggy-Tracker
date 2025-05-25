import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BrainIcon,
    PiggyBankIcon,
    WalletIcon,
    LineChartIcon,
    ReceiptIcon,
    CalendarIcon,
    DollarSignIcon,
    ShieldIcon,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import AnimatedTitle from "@/components/motion/animated-title";

import { useBlur } from "@/store/use-blur";

import ThinkingIllustration from "@/assets/illustration/thinking.svg?react";

const reasons = [
    {
        icon: <WalletIcon className="group-hover:text-primary" />,
        title: "Kontrol Pengeluaran 💸",
        content:
            "Biar gak kebingungan uang kemana aja tiap bulan. Dompet aman, hati tenang! 😌",
    },
    {
        icon: <PiggyBankIcon className="group-hover:text-primary" />,
        title: "Target Menabung 🐷",
        content:
            "Punya impian liburan? Gadget baru? Nabung yuk, biar cepet kesampaian! ✨",
    },
    {
        icon: <LineChartIcon className="group-hover:text-primary" />,
        title: "Analisis Pola 📊",
        content:
            "Pantau gaya hidup kamu dari pola pengeluaran. Siapa tau ternyata jajan boba tiap hari 🤭",
    },
    {
        icon: <ReceiptIcon className="group-hover:text-primary" />,
        title: "Menghindari Utang 🚫💳",
        content:
            "Jangan sampai akhir bulan ngutang terus. Catat biar lebih terkontrol! 💪",
    },
    {
        icon: <CalendarIcon className="group-hover:text-primary" />,
        title: "Perencanaan Jitu 🗓️",
        content:
            "Rencanain pengeluaran bulanan kayak pro. Gak ada lagi tanggal tua panik! 🔥",
    },
    {
        icon: <DollarSignIcon className="group-hover:text-primary" />,
        title: "Sadar Finansial 💡",
        content:
            "Mulai kenal sama kebiasaan keuanganmu sendiri. Ini langkah pertama jadi Sultan! 👑",
    },
    {
        icon: <ShieldIcon className="group-hover:text-primary" />,
        title: "Siaga Dana Darurat 🛡️",
        content:
            "Siapa tau tiba-tiba HP rusak atau harus ke dokter. Siapkan backup! 📱⚕️",
    },
    {
        icon: <BrainIcon className="group-hover:text-primary" />,
        title: "Tenang Pikiran 🧘‍♂️",
        content:
            "Gak lagi was-was akhir bulan. Hidup lebih chill karena finansial terkendali. 🍃",
    },
];

export default function ReasonToTrack() {
    const { setIsBlur, isBlur } = useBlur();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [isIllustrationClicked, setIsIllustrationClicked] = useState(false);

    const handleIllustrationClick = () => {
        setIsIllustrationClicked((prev) => !prev);
    };

    const useResponsiveRadius = () => {
        const [radius, setRadius] = useState(220);

        useEffect(() => {
            const updateRadius = () => {
                const w = window.innerWidth;
                setRadius(w < 640 ? 120 : 220);
            };

            updateRadius();
            window.addEventListener("resize", updateRadius);
            return () => window.removeEventListener("resize", updateRadius);
        }, []);

        return radius;
    };

    const radius = useResponsiveRadius();

    return (
        <section className="relative pb-40 overflow-x-hidden">
            <AnimatedTitle>
                <h2 className="text-center font-capriola text-3xl font-bold leading-normal tracking-tighter sm:text-4xl md:text-5xl">
                    Kenapa harus di <span className="text-primary">catat</span>{" "}
                    sih?
                </h2>
            </AnimatedTitle>

            <div className="relative mx-auto sm:mt-8 flex h-[400px] w-full max-w-[800px] items-center justify-center">
                <motion.div
                    className="absolute left-1/2 top-1/2 z-10 size-96 -translate-x-1/2 -translate-y-1/2 text-white flex items-center justify-center text-4xl cursor-pointer"
                    onClick={handleIllustrationClick}
                    animate={
                        isIllustrationClicked
                            ? { scale: 1 }
                            : { opacity: [1, 0.5, 1] }
                    }
                    transition={
                        isIllustrationClicked
                            ? { duration: 0.3 }
                            : {
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                              }
                    }
                >
                    <ThinkingIllustration className="w-1/2 h-1/2 sm:w-full sm:h-full" />
                </motion.div>

                {reasons.map((reason, i) => {
                    const angle = (i / reasons.length) * 2 * Math.PI;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius + 30;
                    const delay = i * 0.05;

                    return (
                        <div key={i}>
                            <motion.button
                                className="absolute group z-50 size-14 rounded-full bg-muted shadow-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer hover:border hover:border-primary"
                                style={{
                                    top: `calc(50% + ${y}px - 1.75rem)`,
                                    left: `calc(50% + ${x}px - 1.75rem)`,
                                }}
                                initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                }}
                                animate={{
                                    opacity: isIllustrationClicked ? 1 : 0,
                                    scale: isIllustrationClicked ? 1 : 0.5,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    delay,
                                }}
                                onClick={() => {
                                    setOpenIndex(i);
                                    setIsBlur(!isBlur);
                                }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {reason.icon}
                            </motion.button>

                            {/* Dialog modal */}
                            <Dialog
                                open={openIndex === i}
                                onOpenChange={(o) => {
                                    setOpenIndex(o ? i : null);
                                    setIsBlur(!isBlur);
                                }}
                            >
                                <DialogContent className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">
                                        {reason.title}
                                    </h3>
                                    <p>{reason.content}</p>
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
