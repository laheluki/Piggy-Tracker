import { createElement } from "react";
import { createBrowserRouter } from "react-router";

import MainLayout from "./main-layout";
import ProtectedRoute from "@/components/protected-routes";

// pages
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ErrorBoundary from "@/pages/error-boundary";
import IncomPage from "@/pages/income";
import ExpensePage from "@/pages/expense";
import ReportPage from "@/pages/report";

export const router = createBrowserRouter([
    {
        path: "/",
        errorElement: createElement(ErrorBoundary),
        children: [
            { index: true, element: createElement(LandingPage) },
            {
                element: createElement(ProtectedRoute),
                children: [
                    {
                        element: createElement(MainLayout),
                        children: [
                            {
                                path: "dashboard",
                                element: createElement(Dashboard),
                            },
                            {
                                path: "income",
                                element: createElement(IncomPage),
                            },
                            {
                                path: "expense",
                                element: createElement(ExpensePage),
                            },
                            {
                                path: "report",
                                element: createElement(ReportPage),
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
