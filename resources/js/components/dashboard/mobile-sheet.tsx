import { ReactNode } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useMobileMenuSheet } from "@/store/use-mobile-menu-sheet";

export function MobileSheet({ children }: { children: ReactNode }) {
    const { isOpen, setIsOpen } = useMobileMenuSheet((state) => state);
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-10"
                    aria-label="Open menu"
                >
                    <Menu className="text-background size-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-10/12 max-w-xs p-0">
                {children}
            </SheetContent>
        </Sheet>
    );
}
