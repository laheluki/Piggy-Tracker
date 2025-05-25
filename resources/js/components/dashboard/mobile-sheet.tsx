import { ReactNode } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function MobileSheet({ children }: { children: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 dark:hover:bg-black/10"
                    aria-label="Open menu"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-11/12 max-w-xs p-0">
                {children}
            </SheetContent>
        </Sheet>
    );
}
