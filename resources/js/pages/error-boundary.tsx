import { isRouteErrorResponse, useParams, useRouteError } from "react-router";
import Lottie from "lottie-react";

import errorData from "@/assets/animations/error.json";

export default function ErrorBoundary() {
    const error = useRouteError();
    const { status } = useParams();

    const finalStatus = isRouteErrorResponse(error)
        ? error.status.toString()
        : status?.toString() ?? "500";

    const errorMessage: Record<string, { title: string; description: string }> =
        {
            "404": {
                title: "404 - Halaman Tidak Ditemukan",
                description:
                    "Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.",
            },
            "403": {
                title: "403 - Akses Ditolak",
                description:
                    "Anda tidak memiliki izin untuk mengakses halaman ini.",
            },
            "401": {
                title: "401 - Tidak Terautentikasi",
                description:
                    "Silakan login terlebih dahulu untuk mengakses halaman ini.",
            },
            "500": {
                title: "500 - Kesalahan Server",
                description:
                    "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
            },
        };

    const fallbackStatus = errorMessage[finalStatus] ? finalStatus : "500";
    const messageObj = errorMessage[fallbackStatus];

    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen font-capriola">
            <Lottie
                animationData={errorData}
                loop
                autoplay
                className="w-1/2 max-w-[300px] max-h-[300px]"
                style={{ height: "auto", width: "auto" }}
            />
            <h1 className="text-4xl font-bold mt-4">{messageObj.title}</h1>
            <p className="text-muted-foreground mt-2">
                {messageObj.description}
            </p>
        </div>
    );
}
