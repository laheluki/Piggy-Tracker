<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\SocialAuthCallbackController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    // route "/auth/register" -> RegisterController -> __invoke
    Route::post('/register', RegisterController::class);

    // route "/auth/login" -> LoginController -> __invoke
    Route::post('/login', LoginController::class);

    /**
     * SOCIAL AUTH
     * GOOGLE
     * cara kerja social auth
     * untuk web akan kita sediakan link yang akan mengarah ke route redirect
     * setelah user diarahkan, maka akan terbuka halaman login yang disediakan oleh GITHUB | GOOGLE
     */

    /**
     * user akan mengunjungi halaman auth milik provider
     * HANYA UNTUK AUTH VIA WEB TIDAK UNTUK MOBILE
     * setelah user berhasil login user akan diarahkan ke route callback untuk kita ambil data loginnya
     */

    // route "/auth/{provider}/callback" -> SocialAuthCallbackController -> __invoke
    Route::get("/{provider}/callback", SocialAuthCallbackController::class);
});

Route::middleware('auth.jwt')->group(function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/logout', [UserController::class, 'logout']);

    // categories
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories', [CategoryController::class, 'getCategories']);

    // transactions
    Route::post('/transactions', [TransactionController::class, 'createTransaction']);
    Route::get('/summary', [TransactionController::class, 'summaryReport']);
    Route::get('/transactions', [TransactionController::class, 'getTransactions']);
    Route::put('/transactions/{transaction}', [TransactionController::class, 'updateTransaction']);
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'deleteTransaction']);
    Route::delete('/transactions', [TransactionController::class, 'deleteTransactions']);
});
