import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { cn } from "@/lib/utils";

const chartConfig = {
    desktop: {
        label: "Income",
        color: "var(--primary)",
    },
    mobile: {
        label: "Expense",
        color: "var(--destructive)",
    },
} satisfies ChartConfig;

interface ChartByMonthProps {
    title: string;
    desc: string;
    chartData: {
        month: string;
        income: number;
        expense: number;
    }[];
}

export default function ChartByMonth({
    title,
    desc,
    chartData,
}: ChartByMonthProps) {
    return (
        <Card
            className={cn(
                chartData.length === 0 &&
                    "blur-sm cursor-not-allowed pointer-events-none select-none",
                "w-full bg-card text-card-foreground border-2 border-b-4 hover:bg-border/50 dark:hover:bg-border/70"
            )}
        >
            <CardHeader>
                <CardTitle className="font-display text-center">
                    {title}
                </CardTitle>
                <CardDescription className="font-display text-center">
                    {desc}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dashed"
                                    className="capitalize"
                                />
                            }
                        />
                        <Bar
                            dataKey="income"
                            fill="var(--primary)"
                            radius={4}
                            className="cursor-pointer"
                        />
                        <Bar
                            dataKey="expense"
                            fill="var(--destructive)"
                            radius={4}
                            className="cursor-pointer"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
