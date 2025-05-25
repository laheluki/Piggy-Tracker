<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * CARA KERJA KODE createTransaction
 * 1. User mengirimkan data ke endpoint POST "api/transactions"
 * 2. Data yang dikirimkan akan divalidasi menggunakan service Validator
 * 3. Jika validasi gagal, maka akan mengembalikan response error
 * 4. Jika validasi berhasil, maka akan menyimpan transaksi ke database
 * 5. Mengembalikan response sukses
 */

/**
 * CARA KERJA KODE summaryReport
 * 1. User mengirimkan request ke endpoint GET "api/transactions/summary"
 * 2. Mengambil data user yang sedang login
 * 3. Mengambil data laporan dari service ReportService
 * 4. Mengembalikan response sukses
 */

/**
 * CARA KERJA KODE getTransactions
 * 1. User mengirimkan request ke endpoint GET "api/transactions"
 * 2. Mengambil data user yang sedang login
 * 3. Membuat query dasar untuk mengambil data transaksi
 * 4. Menggunakan query builder untuk menambahkan filter dan sorting
 * 5. Menggunakan pagination untuk membatasi jumlah data yang diambil
 * 6. Mengembalikan response sukses
 */

class TransactionController extends Controller
{
    public function createTransaction(Request $request)
    {

        // rules validasi untuk transaksi
        $rules = [
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date_format:Y-m-d',
        ];

        // kostum pesan validasi
        $messages = [
            'category_id.required' => 'Category ID tidak boleh kosong',
            'category_id.exists' => 'Category ID tidak valid',
            'description.string' => 'Deskripsi harus berupa string',
            'description.max' => 'Deskripsi tidak boleh lebih dari 255 karakter',
            'amount.required' => 'Jumlah tidak boleh kosong',
            'amount.numeric' => 'Jumlah harus berupa angka',
            'amount.min' => 'Jumlah tidak boleh kurang dari 0',
            'date.required' => 'Tanggal tidak boleh kosong',
            'date.date_format' => 'Format tanggal tidak valid, gunakan format YYYY-MM-DD',
        ];

        // membuat validasi dari data yang dikirimkan menggunakan service Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return ResponseHelper::validationErrorResponse($validator);
        }

        $user = auth()->user();

        // Create the transaction
        $transaction = $user->transactions()->create([
            'category_id' => $request->category_id,
            'description' => $request->description,
            'amount' => $request->amount,
            'date' => $request->date,
        ]);

        return ResponseHelper::sendResponse(201, 'Transaksi berhasil dibuat.', ['transaction' => $transaction]);
    }

    public function summaryReport()
    {
        $user = auth()->user();
        $year = now()->year;
        $month = now()->month;

        $data =  [
            'category_summary' => ReportService::getCategorySummary($user, $year, $month),
            'monthly' => ReportService::getMonthlyChart($user, $year),
            'summary' => ReportService::getSummary($user, $month),
        ];

        return ResponseHelper::sendResponse(200, 'Berhasil mendapatkan laporan.', $data);
    }

    public function getTransactions(Request $request)
    {
        $user = auth()->user();

        // Membuat query dasar
        $query = $user->transactions()->with('category');

        // Filter tanggal dari - sampai
        $query->when($request->filled('start_date') && $request->filled('end_date'), function ($q) use ($request) {
            $q->whereBetween('date', [$request->start_date, $request->end_date]);
        });

        // Filter berdasarkan category_id
        $query->when($request->filled('category_id'), function ($q) use ($request) {
            $q->where('category_id', $request->category_id);
        });

        // Filter berdasarkan type (dari relasi category)
        $query->when($request->filled('type'), function ($q) use ($request) {
            $q->whereHas('category', function ($q) use ($request) {
                $q->where('type', $request->type); // type: 'income' or 'expense'
            });
        });

        // Filter berdasarkan amount asc/desc
        $query->when($request->filled('amount'), function ($q) use ($request) {
            $q->orderBy('amount', $request->amount);
        });

        // Filter berdasarkan date asc/desc
        $query->when($request->filled('date'), function ($q) use ($request) {
            $q->orderBy('date', $request->date);
        });

        // Filter berdasarkan search
        $query->when($request->filled('search'), function ($q) use ($request) {
            $q->where('description', 'like', '%' . $request->search . '%');
        });

        // Sorting dinamis berdasarkan sort_by dan sort_dir
        $query->when($request->filled('sort_by') && $request->filled('sort_dir'), function ($q) use ($request) {
            $allowedSorts = ['amount', 'date', 'description']; // Batasi kolom yang boleh di-sort
            $sortBy = $request->sort_by;
            $sortDir = $request->sort_dir;

            if (in_array($sortBy, $allowedSorts) && in_array($sortDir, ['asc', 'desc'])) {
                $q->orderBy($sortBy, $sortDir);
            }
        }, function ($q) {
            // Default sorting
            $q->orderByDesc('created_at');
        });

        // Ambil limit dari request, default 10
        $limit = $request->get('limit', 10);

        // Pagination
        $transactions = $query->paginate($limit);

        return ResponseHelper::sendResponse(200, 'Berhasil mendapatkan transaksi.', $transactions);
    }


    public function updateTransaction(Request $request, $id)
    {
        $rules = [
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string|max:255',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date_format:Y-m-d',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update the transaction
        $transaction = auth()->user()->transactions()->findOrFail($id);

        $transaction->update([
            'category_id' => $request->category_id,
            'description' => $request->description,
            'amount' => $request->amount,
            'date' => $request->date,
        ]);

        return response()->json([
            'message' => 'Transaction updated successfully',
            'transaction' => $transaction
        ]);
    }

    public function deleteTransaction($id)
    {
        $transaction = auth()->user()->transactions()->findOrFail($id);

        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully'
        ]);
    }

    public function deleteTransactions(Request $request)
    {
        $rules = [
            'ids' => 'required|array',
            'ids.*' => 'exists:transactions,id'
        ];

        $user = auth()->user();
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $deleted = $user->transactions()->whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => 'Transactions deleted successfully',
            'deleted_count' => $deleted
        ]);
    }
}
