import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TransactionForm, {
    TransactionFormData,
} from "@/components/transaction/form";
import ModalHeader from "@/components/modal/header";

import api from "@/lib/axios";
import { useTransactionStore } from "@/store/use-transaction";
import { useBlur } from "@/store/use-blur";
import formatDate from "@/lib/format-date";
import formatCurrency from "@/lib/format-currency";

export default function UpdateTransaction({
    data,
    type,
}: {
    data: any;
    type: string;
}) {
    const [open, setOpen] = useState(false);
    const [defaultValues, setDefaultValues] =
        useState<Partial<TransactionFormData>>();
    const setIsBlur = useBlur((s) => s.setIsBlur);

    useEffect(() => {
        if (open) {
            setDefaultValues({
                description: data.description,
                amount: formatCurrency(data.amount, "decimal").replace(
                    /[.,]/g,
                    ""
                ),
                date: new Date(data.date),
                category: data.category_id,
            });
        }
    }, [open]);

    const onSubmit = async (formData: TransactionFormData) => {
        try {
            const response = await api.put(`/api/transactions/${data.id}`, {
                category_id: formData.category,
                description: formData.description,
                amount: formData.amount.replace(/\./g, ""),
                date: formatDate(formData.date),
            });

            if (response.status === 200) {
                toast.success("Transaksi berhasil diubah");
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

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                setIsBlur(v);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="w-9 h-9">
                    <FaPencilAlt />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <ModalHeader
                    title="Ubah Transaksi"
                    description="Ubah transaksi ini sesuai dengan data yang benar"
                />
                {defaultValues && (
                    <TransactionForm
                        type={type as "income" | "expense"}
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                        submitText="Ubah Transaksi"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
