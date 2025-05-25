import { Link } from "react-router-dom";

import SideMenuItem from "@/components/dashboard/side-menu-item";
import SideMenuThemeToggle from "@/components/dashboard/side-menu-toggle-theme";
import SideMenuUser from "@/components/dashboard/side-menu-user";

export default function SideMenu() {
    return (
        <div className="flex h-full flex-col justify-between pt-6">
            <nav className="flex flex-col gap-6 px-4 sm:max-lg:px-2">
                <Link
                    to="/dashboard"
                    className="focus-visible self-start rounded-xl max-sm:ml-4 sm:max-lg:self-center lg:ml-4"
                >
                    <span className="sm:max-lg:hidden">
                        <span
                            className="font-display text-3xl font-bold -tracking-wide text-primary"
                            aria-label="Piggy Tracker"
                            title="Piggy Tracker"
                        >
                            Piggy Tracker
                        </span>
                    </span>
                </Link>

                <ul className="flex flex-col gap-y-2">
                    <SideMenuItem
                        href="/dashboard"
                        icon="FcHome"
                        label="Dasbor"
                    />
                    <SideMenuItem
                        href="/income"
                        icon="FcBullish"
                        label="Pemasukan"
                    />
                    <SideMenuItem
                        href="/expense"
                        icon="FcBearish"
                        label="Pengeluaran"
                    />
                    <SideMenuItem
                        href="/report"
                        icon="FcBarChart"
                        label="Laporan"
                    />
                </ul>
            </nav>

            <div className="space-y-2 border-t-2 px-4 pb-2 pt-2 sm:max-lg:px-2">
                <SideMenuThemeToggle />
                <SideMenuUser />
            </div>
        </div>
    );
}
