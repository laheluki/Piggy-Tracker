import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";

import Loader from "@/components/loader";

import { useAuthStore } from "@/store/use-auth";
import api from "@/lib/axios";

export default function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        const fetchUser = async () => {
            const start = Date.now();

            try {
                const res = await api.get("/api/me");
                setUser(res.data.data.user);
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            } finally {
                const elapsed = Date.now() - start;
                const delay = Math.max(0, 2000 - elapsed); // Jaga supaya minimal 700ms

                setTimeout(() => {
                    setLoading(false);
                }, delay);
            }
        };

        fetchUser();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "logout") {
                // User logout dari tab lain
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        toast.error("Silakan login untuk melanjutkan");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
