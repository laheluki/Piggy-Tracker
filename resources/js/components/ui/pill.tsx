import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const pillVariants = cva(
    "inline-flex items-center justify-center border-2 whitespace-nowrap rounded-full text-base tracking-wide transition-colors",
    {
        variants: {
            variant: {
                seblak: "bg-destructive text-white",
                kopi: "border border-orange-800 text-orange-800",
                listrik: "border border-yellow-500 text-yellow-500",
                data: "bg-primary text-white",
                game: "bg-secondary text-primary",
                bensin: "bg-amber-300 border border-yellow-500 text-white",
                shopee: "border border-orange-500 text-orange-500",
                oyen: "bg-orange-500 text-white",
                default:
                    "border-transparent bg-background dark:bg-foreground/85 dark:text-background",
            },
            size: {
                default: "px-8 py-2 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface PillProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof pillVariants> {}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <div
                className={cn(pillVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Pill.displayName = "Pill";

export { Pill, pillVariants };
