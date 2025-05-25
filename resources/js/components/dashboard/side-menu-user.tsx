import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { useAuthStore } from "@/store/use-auth";
import api from "@/lib/axios";

import ImageLogo from "@/assets/icons/logo.png";
import { toast } from "sonner";

export default function SideMenuUser() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const handleLogout = async () => {
        await api.post("/api/logout");
        localStorage.setItem("logout", Date.now().toString());
        setUser(null);
        navigate("/");
        toast.success(
            "Berhasil keluar dari aplikasi, Terimakasih sudah mencoba"
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-auto w-full justify-start py-2 text-foreground/85 sm:max-lg:w-auto sm:max-lg:px-2"
                    title="Toggle user"
                >
                    <span
                        className={`flex size-10 items-center justify-center rounded-full text-3xl`}
                    >
                        <img
                            src={ImageLogo}
                            alt="Logo User"
                            className="size-9"
                        />
                    </span>
                    <span className="ml-5 truncate sm:max-lg:sr-only uppercase">
                        Profil Saya
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full ml-2">
                <div className="relative flex flex-col">
                    <div className="flex flex-row border-b-2 pb-2">
                        <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary/20 p-2">
                            <img
                                src={ImageLogo}
                                alt="Logo User"
                                className="size-9"
                            />
                        </div>

                        {user && (
                            <div className="flex flex-col items-start justify-center pl-2 text-sm font-display">
                                <span>{user.name}</span>
                                <span>{user.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-2 space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 h-10"
                            onClick={handleLogout}
                        >
                            <LogOut className="size-5" />
                            <span className="font-display">Keluar</span>
                        </Button>
                    </div>

                    <div className="flex flex-col items-center justify-center pt-4 text-xs text-muted-foreground">
                        <span className="font-display">
                            Terimakasih sudah mencoba
                        </span>
                        <span className="font-display">Piggy Tracker</span>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
