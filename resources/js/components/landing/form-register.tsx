import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import InputLabel from "@/components/landing/input-label";
import SocialAuth from "@/components/landing/social-auth";
import SeparatorAuth from "@/components/landing/separator-auth";

import { useModalAuth } from "@/store/use-modal-auth";
import { useBlur } from "@/store/use-blur";
import api from "@/lib/axios";

/**
 *
 * ALUR KERJA REGISTER
 * 1. User mengisi nama lengkap, email, dan password
 * 2. User menekan tombol "Gas Daftar"
 * 3. Form akan divalidasi menggunakan react-hook-form dan zod
 * 4. Jika validasi berhasil, maka data akan dikirim ke API untuk register
 * 5. Jika register berhasil, maka user akan diarahkan ke halaman login
 */

/**
 *
 * PENJELASAN KODE
 * 1. Import library dan komponen yang dibutuhkan
 * 2. Buat schema validasi menggunakan zod
 * 3. Buat type untuk data form menggunakan z.infer
 * 4. Buat form menggunakan useForm dari react-hook-form
 * 5. Buat fungsi onSubmit untuk mengirim data ke API
 * 6. Buat fungsi untuk menangani error jika register gagal
 * 7. Buat tampilan form register
 */

export default function FormRegister() {
    const { setModalOpen, setView } = useModalAuth();
    const setIsBlur = useBlur((state) => state.setIsBlur);

    // Schema validasi menggunakan zod
    const registerSchema = z.object({
        fullname: z.string().min(1, "Nama lengkap harus diisi"),
        email: z
            .string()
            .min(1, "Email harus diisi")
            .email("Email tidak valid"),
        password: z
            .string()
            .min(1, "Kata sandi harus diisi")
            .min(8, "Kata sandi harus minimal 8 karakter"),
    });

    // Type untuk data form menggunakan z.infer
    type RegisterFormData = z.infer<typeof registerSchema>;

    // Form menggunakan useForm dari react-hook-form
    // dan validasi menggunakan zod
    // mode: "onChange" untuk validasi saat input berubah
    // resolver: zodResolver untuk menggunakan zod sebagai validasi
    // formState: { errors, isValid, isSubmitting } untuk menangani error
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    // Fungsi untuk mengirim data ke API
    // menggunakan axios
    // jika register berhasil, maka user akan diarahkan ke halaman login
    // jika register gagal, maka akan ditampilkan pesan error
    const onSubmit = async (data: RegisterFormData) => {
        try {
            const response = await api.post("/api/auth/register", {
                name: data.fullname,
                email: data.email,
                password: data.password,
            });

            if (response.status === 201) {
                toast.success("Pendaftaran berhasil! Masuk Yuk...");
                setModalOpen(false);
                setView("sign-in");
                setModalOpen(true);
            }
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
        }
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-center">Buat Akunmu</DialogTitle>
                <DialogDescription className="text-center text-muted-foreground">
                    Isi sedikit data aja, terus kamu siap mulai ngatur keuangan!
                </DialogDescription>
            </DialogHeader>
            <div>
                <SocialAuth />

                <SeparatorAuth text="atau" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div>
                            <InputLabel
                                id="fullname"
                                labelText="Nama Lengkap"
                                placeholder="Budi Doe"
                                type="text"
                                invalid={!!errors.fullname}
                                {...register("fullname")}
                            />

                            {errors.fullname && (
                                <p className="text-red-500 text-xs mt-1">
                                    *{errors.fullname.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <InputLabel
                                id="email"
                                labelText="Alamat Email"
                                placeholder="budi.doe@email.com"
                                type="email"
                                invalid={!!errors.email}
                                {...register("email")}
                            />

                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    *{errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <InputLabel
                                id="password"
                                labelText="Kata Sandi"
                                placeholder="**********"
                                type="password"
                                invalid={!!errors.password}
                                {...register("password")}
                            />

                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    *{errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant={isValid ? "default" : "secondary"}
                            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting && (
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                    ></path>
                                </svg>
                            )}
                            {isSubmitting ? "Proses nih kak..." : "Gas Daftar"}
                        </Button>
                    </div>
                </form>

                <div>
                    <p className="text-center text-sm text-muted-foreground my-4">
                        Udah punya akun?
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setTimeout(() => {
                                    setView("sign-in");
                                    setModalOpen(true);
                                }, 700);
                            }}
                            className="text-primary hover:underline underline-offset-4 cursor-pointer font-bold ml-2"
                        >
                            Masuk
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}
