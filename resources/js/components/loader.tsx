import Lottie from "lottie-react";

import loadingData from "@/assets/animations/loading.json";

export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-screen">
            <Lottie
                animationData={loadingData}
                loop
                autoplay
                className="w-1/2 max-w-[300px] max-h-[300px]"
                style={{ height: "auto", width: "auto" }}
            />
            <h1 className="font-capriola font-bold md:text-4xl">
                Sabar ya, lagi nyiapin semua buat kamu...
            </h1>
        </div>
    );
}
