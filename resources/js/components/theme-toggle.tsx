import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme();

    const toggleHandle = React.useCallback(
        (e?: React.MouseEvent) => {
            const newTheme = theme === "dark" ? "light" : "dark";
            const root = document.documentElement;

            // Jika browser tidak support startViewTransition
            if (!document.startViewTransition) {
                setTheme(newTheme);
                return;
            }

            // Tambahkan koordinat klik buat animasi (opsional)
            if (e) {
                root.style.setProperty("--x", `${e.clientX}px`);
                root.style.setProperty("--y", `${e.clientY}px`);
            }

            document.startViewTransition(() => {
                setTheme(newTheme);
            });
        },
        [theme, setTheme]
    );

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("text-2xl", className)}
            title="Toggle theme"
            aria-label="Toggle theme"
            onClick={toggleHandle}
        >
            {theme === "dark" ? (
                <Moon className="size-[0.8em] fill-current" />
            ) : (
                <Sun className="size-[0.8em] fill-current" />
            )}
        </Button>
    );
}
