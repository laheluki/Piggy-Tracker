<?php

use App\Http\Controllers\SocialAuthRedirectController;
use Illuminate\Support\Facades\Route;

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
 */

// route "/auth/{provider}/redirect" -> SocialAuthRedirectController -> __invoke
Route::get("/auth/google/redirect", SocialAuthRedirectController::class);

Route::get('/{path}', function () {
    return view('app');
})->where('path', '^(?!api).*');
