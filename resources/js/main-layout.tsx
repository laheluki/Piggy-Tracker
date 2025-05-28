import { Outlet } from "react-router";

import { MobileSheet } from "@/components/dashboard/mobile-sheet";
import SideMenu from "@/components/dashboard/side-menu";
import { cn } from "@/lib/utils";
import { useBlur } from "@/store/use-blur";

export default function MainLayout() {
    const isBlur = useBlur((state) => state.isBlur);

    return (
        <div
            className={cn(
                isBlur && "blur-xs relative z-10",
                "container flex flex-grow min-h-screen flex-col px-0 sm:flex-row"
            )}
        >
            <div className="flex flex-grow flex-col px-0 sm:flex-row">
                <header className="top-0 z-10 max-sm:sticky sm:w-20 lg:w-64">
                    <div className="flex items-center justify-between border-b-2 border-primary-depth bg-primary p-2 text-primary-foreground/80 sm:hidden">
                        <MobileSheet>
                            <SideMenu />
                        </MobileSheet>
                        <a
                            href="/"
                            title="Piggy Tracker"
                            className=" flex h-16 w-14 items-center"
                        >
                            <img
                                src="/assets/icons/logo.png"
                                className="size-11"
                            />
                        </a>
                    </div>
                    <div className="fixed inset-y-0 w-[inherit] border-r-2 max-sm:hidden">
                        <SideMenu />
                    </div>
                </header>
                <main className="flex flex-1 flex-row gap-6 px-6 pb-24 pt-6 sm:pb-6 lg:gap-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
