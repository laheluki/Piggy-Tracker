import * as React from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import darkIcon from "@/assets/icons/moon.png";
import lightIcon from "@/assets/icons/sun.png";

export default function SideMenuThemeToggle() {
    const { setTheme, theme } = useTheme();

    const toggleHandle = React.useCallback(
        (e?: React.MouseEvent) => {
            const newTheme = theme === "dark" ? "light" : "dark";
            const root = document.documentElement;

            if (!document.startViewTransition) {
                setTheme(newTheme);
                return;
            }

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
            className="h-auto w-full justify-start py-2 text-foreground/85 sm:max-lg:w-auto sm:max-lg:px-2"
            title="Toggle theme"
            onClick={toggleHandle}
        >
            <span
                className={`flex size-10 items-center justify-center rounded-full text-3xl`}
            >
                {theme === "dark" ? (
                    <img src={darkIcon} alt="Dark Icon" />
                ) : (
                    <img src={lightIcon} alt="Light Icon" />
                )}
            </span>
            <span className="ml-5 truncate sm:max-lg:sr-only uppercase">
                <span className="text-muted-foreground/85">Tema: </span>
                {theme === "dark" ? "Gelap" : "Terang"}
            </span>
        </Button>
    );
}
