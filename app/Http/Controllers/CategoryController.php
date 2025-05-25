<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * ALUR KERJA TAMPILKAN KATEGORI (getCategories)
 * 1. User mengirimkan data ke endpoint GET "api/categories" (dapat mengirimkan query string)
 *  contoh query string: /api/categories?type=income&search=makanan&limit=10
 * 2. Data yang dikirimkan akan divalidasi menggunakan service Validator
 * 3. Jika validasi gagal, maka akan mengembalikan response error
 * 4. Jika validasi berhasil, maka akan mengambil kategori dari database
 */

/**
 * ALUR KERJA PEMBUATAN KATEGORI (store)
 * 1. User mengirimkan data ke endpoint POST "api/categories"
 * 2. Data yang dikirimkan akan divalidasi menggunakan service Validator
 * 3. Jika validasi gagal, maka akan mengembalikan response error
 * 4. Jika validasi berhasil, maka akan menyimpan kategori ke database
 * 5. Mengembalikan response sukses
 */

class CategoryController extends Controller
{
    public function getCategories(Request $request)
    {
        // buat rules validasi
        $rules = [
            'type' => 'in:income,expense',
            'search' => 'string|max:255',
        ];

        // kustom pesan validasi
        $messages = [
            'type.in' => 'Tipe kategori tidak valid.',
            'search.string' => 'Pencarian harus berupa string.',
            'search.max' => 'Pencarian tidak boleh lebih dari 255 karakter.',
        ];

        // lakukan validasi input
        $validator = Validator::make($request->query(), $rules, $messages);

        // jika validasi gagal, kembalikan exception
        if ($validator->fails()) {
            return ResponseHelper::validationErrorResponse($validator);
        }

        $user = auth()->user();

        $query = $user->categories();

        // jika ada tipe, tambahkan filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Kalau ada search, tambahkan filter
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $limit = $request->query('limit', 10);

        // ambil data kategori dari database, dengan pagination
        $categories = $query->orderByDesc('created_at')->paginate($limit);

        // kembalikan response sukses
        return ResponseHelper::sendResponse(200, 'Kategori berhasil diambil.', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        // buat rules validasi
        $rules = [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->where(function ($query) use ($request) {
                    return $query
                        ->where('user_id', auth()->id())
                        ->where('type', $request->type);
                    // rules ini digunakan untuk memastikan bahwa nama kategori yang sama tidak bisa digunakan untuk tipe kategori yang sama
                    // misalnya: kategori "Makanan" untuk tipe "income" dan "expense" bisa ada, tapi tidak bisa ada dua kategori "Makanan" untuk tipe yang sama
                }),
            ],
            'type' => 'required|in:income,expense',
            'emoji' => 'required|string|max:10',
        ];

        // kustom pesan validasi
        $messages = [
            'name.required' => 'Nama kategori tidak boleh kosong.',
            'name.string' => 'Nama kategori harus berupa string.',
            'name.max' => 'Nama kategori tidak boleh lebih dari 255 karakter.',
            'name.unique' => 'Nama kategori sudah ada.',
            'type.required' => 'Tipe kategori tidak boleh kosong.',
            'type.in' => 'Tipe kategori tidak valid.',
            'emoji.required' => 'Emoji tidak boleh kosong.',
            'emoji.string' => 'Emoji harus berupa string.',
            'emoji.max' => 'Emoji tidak boleh lebih dari 10 karakter.',
        ];

        // validasi input
        $validator = Validator::make($request->all(), $rules, $messages);

        // jika validasi gagal, kembalikan exception
        if ($validator->fails()) {
            return ResponseHelper::validationErrorResponse($validator);
        }

        $user = auth()->user();

        // jika validasi berhasil, simpan data ke database
        $data = $user->categories()->create([
            'name' => $request->name,
            'type' => $request->type,
            'emoji' => $request->emoji,
        ]);

        // jika data berhasil disimpan, kembalikan response sukses
        return ResponseHelper::sendResponse(201, 'Kategori berhasil dibuat.', [
            'category' => $data,
        ]);
    }
}
