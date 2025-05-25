import { createElement } from "react";
import * as FcIcons from "react-icons/fc";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import formatCurrency from "@/lib/format-currency";
import { cn } from "@/lib/utils";

interface ICardMoney {
    icon: string;
    title: string;
    amount: number;
}

export default function CardMoney({ icon, title, amount = 0 }: ICardMoney) {
    return (
        <Card
            className={cn(
                amount === 0 &&
                    "blur-sm cursor-not-allowed pointer-events-none select-none",
                "w-full bg-card text-card-foreground border-2 border-b-4 hover:bg-border/50 dark:hover:bg-border/70"
            )}
        >
            <CardHeader className="flex flex-row items-center">
                {createElement(FcIcons[icon as keyof typeof FcIcons], {
                    className: "size-10",
                })}

                <div>
                    <CardTitle className="font-display">{title}</CardTitle>
                    <CardDescription className="font-sans text-xl">
                        {formatCurrency(amount)}
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
}
