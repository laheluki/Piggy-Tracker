<?php

namespace App\Services;

use Illuminate\Support\Carbon;

class ReportService
{
    /**
     * penjelasan singkat:
     * Dapatkan ringkasan transaksi berdasarkan kategori untuk bulan dan tahun saat ini.
     * Hasilnya berupa total pemasukan dan pengeluaran, dikelompokkan berdasarkan nama kategori.
     */
    public static function getCategorySummary($user, $year, $month)
    {
        $start = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();

        $data = $user->transactions()
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->whereBetween('date', [$start, $end])
            ->selectRaw('categories.type, categories.name as category, SUM(amount) as total')
            ->groupBy('categories.type', 'categories.name')
            ->get()
            ->groupBy('type');

        return [
            'income' => $data->get('income') ?? [],
            'expense' => $data->get('expense') ?? [],
        ];
    }

    /**
     * penjelasan singkat:
     * Dapatkan data grafik bulanan dari Januari sampai Desember untuk tahun saat ini.
     * Data ini berisi total pemasukan dan pengeluaran untuk setiap bulan.
     */

    public static function getMonthlyChart($user, $year)
    {
        $transactions = $user->transactions()
            ->selectRaw("MONTH(date) AS month, categories.type, SUM(amount) AS total")
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->whereRaw("YEAR(date) = ?", [$year])
            ->groupByRaw("MONTH(date), categories.type")
            ->get();

        // Group by int month
        $grouped = $transactions->groupBy(fn($t) => (int) $t->month);

        return collect(range(1, 12))->map(function ($month) use ($grouped) {
            $income = $grouped->get($month)?->where('type', 'income')->first()?->total ?? 0;
            $expense = $grouped->get($month)?->where('type', 'expense')->first()?->total ?? 0;

            return [
                'month' => strtolower(Carbon::create()->month($month)->format('F')),
                'income' => "$income",
                'expense' => "$expense",
            ];
        });
    }

    /**
     * penjelasan singkat:
     * Dapatkan ringkasan transaksi untuk bulan tertentu.
     * Mengembalikan total pemasukan, pengeluaran, dan saldo bersih.
     */

    public static function getSummary($user)
    {
        $now = now();

        $income = $user->transactions()
            ->whereYear('date', $now->year)
            ->whereMonth('date', $now->month)
            ->whereHas('category', fn($q) => $q->where('type', 'income'))
            ->sum('amount');

        $expense = $user->transactions()
            ->whereYear('date', $now->year)
            ->whereMonth('date', $now->month)
            ->whereHas('category', fn($q) => $q->where('type', 'expense'))
            ->sum('amount');

        return [
            'income' => $income,
            'expense' => $expense,
            'balance' => $income - $expense,
        ];
    }
}
