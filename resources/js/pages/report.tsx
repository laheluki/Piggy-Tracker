import { useEffect, useState, useMemo } from "react";
import {
    ColumnDef,
    SortingState,
    PaginationState,
} from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/transaction/datatable";

import { useTransactionStore } from "@/store/use-transaction";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import formatCurrency from "@/lib/format-currency";
import formatDate from "@/lib/format-date";
import { DataTypes } from "@/types/data-types";

export default function ReportPage() {
    const [data, setData] = useState<DataTypes[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [filterCategory, setFilterCategory] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const { shouldRefetch, resetRefetch } = useTransactionStore();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]); // Use standard SortingState
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined
    );

    const fetchTransactions = async () => {
        setIsLoading(true);

        let sortBy = "";
        let sortDir = "";
        if (sorting.length > 0) {
            sortBy = sorting[0].id;
            sortDir = sorting[0].desc ? "desc" : "asc";
        }

        try {
            const params = new URLSearchParams({
                page: String(pagination.pageIndex + 1),
                limit: String(pagination.pageSize),
                search: debouncedSearch,
                category_id: filterCategory,
                sort_by: sortBy,
                sort_dir: sortDir,
            });

            if (dateRange?.from) {
                params.append(
                    "start_date",
                    format(dateRange.from, "yyyy-MM-dd") // Format for API
                );
            }
            if (dateRange?.to) {
                params.append(
                    "end_date",
                    format(dateRange.to, "yyyy-MM-dd") // Format for API
                );
            }

            if (!filterCategory) params.delete("category_id");
            if (!debouncedSearch) params.delete("search");
            if (!sortBy) params.delete("sort_by");
            if (!sortDir) params.delete("sort_dir");
            if (!dateRange?.from) params.delete("start_date");
            if (!dateRange?.to) params.delete("end_date");

            const response = await api.get(
                "/api/transactions?" + params.toString()
            );

            setData(response.data.data.data);
            setTotalPages(response.data.data.last_page);
        } catch (error) {
            console.error("Error fetching report transactions:", error);
            setData([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
        }, 700);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        fetchTransactions();
        if (shouldRefetch) resetRefetch();
    }, [
        pagination.pageIndex,
        pagination.pageSize,
        debouncedSearch,
        sorting,
        shouldRefetch,
        filterCategory,
        dateRange,
    ]);

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
                        <ArrowUp className="ml-2 h-4 w-4 text-muted-foreground" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
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
                        <ArrowUp className="ml-2 h-3 w-3 text-muted-foreground" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="ml-2 h-3 w-3 text-muted-foreground" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const date = row.original.date;

                return (
                    <div className="capitalize">{formatDate(date, "long")}</div>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Tipe",
            cell: ({ row }) => {
                const { category } = row.original;
                const isIncome = category.type === "income";

                return (
                    <span
                        className={cn(
                            "capitalize text-sm font-medium me-2 px-2.5 py-0.5 rounded-full",
                            isIncome
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        )}
                    >
                        {isIncome ? "Pemasukan" : "Pengeluaran"}
                    </span>
                );
            },
        },
    ] as ColumnDef<DataTypes>[];

    return (
        <div className="flex-grow-[2] basis-[330px]">
            <span className="font-display text-xl">
                Lihat keuangan kamu dari atas 📈
            </span>
            <p className="font-display text-sm text-muted-foreground">
                Semua pemasukan & pengeluaran direkap rapi di sini. Biar kamu
                bisa cek kondisi dompet tanpa ribet!
            </p>
            <div className="flex-1 mt-4">
                <div className="grid items-center gap-2">
                    <div className="flex w-full flex-col gap-2.5 overflow-auto">
                        <DataTable
                            data={data}
                            columns={columns}
                            isLoading={isLoading}
                            type="all"
                            pagination={pagination}
                            onPaginationChange={setPagination}
                            sorting={sorting}
                            onSortingChange={setSorting}
                            onSearchChange={setSearch}
                            total_pages={totalPages}
                            filterCategory={filterCategory}
                            onCategoryChange={(cat) => {
                                setFilterCategory(cat);
                                setPagination((p) => ({ ...p, pageIndex: 0 }));
                            }}
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
