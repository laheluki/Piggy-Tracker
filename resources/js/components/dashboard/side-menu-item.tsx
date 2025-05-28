import React from "react";
import { Link, useLocation } from "react-router";
import * as FcIcons from "react-icons/fc";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useMobileMenuSheet } from "@/store/use-mobile-menu-sheet";

type SideMenuItemProps = {
    label: string;
    icon: string;
    href: string;
    hideLabel?: boolean;
};

export default function SideMenuItem({
    href,
    icon,
    label,
    hideLabel,
}: SideMenuItemProps) {
    const { pathname } = useLocation();
    const isActive = pathname === href;
    const setIsOpen = useMobileMenuSheet((state) => state.setIsOpen);

    return (
        <li>
            <Button
                variant={isActive ? "active" : "ghost"}
                className={cn(
                    "h-auto w-full justify-start py-2 sm:max-lg:w-auto sm:max-lg:px-2",
                    isActive && "border-b-2"
                )}
                asChild
            >
                <Link
                    to={href}
                    title={label}
                    {...(hideLabel && { "aria-label": label })}
                    onClick={() => setIsOpen(false)}
                >
                    <span className="relative block size-10">
                        {React.createElement(
                            FcIcons[icon as keyof typeof FcIcons],
                            { className: "size-9" }
                        )}
                    </span>
                    {!hideLabel && (
                        <span className="ml-5 truncate sm:max-lg:sr-only">
                            {label}
                        </span>
                    )}
                </Link>
            </Button>
        </li>
    );
}
