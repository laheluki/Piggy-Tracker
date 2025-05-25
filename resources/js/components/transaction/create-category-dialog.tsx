import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Picker, { Theme } from "emoji-picker-react";
import { FaRegSquarePlus } from "react-icons/fa6";
import { MdInsertEmoticon } from "react-icons/md";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import InputLabel from "@/components/landing/input-label";
import { useTheme } from "@/components/theme-provider";

import { toast } from "sonner";
import { useState } from "react";
import api from "@/lib/axios";

interface CreateCategoryModalProps {
    type: "income" | "expense";
    onSuccess?: () => void;
}

/**
 *
 * ALUR PEMBUATAN KATEGORI
 * 1. User mengklik tombol "Buat Kategori"
 * 2. Muncul modal untuk mengisi nama kategori dan memilih ikon
 * 3. User mengisi nama kategori dan memilih ikon
 * 4. User mengklik tombol "Buat Kategori"
 * 5. Data dikirim ke API
 */

/**
 *
 * PENJELASAN KODE
 * 1. Import library dan komponen yang dibutuhkan
 * 2. Buat schema validasi menggunakan zod
 * 3. Buat type untuk data form menggunakan z.infer
 * 4. Buat form menggunakan useForm dari react-hook-form
 * 5. Buat fungsi onSubmit untuk mengirim data ke API
 */

export default function CreateCategoryDialog({
    type,
    onSuccess,
}: CreateCategoryModalProps) {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);

    // Schema validasi menggunakan zod
    const categorySchema = z.object({
        category: z.string().min(1, "Nama kategori harus diisi"),
        emoji: z.string().min(1, "Ikon kategori harus dipilih"),
    });
    // Type untuk data form menggunakan z.infer
    type CategoryFormData = z.infer<typeof categorySchema>;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        mode: "onChange",
    });

    const onSubmit = async (data: CategoryFormData) => {
        try {
            const response = await api.post("/api/categories", {
                name: data.category,
                emoji: data.emoji,
                type: type,
            });

            if (response.status === 201) {
                toast.success(response.data.message);
                if (onSuccess) onSuccess();
            }

            setOpen(false);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center justify-start rounded-none text-muted-foreground my-2"
                >
                    <FaRegSquarePlus className="mr-2 h-4 w-4" />
                    Buat Kategori
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="font-display">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl capitalize">
                        Buat Kategori Baru
                    </AlertDialogTitle>
                    <AlertDialogDescription className=" text-sm">
                        Kategori ini akan digunakan untuk mengelompokkan
                        pemasukan atau pengeluaran.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <form className="grid gap-4">
                        <div>
                            <InputLabel
                                id="create-category"
                                labelText="Nama Kategori"
                                placeholder="Makanan, Transportasi, dll"
                                type="text"
                                invalid={!!errors.category}
                                {...register("category")}
                            />

                            {errors.category && (
                                <p className="text-red-500 text-xs mt-1 ml-2">
                                    *{errors.category.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2 mt-4">
                            <Label htmlFor={"icon"} className="">
                                Ikon
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="icon"
                                        variant="outline"
                                        className="w-full h-[150px]"
                                    >
                                        {watch("emoji") ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <span
                                                    className="text-4xl"
                                                    role="img"
                                                >
                                                    {watch("emoji")}
                                                </span>
                                                <p className="text-xs text-muted-foreground">
                                                    Ubah emoji kategori
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <MdInsertEmoticon className="size-10" />
                                                <p className="text-xs text-muted-foreground">
                                                    Pilih ikon untuk kategori
                                                    ini
                                                </p>
                                            </div>
                                        )}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0">
                                    <Picker
                                        theme={
                                            theme === "dark"
                                                ? Theme.DARK
                                                : Theme.LIGHT
                                        }
                                        onEmojiClick={(emoji) => {
                                            setValue("emoji", emoji.emoji);
                                            register("emoji").onChange({
                                                target: {
                                                    value: emoji.emoji,
                                                },
                                            });
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>

                            {errors.emoji && (
                                <p className="text-red-500 text-xs mt-1 ml-2">
                                    *{errors.emoji.message}
                                </p>
                            )}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button
                                    variant="destructive"
                                    className="mt-4"
                                    type="button"
                                >
                                    Batalkan
                                </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    className="mt-4"
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin">
                                            <svg
                                                className="w-4 h-4 text-white animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    strokeOpacity="0.5"
                                                />
                                            </svg>
                                        </span>
                                    ) : (
                                        <span className="text-sm">
                                            Buat Kategori
                                        </span>
                                    )}
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
