import { ColumnDef } from "@tanstack/react-table";
import { FaArrowsUpDown, FaArrowDown, FaArrowUp } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import DeleteTransactions from "@/components/transaction/delete";
import Transaction from "@/components/transaction/transaction";
import UpdateTransaction from "@/components/transaction/update";

import formatCurrency from "@/lib/format-currency";
import formatDate from "@/lib/format-date";
import { DataTypes } from "@/types/data-types";

const columns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                onClick={(e) => e.stopPropagation()}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => {
            const { emoji, name } = row.original.category;
            return (
                <div className="flex items-center gap-2 capitalize">
                    <span>{emoji}</span>
                    <span className="truncate">{name}</span>
                </div>
            );
        },
        size: 150,
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => (
            <div
                className="capitalize truncate"
                title={row.getValue("description")}
            >
                {row.getValue("description")}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Jumlah
                {column.getIsSorted() === "asc" ? (
                    <FaArrowUp className="ml-2 h-4 w-4 text-muted-foreground" />
                ) : column.getIsSorted() === "desc" ? (
                    <FaArrowDown className="ml-2 h-4 w-4 text-muted-foreground" />
                ) : (
                    <FaArrowsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        ),
        cell: ({ row }) => <div>{formatCurrency(row.original.amount)}</div>,
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="px-2"
            >
                Kapan?
                {column.getIsSorted() === "asc" ? (
                    <FaArrowUp className="ml-2 h-3 w-3 text-muted-foreground" />
                ) : column.getIsSorted() === "desc" ? (
                    <FaArrowDown className="ml-2 h-3 w-3 text-muted-foreground" />
                ) : (
                    <FaArrowsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.original.date;

            return <div className="capitalize">{formatDate(date, "long")}</div>;
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-center gap-1">
                    <UpdateTransaction data={row.original} type={"expense"} />
                    <DeleteTransactions data={[row.original]} />
                </div>
            );
        },
        size: 100,
    },
] as ColumnDef<DataTypes>[];

export default function ExpensePage() {
    return (
        <Transaction
            columns={columns}
            type="expense"
            title="Uangnya ke mana aja nih? 🔍"
            subtitle="Catat semua pengeluaranmu biar gak ada yang bocor diam-diam 💸"
        />
    );
}
