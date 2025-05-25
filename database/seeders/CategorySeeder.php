<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $userId = 1;

        $categories = [
            // INCOME
            ['name' => 'Gaji', 'emoji' => '💼', 'type' => 'income'],
            ['name' => 'Bonus', 'emoji' => '🎁', 'type' => 'income'],
            ['name' => 'Investasi', 'emoji' => '📈', 'type' => 'income'],
            ['name' => 'Freelance', 'emoji' => '🧑‍💻', 'type' => 'income'],
            ['name' => 'Penjualan Barang', 'emoji' => '💸', 'type' => 'income'],

            // EXPENSE
            ['name' => 'Makanan', 'emoji' => '🍔', 'type' => 'expense'],
            ['name' => 'Transportasi', 'emoji' => '🚌', 'type' => 'expense'],
            ['name' => 'Hiburan', 'emoji' => '🎮', 'type' => 'expense'],
            ['name' => 'Tagihan', 'emoji' => '💡', 'type' => 'expense'],
            ['name' => 'Belanja', 'emoji' => '🛍️', 'type' => 'expense'],
            ['name' => 'Kesehatan', 'emoji' => '💊', 'type' => 'expense'],
            ['name' => 'Pendidikan', 'emoji' => '📚', 'type' => 'expense'],
            ['name' => 'Kado', 'emoji' => '🎂', 'type' => 'expense'],
        ];

        foreach ($categories as $data) {
            Category::create([
                'user_id' => $userId,
                'name' => $data['name'],
                'emoji' => $data['emoji'],
                'type' => $data['type'],
            ]);
        }
    }
}
