<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $userId = 1;

        $categories = Category::where('user_id', $userId)->get();

        foreach ($categories as $category) {
            $count = $category->type === 'income' ? 70 : 30;

            for ($i = 0; $i < $count; $i++) {
                $date = Carbon::createFromDate(2025, rand(1, 12), rand(1, 28));
                $amount = fake()->randomFloat(2, 10000, 1000000);
                $description = $this->getDescription($category->name);

                Transaction::create([
                    'user_id' => $userId,
                    'category_id' => $category->id,
                    'description' => $description,
                    'amount' => $amount,
                    'date' => $date->toDateString(),
                ]);
            }
        }
    }

    private function getDescription(string $categoryName): string
    {
        return match ($categoryName) {
            'Gaji' => fake()->randomElement([
                'Gaji bulan April diterima',
                'Transfer gaji dari perusahaan',
                'Gaji masuk rekening',
                'Slip gaji turun hari ini'
            ]),
            'Bonus' => fake()->randomElement([
                'Bonus akhir proyek',
                'Insentif tambahan performa kerja',
                'Bonus tahunan cair',
                'Dapat THR Lebaran'
            ]),
            'Investasi' => fake()->randomElement([
                'Keuntungan dari saham',
                'Dividen reksadana cair',
                'Pencairan hasil investasi',
                'ROI dari crypto'
            ]),
            'Makanan' => fake()->randomElement([
                'Makan siang di warteg',
                'Beli kopi kekinian',
                'Dinner bareng temen di resto',
                'Ngemil bakso bakar'
            ]),
            'Transportasi' => fake()->randomElement([
                'Naik ojek ke kantor',
                'Isi bensin motor',
                'Bayar parkir mall',
                'Tiket kereta ke Bandung'
            ]),
            'Hiburan' => fake()->randomElement([
                'Langganan Netflix',
                'Beli tiket nonton bioskop',
                'Top up game online',
                'Main karaoke bareng teman'
            ]),
            'Tagihan' => fake()->randomElement([
                'Bayar listrik PLN',
                'Tagihan air bulan ini',
                'Cicilan kartu kredit',
                'Bayar internet rumah'
            ]),
            'Belanja' => fake()->randomElement([
                'Belanja di e-commerce',
                'Beli baju baru',
                'Checkout keranjang Shopee',
                'Belanja bulanan di supermarket'
            ]),
            default => 'Transaksi umum'
        };
    }
}
