import { Pie, PieChart } from "recharts";

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

const chartRules = [{ category: "", total: 0, fill: "" }];

const chartConfig = {
    visitors: {
        label: "Trackers",
    },
} satisfies ChartConfig;

interface IChartByCategory {
    title: string;
    desc: string;
    chartData: typeof chartRules;
}

export default function ChartByCategory({
    title,
    desc,
    chartData,
}: IChartByCategory) {
    return (
        <Card
            className={cn(
                chartData.length === 0 &&
                    "blur-sm cursor-not-allowed pointer-events-none select-none",
                "w-full bg-card text-card-foreground border-2 border-b-4 hover:bg-border/50 dark:hover:bg-border/70"
            )}
        >
            <CardHeader className="items-center pb-0">
                <CardTitle className="font-display text-center">
                    {title}
                </CardTitle>
                <CardDescription className="font-display text-center">
                    {desc}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] "
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="total"
                            nameKey="category"
                            innerRadius={60}
                            className="cursor-pointer"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
