import * as React from "react";
import {
    ColumnDef,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    PaginationState,
    Updater,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { id as localeID } from "date-fns/locale";
import { FaXmark } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { DataTypes } from "@/types/data-types";

import ActionBar from "./action-bar";
import TableCustom from "./table";
import ButtonCreateTransaction from "./button-create-transaction";
import { DateRangePicker } from "./date-range-picker";
import DeleteTransactions from "./delete";
import ExportButton from "./export-button";
import Pagination from "./pagination";

interface DataTableProps {
    data: DataTypes[];
    columns: ColumnDef<DataTypes>[];
    isLoading?: boolean;
    type: "income" | "expense" | "all";

    pagination: PaginationState;
    onPaginationChange: (updater: Updater<PaginationState>) => void;
    sorting: SortingState;
    onSortingChange: (updater: Updater<SortingState>) => void;
    onSearchChange: (search: string) => void;
    filterCategory: string;
    onCategoryChange: (category: string) => void;
    dateRange?: DateRange | undefined;
    onDateRangeChange?: (range: DateRange | undefined) => void;

    total_pages?: number;
}

export default function DataTable({
    data,
    columns,
    isLoading,
    type,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    onSearchChange,
    total_pages,
    filterCategory,
    onCategoryChange,
    dateRange,
    onDateRangeChange,
}: DataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({});

    const uniqueCategories = React.useMemo(() => {
        return Array.from(
            new Map(
                data.map((item) => [item.category.id, item.category])
            ).values()
        );
    }, [data]);

    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        manualSorting: true,
        pageCount: total_pages ?? -1,

        state: {
            pagination,
            sorting,
            rowSelection,
        },

        onPaginationChange: onPaginationChange,
        onSortingChange: onSortingChange,
        onRowSelectionChange: setRowSelection,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),

        columnResizeMode: "onChange",
    });

    const placInputSearch = {
        all: "Cari transaksi...",
        income: "Cari pemasukan...",
        expense: "Cari pengeluaran...",
    };

    return (
        <div
            className={cn(
                isLoading && "blur-sm",
                "w-full font-display px-2 transition-opacity duration-300"
            )}
        >
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-2 w-full">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    {/* Search Input */}
                    <Input
                        placeholder={
                            placInputSearch[
                                type as keyof typeof placInputSearch
                            ]
                        }
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full sm:max-w-[300px]"
                        disabled={isLoading}
                    />

                    {/* Category Filter Popover */}
                    {type !== "all" && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost" // Use outline style
                                    className="w-full sm:w-auto" // Adjust width
                                    disabled={
                                        isLoading ||
                                        uniqueCategories.length === 0
                                    }
                                >
                                    {filterCategory
                                        ? uniqueCategories.find(
                                              (c) => c.id === filterCategory
                                          )?.name ?? "Semua Kategori"
                                        : "Semua Kategori"}
                                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-2">
                                {uniqueCategories.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {/* Option to clear filter */}
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start text-sm h-8",
                                                !filterCategory &&
                                                    "bg-accent text-accent-foreground"
                                            )}
                                            onClick={() => onCategoryChange("")}
                                        >
                                            <span className="mr-2">
                                                <FaXmark />
                                            </span>
                                            <span className="truncate">
                                                Semua Kategori
                                            </span>
                                        </Button>
                                        {/* Category list */}
                                        {uniqueCategories.map((item) => (
                                            <Button
                                                key={item.id}
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start text-sm h-8",
                                                    filterCategory ===
                                                        item.id &&
                                                        "bg-accent text-accent-foreground"
                                                )}
                                                onClick={() =>
                                                    onCategoryChange(item.id)
                                                }
                                            >
                                                <span className="mr-2">
                                                    {item.emoji}
                                                </span>
                                                <span className="truncate">
                                                    {item.name}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground p-2">
                                        Belum ada kategori
                                    </p>
                                )}
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Right side controls: Date Picker (Report) or Create Button (Income/Expense) */}
                <div className="w-full sm:w-auto flex justify-end">
                    {type === "all" ? (
                        // Render Date Picker only for Report page ('all' type)
                        <DateRangePicker
                            initialDateFrom={dateRange?.from}
                            initialDateTo={dateRange?.to}
                            locale={localeID}
                            placeholder="Pilih tanggal"
                            onUpdate={({ range }) => {
                                onDateRangeChange?.(range); // Call parent's handler
                            }}
                            disabled={isLoading}
                        />
                    ) : (
                        // Render Create Button for Income/Expense pages
                        <ButtonCreateTransaction type={type} />
                    )}
                </div>
            </div>

            {/* Table Section */}
            {isLoading && data.length === 0 ? (
                <div className="flex items-center justify-center p-10">
                    <p className="text-sm text-muted-foreground">
                        Data sedang dimuat...
                    </p>
                </div>
            ) : !isLoading && data.length === 0 ? (
                <div className="flex items-center justify-center p-10">
                    <p className="text-sm text-muted-foreground">
                        Data tidak ditemukan
                    </p>
                </div>
            ) : (
                <>
                    <div className="rounded-md border overflow-x-auto">
                        <TableCustom table={table} columns={columns} />
                    </div>
                    {/* Pagination and Action Bar */}
                    <div className="py-4">
                        {/* Action Bar - Conditionally render if rows are selected */}
                        {table.getFilteredSelectedRowModel().rows.length >
                            0 && (
                            <ActionBar table={table}>
                                <div className="flex items-center gap-2">
                                    <p className="font-display text-sm ml-2 text-muted-foreground">
                                        {
                                            table.getFilteredSelectedRowModel()
                                                .rows.length
                                        }{" "}
                                        dipilih
                                    </p>
                                    {/* Deselect All Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            table.resetRowSelection()
                                        }
                                    >
                                        <FaXmark />
                                    </Button>

                                    <DeleteTransactions
                                        data={table
                                            .getSelectedRowModel()
                                            .rows.map((row) => row.original)}
                                    />
                                    {type === "all" && (
                                        <ExportButton
                                            data={table
                                                .getSelectedRowModel()
                                                .rows.map(
                                                    (row) => row.original
                                                )}
                                        />
                                    )}
                                </div>
                            </ActionBar>
                        )}
                        {/* Pagination Component */}
                        <Pagination table={table} />
                    </div>
                </>
            )}
        </div>
    );
}
