import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FaRegTrashCan } from "react-icons/fa6";
import formatCurrency from "@/lib/format-currency";
import formatDate from "@/lib/format-date";
import { useState } from "react";
import { useBlur } from "@/store/use-blur";
import api from "@/lib/axios";
import { useTransactionStore } from "@/store/use-transaction";
import { DataTypes } from "@/types/data-types";

export default function DeleteTransactions({ data }: { data: DataTypes[] }) {
    const [open, setOpen] = useState(false);
    const setIsBlur = useBlur((s) => s.setIsBlur);
    const isMany = data.length > 5;
    const previewData = isMany ? data.slice(0, 5) : data;

    const onDelete = async () => {
        try {
            const ids = data.map((item) => item.id);
            const response = await api.delete("/api/transactions", {
                data: { ids },
            });

            if (response.status === 200) {
                setOpen(false);
                setIsBlur(false);
                useTransactionStore.getState().triggerRefetch();
                toast.success("berhasil menghapus transaksi");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                setIsBlur(v);
            }}
        >
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="w-9 h-9"
                    title="Delete"
                >
                    <FaRegTrashCan className="text-white" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="font-display">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Apakah kamu yakin ingin menghapus{" "}
                        {data.length > 1 && "s"}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {data.length > 1
                            ? "Semua transaksi yang dipilih akan dihapus"
                            : "Transaksi ini akan dihapus dan tidak dapat dikembalikan."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Table Preview */}
                <div className="border rounded-md mt-4 overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Tanggal
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">
                                    Jumlah
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {previewData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {formatDate(item.date, "long")}
                                    </TableCell>
                                    <TableCell className="truncate">
                                        {item.description}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(item.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {isMany && (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center italic text-sm text-muted-foreground"
                                    >
                                        + {data.length - 5} lagi...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Batalkan</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
