import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCalendarDays } from "react-icons/fa6";
import { id as LocId } from "date-fns/locale";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import CategoryPicker from "@/components/transaction/category-picker";
import ButtonSubmit from "@/components/modal/button-submit";

import { cn } from "@/lib/utils";
import { useState } from "react";

const transactionSchema = z.object({
    description: z.string().min(1, "Deskripsi transaksi tidak boleh kosong"),
    amount: z.string().min(1, "Jumlah transaksi tidak boleh kosong"),
    date: z.date(),
    category: z.number(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

type TransactionFormProps = {
    type: "income" | "expense";
    defaultValues?: Partial<TransactionFormData>;
    onSubmit: (data: TransactionFormData) => Promise<void>;
    isSubmitting?: boolean;
    submitText: string;
};

export default function TransactionForm({
    onSubmit,
    submitText,
    type,
    defaultValues,
    isSubmitting,
}: TransactionFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        mode: "onChange",
        defaultValues,
    });
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);

    const descPlac = {
        income: "Gaji bulan ini, bonus, dll",
        expense: "Beli kopi, bayar tagihan, dll",
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 mb-4">
                {/* Description */}
                <div className="grid gap-2">
                    <Label htmlFor="description">📝 Deskripsi</Label>
                    <Textarea
                        id="description"
                        autoComplete="off"
                        {...register("description")}
                        placeholder={descPlac[type]}
                        className={cn(
                            errors.description ? "border-destructive" : ""
                        )}
                    />
                    {errors.description && (
                        <p className="text-destructive text-xs">
                            *{errors.description.message}
                        </p>
                    )}
                </div>

                {/* Amount */}
                <div className="grid gap-2">
                    <Label htmlFor="amount">💰 Jumlah</Label>
                    <Input
                        id="amount"
                        type="text"
                        autoComplete="off"
                        placeholder="500.000"
                        className={cn(
                            errors.amount ? "border-destructive" : ""
                        )}
                        {...register("amount", {
                            onChange: (e) => {
                                const value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                );
                                e.target.value = new Intl.NumberFormat(
                                    "id-ID"
                                ).format(Number(value));
                            },
                        })}
                    />
                    {errors.amount && (
                        <p className="text-destructive text-xs">
                            *{errors.amount.message}
                        </p>
                    )}
                </div>

                {/* Category & Date */}
                <div className="flex flex-col sm:flex-row w-full justify-between gap-4">
                    {/* Category */}
                    <div className="grid gap-4">
                        <Label htmlFor="category">🗂️ Kategori</Label>
                        <CategoryPicker
                            id="category"
                            name="category"
                            type={type}
                            control={control}
                        />
                    </div>

                    {/* Date */}
                    <div className="grid gap-4">
                        <Label htmlFor="date">📅 Tanggal</Label>
                        <Controller
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            className={cn(
                                                "w-full pl-3 text-left gap-2"
                                            )}
                                        >
                                            {field.value
                                                ? field.value.toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "Pilih tanggal"}
                                            <FaCalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        side="top"
                                    >
                                        <Calendar
                                            mode="single"
                                            locale={LocId}
                                            selected={field.value}
                                            onSelect={(value) =>
                                                field.onChange(value)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                </div>
            </div>

            <ButtonSubmit
                isSubmitting={!!isSubmitting}
                isValid={!!isValid}
                text={submitText}
            />
        </form>
    );
}
