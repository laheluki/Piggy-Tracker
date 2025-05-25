import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import CardMoney from "@/components/dashboard/card-money";
import ChartByMonth from "@/components/dashboard/chart-by-month";
import ChartByCategory from "@/components/dashboard/chart-by-category";

import getMonthYear from "@/lib/get-month-year";
import getRandomColor from "@/lib/get-random-colors";
import { useAuthStore } from "@/store/use-auth";
import { cn } from "@/lib/utils";
import { MONTH } from "@/constants/month";
import api from "@/lib/axios";

interface DetailData {
    summary: {
        income: string;
        expense: string;
        balance: string;
    };

    category_summary: {
        income: [
            {
                category: string;
                total: string;
            }
        ];
        expense: [
            {
                category: string;
                total: string;
            }
        ];
    };

    monthly: [
        {
            month: string;
            income: string;
            expense: string;
        }
    ];
}

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const [data, setData] = useState<DetailData>();

    async function getDetailData() {
        try {
            const response = await api.get("/api/summary");
            if (response.status === 200) {
                setData(response.data.data);
            }
        } catch (error) {
            toast.error("gagal mendapatkan data");
        }
    }

    useEffect(() => {
        getDetailData();
    }, []);

    const chartIncome = useMemo(() => {
        if (!data) return [];
        return data.category_summary.income.map((item) => ({
            ...item,
            total: Number(item.total),
            fill: getRandomColor(),
        }));
    }, [data]);

    const chartExpense = useMemo(() => {
        if (!data) return [];
        return data.category_summary.expense.map((item) => ({
            ...item,
            total: Number(item.total),
            fill: getRandomColor(),
        }));
    }, [data]);

    const chartMonthly = useMemo(() => {
        if (!data) return [];

        return data.monthly.map((item) => ({
            month: MONTH[item.month as keyof typeof MONTH],
            income: Number(item.income),
            expense: Number(item.expense),
        }));
    }, [data]);

    return (
        <div className="flex-grow-[2] basis-[330px] font-capriola">
            <span className="text-xl">Hai, {user?.name} 👋</span>

            <div
                className={cn(
                    !data &&
                        "blur-sm cursor-not-allowed pointer-events-none select-none"
                )}
            >
                {/* income & expense & balance */}
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <>
                        <CardMoney
                            icon="FcBullish"
                            title="Cuan Masuk"
                            amount={data ? Number(data.summary.income) : 0}
                        />
                        <CardMoney
                            icon="FcBearish"
                            title="Cuan Keluar"
                            amount={data ? Number(data.summary.expense) : 0}
                        />
                        <CardMoney
                            icon="FcMoneyTransfer"
                            title="Sisa Cuan"
                            amount={data ? Number(data.summary.balance) : 0}
                        />
                    </>
                </div>

                {/* chart income & expense by category */}
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <ChartByCategory
                        title="Asal-usul Cuan"
                        desc={`${
                            MONTH[
                                getMonthYear().month.toLowerCase() as keyof typeof MONTH
                            ]
                        } ${getMonthYear().year}`}
                        chartData={chartIncome}
                    />

                    <ChartByCategory
                        title="Lari Kemana nih Cuan?"
                        desc={`${
                            MONTH[
                                getMonthYear().month.toLowerCase() as keyof typeof MONTH
                            ]
                        } ${getMonthYear().year}`}
                        chartData={chartExpense}
                    />
                </div>

                {/* chart income & expense by date */}
                <div className="flex  gap-3 mt-3">
                    <ChartByMonth
                        title="Pergerakan Duit tiap Bulan"
                        desc={`${MONTH["january"]} - ${MONTH["december"]} ${
                            getMonthYear().year
                        }`}
                        chartData={chartMonthly}
                    />
                </div>
            </div>
        </div>
    );
}
