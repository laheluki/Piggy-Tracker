import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { GoDownload } from "react-icons/go";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DataTypes } from "@/types/data-types";
import formatDate from "@/lib/format-date";
import formatCurrency from "@/lib/format-currency";

interface ExportButtonProps {
    data: DataTypes[];
}

export default function ExportButton({ data }: ExportButtonProps) {
    const formatData = data.map((item) => ({
        Kategori: `${item.category.emoji} ${item.category.name}`,
        Deskripsi: item.description,
        Tanggal: formatDate(item.date, "long"),
        Jumlah: formatCurrency(item.amount, "currency"),
        Tipe: item.category.type === "income" ? "Pemasukan" : "Pengeluaran",
    }));

    const exportData = (format: "xlsx" | "csv") => {
        const mimeTypes = {
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            csv: "text/csv;charset=utf-8",
        };

        const nameFile = `transactions_${formatDate(new Date(), "long")}`;

        try {
            const worksheet = XLSX.utils.json_to_sheet(formatData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet);
            const excelBuffer = XLSX.write(workbook, {
                bookType: format,
                type: "array",
            });
            const blob = new Blob([excelBuffer], {
                type: mimeTypes[format],
            });

            saveAs(blob, `${nameFile}.${format}`);
        } catch (error) {
            toast.error(
                "An error occurred while exporting the data. Please try again."
            );
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon">
                    <GoDownload />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-max p-2" side="bottom" align="end">
                <div className="flex flex-row gap-2">
                    <Button
                        variant="outline"
                        className="w-[48%]"
                        onClick={() => exportData("xlsx")}
                    >
                        Excel
                    </Button>
                    <Button
                        variant="outline"
                        className="w-[48%]"
                        onClick={() => exportData("csv")}
                    >
                        CSV
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
