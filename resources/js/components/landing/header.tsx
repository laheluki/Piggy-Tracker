import { useNavigate } from "react-router";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

import { useModalAuth } from "@/store/use-modal-auth";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth";

import Logo from "@/assets/icons/logo.png";
import { useBlur } from "@/store/use-blur";

export default function Header() {
    const { setModalOpen, setView } = useModalAuth();
    const setIsBlur = useBlur((state) => state.setIsBlur);
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    return (
        <header className={cn("relative flex justify-center")}>
            <div className="z-1 flex w-full items-center justify-between gap-2 px-2 sm:px-8">
                <div className="flex flex-1 items-center justify-start gap-1 max-sm:hidden">
                    <Button variant="ghost" size="icon" asChild>
                        <a
                            href="https://github.com/laheluki/piggy-tracker"
                            target="_blank"
                        >
                            <Github className="size-6" />
                        </a>
                    </Button>

                    <ThemeToggle />
                </div>

                {/* icon */}
                <a
                    href="/"
                    title="Piggy Tracker"
                    className="group flex h-16 w-14 flex-col items-center gap-1 rounded-b-3xl bg-secondary/30 px-[6px] pt-2 text-2xl transition-colors hover:bg-primary/25 dark:bg-card dark:hover:bg-border/70 sm:size-32 sm:rounded-b-4xl sm:pt-4 sm:text-3xl lg:w-36 lg:text-4xl"
                >
                    <img
                        src="/assets/icons/logo.png"
                        className="w-[1.5em] group-hover:animate-bounce"
                    />
                    <span className=" -tracking-widest max-sm:sr-only text-center">
                        Tracker
                    </span>
                </a>

                <div className="flex flex-1 items-center justify-end">
                    {user ? (
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/dashboard")}
                        >
                            <span className="text-lg">Lanjut</span>
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setModalOpen(true);
                                setView("sign-in");
                                setIsBlur(true);
                            }}
                        >
                            <span className="text-lg">Masuk</span>
                        </Button>
                    )}
                </div>
            </div>

            <div className="fixed bottom-4 right-4 z-50 sm:hidden">
                <ThemeToggle className="size-12 border border-solid border-border bg-card/40 backdrop-blur-lg"></ThemeToggle>
            </div>
        </header>
    );
}
