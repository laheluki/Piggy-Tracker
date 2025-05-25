import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

// import "@/bootstrap";
import { router } from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root") as HTMLElement).render(
    <ThemeProvider defaultTheme="light" storageKey="theme-mode">
        <RouterProvider router={router} />
        <Toaster position="top-center" />
    </ThemeProvider>
);
