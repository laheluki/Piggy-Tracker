import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import TransactionForm, {
    TransactionFormData,
} from "@/components/transaction/form";
import { useBlur } from "@/store/use-blur";
import ModalHeader from "@/components/modal/header";
import formatDate from "@/lib/format-date";
import { useTransactionStore } from "@/store/use-transaction";

import api from "@/lib/axios";
import { toast } from "sonner";

/**
 *
 * ALUR KERJA CREATE TRANSACTION
 * 1. User mengklik tombol untuk membuka dialog
 * 2. Dialog menampilkan form untuk menambahkan transaksi
 * 3. User mengisi form dengan data transaksi
 * 4. User mengklik tombol untuk mengirim data transaksi
 * 5. Data transaksi dikirim ke API untuk disimpan
 * 6. Jika berhasil, dialog ditutup dan data transaksi ditampilkan di tabel
 * 7. Jika gagal, pesan error ditampilkan
 */

export default function CreateTransaction({
    trigger,
    type,
}: {
    trigger: React.ReactNode;
    type: "income" | "expense";
}) {
    const [open, setOpen] = useState(false);
    const setIsBlur = useBlur((s) => s.setIsBlur);

    // mengirimkan data transaksi ke API
    const onSubmit = async (data: TransactionFormData) => {
        try {
            const response = await api.post("/api/transactions", {
                category_id: data.category,
                description: data.description,
                // 25.000.000 => 25000000
                amount: data.amount.replace(/\./g, ""),
                date: formatDate(data.date),
            });

            if (response.status === 201) {
                toast.success("Berhasil menambahkan transaksi");
                useTransactionStore.getState().triggerRefetch();
                setOpen(false);
                setIsBlur(false);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };

    const title = {
        income: "Masukin Cuan Terbaru 🔥",
        expense: "Catat Cuan Keluar disini 💸",
    };

    const description = {
        income: "Gaji, bonus, atau transfer? Semua bisa dicatat di sini!",
        expense:
            "Beli kopi, bayar tagihan, atau belanja? Semua bisa dicatat di sini!",
    };

    const textSubmit = {
        income: "➕ Tambahkan Pemasukan",
        expense: "💸 Tambahkan Pengeluaran",
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                setIsBlur(v);
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <ModalHeader
                    title={title[type]}
                    description={description[type]}
                />
                <TransactionForm
                    type={type}
                    onSubmit={onSubmit}
                    submitText={textSubmit[type]}
                />
            </DialogContent>
        </Dialog>
    );
}
