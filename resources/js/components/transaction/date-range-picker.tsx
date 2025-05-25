import { useState, useEffect, useRef } from "react";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
    format,
    addDays,
    differenceInDays,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subMonths,
    Locale,
} from "date-fns";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";

const ensureDateObject = (
    dateInput?: Date | string | null
): Date | undefined => {
    if (!dateInput) return undefined;
    if (typeof dateInput === "string") {
        try {
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return undefined;
            return date;
        } catch (e) {
            console.error("Error parsing date string:", dateInput, e);
            return undefined;
        }
    }
    return dateInput;
};

// Props definition similar to the previous custom component
export interface DateRangePickerProps {
    /** Initial value for start date */
    initialDateFrom?: Date | string | null;
    /** Initial value for end date */
    initialDateTo?: Date | string | null;
    /** Click handler for applying the updates from DateRangePicker. */
    onUpdate?: (values: { range: DateRange | undefined }) => void; // Simplified: only range needed now
    /** Alignment of popover */
    align?: "start" | "center" | "end";
    /** Option for locale object (date-fns) */
    locale?: Locale; // Use date-fns Locale type
    /** Maximum number of days allowed in range */
    maxDays?: number;
    /** Placeholder text */
    placeholder?: string;
    /** ClassName */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
}

// Define presets using date-fns
interface Preset {
    name: string;
    label: string;
    range: () => DateRange;
}

const PRESETS = (locale?: Locale): Preset[] => [
    {
        name: "today",
        label: "Hari ini",
        range: () => ({
            from: startOfDay(new Date()),
            to: endOfDay(new Date()),
        }),
    },
    {
        name: "yesterday",
        label: "Kemarin",
        range: () => {
            const yesterday = addDays(new Date(), -1);
            return { from: startOfDay(yesterday), to: endOfDay(yesterday) };
        },
    },
    {
        name: "last7",
        label: "7 Hari Terakhir",
        range: () => ({
            from: startOfDay(addDays(new Date(), -6)),
            to: endOfDay(new Date()),
        }),
    },
    {
        name: "last14",
        label: "14 Hari Terakhir",
        range: () => ({
            from: startOfDay(addDays(new Date(), -13)),
            to: endOfDay(new Date()),
        }),
    },
    {
        name: "last30",
        label: "30 Hari Terakhir",
        range: () => ({
            from: startOfDay(addDays(new Date(), -29)),
            to: endOfDay(new Date()),
        }),
    },
    {
        name: "thisWeek",
        label: "Minggu Ini",
        range: () => ({
            from: startOfWeek(new Date(), { locale }),
            to: endOfWeek(new Date(), { locale }),
        }),
    },
    {
        name: "lastWeek",
        label: "Minggu Lalu",
        range: () => {
            const lastWeekStart = startOfWeek(addDays(new Date(), -7), {
                locale,
            });
            const lastWeekEnd = endOfWeek(addDays(new Date(), -7), { locale });
            return { from: lastWeekStart, to: lastWeekEnd };
        },
    },
    {
        name: "thisMonth",
        label: "Bulan Ini",
        range: () => ({
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
        }),
    },
    {
        name: "lastMonth",
        label: "Bulan Lalu",
        range: () => {
            const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
            const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
            return { from: lastMonthStart, to: lastMonthEnd };
        },
    },
];

