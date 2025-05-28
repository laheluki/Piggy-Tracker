import { useEffect, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import { FaCheck } from "react-icons/fa6";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import CreateCategoryDialog from "@/components/transaction/create-category-dialog";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Category {
    id: string;
    name: string;
    emoji: string;
}

interface CategoryPickerProps<TFieldValues extends FieldValues = FieldValues> {
    id: string;
    type: "income" | "expense";
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
}

function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

/**
 *
 * ALUR KERJA CATEGORY PICKER
 * 1. User mengklik tombol untuk membuka popover
 * 2. Popover menampilkan daftar kategori yang diambil dari API
 * 3. User dapat mencari kategori menggunakan input pencarian
 * 4. User dapat memilih kategori dari daftar
 * 5. Kategori yang dipilih akan ditampilkan di tombol
 * 6. Jika kategori tidak ada, user dapat membuat kategori baru
 */

/**
 *
 * PENJELASAN KODE
 * 1. Import library dan komponen yang dibutuhkan
 * 2. Buat type untuk kategori
 * 3. Buat interface untuk props CategoryPicker
 * 4. Buat fungsi useDebounce untuk menunda pencarian (ini berguna untuk menghindari terlalu banyak request ke API)
 * 5. Buat fungsi CategoryPicker yang menerima props
 * 6. Gunakan useController dari react-hook-form untuk menghubungkan input dengan form
 * 7. Buat state untuk menyimpan kategori, loading, dan open popover
 */

export default function CategoryPicker<TFieldValues extends FieldValues>({
    id,
    type,
    name,
    control,
}: CategoryPickerProps<TFieldValues>) {
    const { field, fieldState } = useController({ name, control });
    const { value, onChange } = field;

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 700);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/categories`, {
                params: {
                    type, // secara default, ambil kategori berdasarkan type
                    limit: 5,
                    ...(debouncedSearch ? { search: debouncedSearch } : {}),
                    // jika ada pencarian, tambahkan query search
                },
            });
            setCategories(res.data.data.categories.data);
        } catch (err) {
            toast.error("Gagal mengambil kategori");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchCategories();
    }, [open]);

    useEffect(() => {
        fetchCategories();
    }, [debouncedSearch]);

    const selectedCategory = categories.find((cat) => cat.id === value);

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        className={`gap-2 w-full justify-start ${
                            fieldState.error ? "border-destructive" : ""
                        }`}
                    >
                        {selectedCategory ? (
                            <>
                                <span>{selectedCategory.emoji}</span>
                                <span>{selectedCategory.name}</span>
                            </>
                        ) : (
                            <>
                                <span>Pilih Kategori</span>
                                <HiOutlineChevronUpDown className="ml-auto h-4 w-4 opacity-50" />
                            </>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent side="top" className="font-display p-0">
                    <Command
                        onSubmit={(e) => e.preventDefault()}
                        shouldFilter={false}
                    >
                        <CommandInput
                            placeholder="Cari kategori..."
                            value={searchTerm}
                            onValueChange={(val) => setSearchTerm(val)}
                        />
                        <CreateCategoryDialog
                            type={type}
                            onSuccess={fetchCategories}
                        />
                        <CommandEmpty>
                            <div className="text-center text-sm text-muted-foreground">
                                Belum ada kategori
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            <CommandList className="">
                                {categories.map((cat) => (
                                    <CommandItem
                                        key={cat.id}
                                        onSelect={() => {
                                            onChange(cat.id);
                                            setOpen(false);
                                        }}
                                        className="w-full flex items-center"
                                    >
                                        <CategoryRow category={cat} />
                                        <FaCheck
                                            className={`ml-auto h-4 w-4 ${
                                                value === cat.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandList>
                            {loading && (
                                <div className="text-center text-sm text-muted-foreground p-2">
                                    Loading...
                                </div>
                            )}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            {fieldState.error && (
                <p className="text-destructive text-xs mt-1">
                    *{fieldState.error.message}
                </p>
            )}
        </div>
    );
}

function CategoryRow({ category }: { category: Category }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span role="img">{category.emoji}</span>
            <span>{category.name}</span>
        </div>
    );
}
