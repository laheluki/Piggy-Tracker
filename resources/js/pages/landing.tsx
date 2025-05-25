import { useEffect } from "react";

import Burden from "@/components/landing/burden";
import Footer from "@/components/landing/footer";
import ProblemIncome from "@/components/landing/problem-income";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import Mockup from "@/components/landing/mockup";
import ReasonToTrack from "@/components/landing/reason-to-track";

import api from "@/lib/axios";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/store/use-auth";
import { useBlur } from "@/store/use-blur";

export default function LandingPage() {
    const setUser = useAuthStore((state) => state.setUser);
    const isBlur = useBlur((state) => state.isBlur);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await api.get("/api/me");
                setUser(res.data);
            } catch {
                setUser(null);
            }
        };
        getUser();
    }, []);

    return (
        <>
            <div
                className={cn(
                    isBlur && "blur-lg",
                    "flex flex-grow flex-col font-capriola"
                )}
            >
                <main className="container flex flex-1 flex-col">
                    <Header />
                    <Hero />
                    <Mockup />
                    <ProblemIncome>
                        <Burden />
                    </ProblemIncome>
                    <ReasonToTrack />
                </main>
                <Footer />
            </div>
        </>
    );
}