export function DateRangePicker({
    className,
    initialDateFrom,
    initialDateTo,
    onUpdate,
    align = "start", // Default align to start like example
    locale,
    maxDays = MAX_DATE_RANGE_DAYS, // Use constant or default
    placeholder = "Pilih rentang tanggal", // Default placeholder
    disabled = false,
}: DateRangePickerProps & React.HTMLAttributes<HTMLDivElement>) {
    // Combine props

    const [isOpen, setIsOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
        undefined
    );

    // Internal state for the selected date range during interaction
    const [range, setRange] = useState<DateRange | undefined>(() => {
        const from = ensureDateObject(initialDateFrom);
        const to = ensureDateObject(initialDateTo);
        return from ? { from, to } : undefined;
    });

    // Ref to store the state when the popover was opened (for cancellation)
    const openedRangeRef = useRef<DateRange | undefined>(undefined);

    const [isSmallScreen, setIsSmallScreen] = useState(
        typeof window !== "undefined" ? window.innerWidth < 768 : false // Use md breakpoint
    );

    // Date formatting function using date-fns
    const formatDate = (date: Date, fmt: string = "LLL dd, y"): string => {
        try {
            return format(date, fmt, { locale });
        } catch (e) {
            console.error("Error formatting date:", date, e);
            return "Invalid Date";
        }
    };

    // --- Effects ---
    useEffect(() => {
        const handleResize = (): void => {
            setIsSmallScreen(window.innerWidth < 768); // md breakpoint
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Check if current range matches a preset
    useEffect(() => {
        if (!range?.from) {
            setSelectedPreset(undefined);
            return;
        }
        const currentFromTime = startOfDay(range.from).getTime();
        // Use startOfDay for 'to' comparison if it exists, otherwise compare just 'from' for single day presets
        const currentToTime = range.to
            ? startOfDay(range.to).getTime()
            : currentFromTime;

        let matchedPreset: string | undefined = undefined;
        for (const preset of PRESETS(locale)) {
            const presetRange = preset.range();
            if (presetRange.from && presetRange.to) {
                const presetFromTime = startOfDay(presetRange.from).getTime();
                const presetToTime = startOfDay(presetRange.to).getTime();

                if (
                    currentFromTime === presetFromTime &&
                    currentToTime === presetToTime
                ) {
                    matchedPreset = preset.name;
                    break;
                }
            } else if (presetRange.from) {
                // Handle single-date presets like 'Today' if needed
                const presetFromTime = startOfDay(presetRange.from).getTime();
                if (
                    currentFromTime === presetFromTime &&
                    currentToTime === presetFromTime
                ) {
                    // Check if range is just one day
                    matchedPreset = preset.name;
                    break;
                }
            }
        }
        setSelectedPreset(matchedPreset);
    }, [range, locale]);

    // --- Event Handlers ---
    const handleOpenChange = (open: boolean) => {
        if (open) {
            // Store the current range when opening
            openedRangeRef.current = range;
        } else {
            setRange(openedRangeRef.current);
        }
        setIsOpen(open);
    };

    const handleSelect: SelectRangeEventHandler = (selectedRange) => {
        // Directly update internal state on calendar interaction
        if (selectedRange) {
            // Basic validation within selection if needed
            if (maxDays && selectedRange.from && selectedRange.to) {
                if (
                    differenceInDays(selectedRange.to, selectedRange.from) >=
                    maxDays
                ) {
                    toast.error(
                        `Rentang tanggal maksimal adalah ${maxDays} hari.`
                    );
                    // Optionally revert to previous valid range or just prevent setting 'to' beyond maxDays
                    // For now, we allow selection but validate on Update.
                }
            }
            setRange(selectedRange);
        } else {
            // Allow clearing selection in calendar
            setRange(undefined);
        }
    };

    const handlePresetSelect = (presetName: string) => {
        const preset = PRESETS(locale).find((p) => p.name === presetName);
        if (preset) {
            setRange(preset.range());
            // Optionally close popover after selecting preset on small screens
            // if (isSmallScreen) setIsOpen(false);
        }
    };

    const handleUpdate = () => {
        // Validation before updating parent
        if (maxDays && range?.from && range?.to) {
            if (differenceInDays(range.to, range.from) >= maxDays) {
                toast.error(`Rentang tanggal maksimal adalah ${maxDays} hari.`);
                return; // Prevent update
            }
        }
        setIsOpen(false); // Close popover
        // Only call onUpdate if the range has actually changed from when it was opened
        if (JSON.stringify(range) !== JSON.stringify(openedRangeRef.current)) {
            onUpdate?.({ range });
        }
    };

    const handleReset = () => {
        setRange(undefined); // Clear internal state
        setIsOpen(false); // Close popover
        onUpdate?.({ range: undefined }); // Notify parent
    };

    const handleCancel = () => {
        setRange(openedRangeRef.current); // Revert to state when opened
        setIsOpen(false); // Close popover
    };

    const PresetButton = ({ preset }: { preset: Preset }) => (
        <Button
            variant="ghost"
            className={cn(
                "w-full justify-start px-2 h-auto py-1.5 text-sm",
                selectedPreset === preset.name && "bg-muted font-semibold"
            )}
            onClick={() => handlePresetSelect(preset.name)}
        >
            {preset.label}
        </Button>
    );

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    id="date-range-trigger"
                    disabled={disabled}
                    className={cn(
                        "w-full sm:w-[300px] justify-start text-left text-md"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {range?.from ? (
                        range.to ? (
                            <>
                                {formatDate(range.from)} -{" "}
                                {formatDate(range.to)}
                            </>
                        ) : (
                            formatDate(range.from)
                        )
                    ) : (
                        <>
                            <span>{placeholder}</span>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto" align={"end"}>
                <div className="flex flex-col sm:flex-row">
                    {" "}
                    {/* Responsive layout */}
                    {/* Presets Section (visible on larger screens) */}
                    {!isSmallScreen && (
                        <div className="flex flex-col gap-1 border-r border-border p-3 min-w-[150px]">
                            {PRESETS(locale).map((preset) => (
                                <PresetButton
                                    key={preset.name}
                                    preset={preset}
                                />
                            ))}
                        </div>
                    )}
                    <div className="flex flex-col">
                        {/* Preset Select (visible on smaller screens) */}
                        {isSmallScreen && (
                            <div className="p-3 border-b border-border">
                                <Select
                                    value={selectedPreset}
                                    onValueChange={(value) => {
                                        if (value) handlePresetSelect(value);
                                    }}
                                >
                                    <SelectTrigger className="w-full h-9 text-sm">
                                        <SelectValue placeholder="Select preset..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRESETS(locale).map((preset) => (
                                            <SelectItem
                                                key={preset.name}
                                                value={preset.name}
                                                className="text-sm"
                                            >
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Calendar Section */}
                        <Calendar
                            initialFocus // Focus calendar on open
                            mode="range"
                            defaultMonth={range?.from ?? new Date()} // Start view at selected 'from' or current month
                            selected={range}
                            onSelect={handleSelect} // Update internal state directly
                            numberOfMonths={isSmallScreen ? 1 : 2} // Responsive months
                            locale={locale} // Pass locale to calendar
                            disabled={disabled} // Pass disabled state
                            // Add other react-day-picker props as needed (e.g., disabled dates)
                        />

                        {/* Action Buttons Section */}
                        <div className="flex justify-end gap-2 p-3 border-t border-border">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="text-white"
                                onClick={handleReset}
                                disabled={!range?.from}
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleUpdate}
                                disabled={!range?.from}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
        // </div>
    );
}
