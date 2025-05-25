import { motion } from "framer-motion";
import { DownloadIcon } from "lucide-react";

import AppLogo from "@/assets/icons/logo.png";

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative w-full bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 py-16 container rounded-t-4xl"
        >
            {/* Floating Emoji */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="absolute text-2xl sm:text-3xl left-5 top-10"
                >
                    💸
                </motion.div>
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="absolute text-2xl sm:text-3xl right-5 top-24"
                >
                    📊
                </motion.div>
                <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 7 }}
                    className="absolute text-2xl sm:text-3xl left-1/2 bottom-10"
                >
                    🐷
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full px-4 sm:px-0 flex flex-col items-center text-center space-y-6">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="flex items-center gap-3"
                >
                    <img
                        src={AppLogo}
                        className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md"
                    />
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                        Piggy Tracker
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-gray-700 text-base sm:text-lg max-w-md"
                >
                    Piggy Tracker bikin nyatet keuangan serasa main
                    game—warna-warni, gampang, dan pastinya bikin kamu makin
                    hemat 🎉
                </motion.p>

                <motion.a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm sm:text-base hover:shadow-xl"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download Aplikasi Android
                </motion.a>

                <p className="text-xs text-gray-500 mt-6">
                    © 2025 Piggy Tracker — Buat hidup finansialmu lebih seru!
                </p>
            </div>
        </motion.footer>
    );
}
