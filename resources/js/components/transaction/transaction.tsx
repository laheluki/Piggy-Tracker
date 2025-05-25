import api from "@/lib/axios";
import { useTransactionStore } from "@/store/use-transaction";
import { useEffect, useState } from "react";
import DataTable from "./datatable";

import {
    ColumnDef,
    SortingState,
    PaginationState,
} from "@tanstack/react-table";
import { DataTypes } from "@/types/data-types";
import { toast } from "sonner";

export default function Transaction({
    type,
    title,
    subtitle,
    columns,
}: {
    type: "income" | "expense" | "all";
    title: string;
    subtitle: string;
    columns: ColumnDef<DataTypes>[];
}) {
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
    const [sorting, setSorting] = useState<SortingState>([]);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            let amountSortParam: "asc" | "desc" | "" = "";
            const amountSort = sorting.find((s) => s.id === "amount");
            if (amountSort) {
                amountSortParam = amountSort.desc ? "desc" : "asc";
            }

            // kita akan membuat query string
            // untuk mengirimkan data ke server
            // contoh: ?page=1&limit=10&type=income&search=food
            const params = new URLSearchParams({
                page: String(pagination.pageIndex + 1),
                limit: String(pagination.pageSize),
                type,
                search: debouncedSearch,
                category_id: filterCategory,
                amount: amountSortParam,
            });

            // hapus parameter yang tidak ada
            if (!amountSortParam) params.delete("amount");
            if (!filterCategory) params.delete("category_id");
            if (!debouncedSearch) params.delete("search");

            const response = await api.get(
                "/api/transactions?" + params.toString()
            );

            setData(response.data.data.data);
            setTotalPages(response.data.data.last_page);
        } catch (error) {
            toast.error("Gagal mengambil data transaksi");
            setData([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search input
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
        }, 700);
        return () => clearTimeout(timeout);
    }, [search]);

    // Refetch data when dependencies change
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
    ]);

    return (
        <div className="flex-grow-[2] basis-[330px]">
            <span className="font-capriola text-xl">{title}</span>
            <p className="font-capriola text-sm text-muted-foreground">
                {subtitle}
            </p>
            <div className="flex-1 mt-4">
                <div className="grid items-center gap-2">
                    <div className="flex w-full flex-col gap-2.5 overflow-auto">
                        <DataTable
                            data={data}
                            columns={columns}
                            isLoading={isLoading}
                            type={type}
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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
