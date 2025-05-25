<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * CARA KODE __invoke
 * ketika user berhasil login ke google,
 * google akan mengirimkan authorization code ke URL yang sudah ditentukan (https://localhost:8000/auth/google/callback)
 * authorization code ini digunakan untuk mendapatkan access token
 * access token ini digunakan untuk mendapatkan informasi user dari google
 */

/**
 * CARA KERJA handleGoogle
 * code yang diterima dari google digunakan untuk mendapatkan access token
 * access token ini digunakan untuk mendapatkan informasi user dari google
 * kita akan mengirim request ke google untuk mendapatkan access token
 * setelah itu kita akan mengirim request ke google untuk mendapatkan informasi user
 * setelah itu kita akan menyimpan informasi user ke database
 * jika user sudah terdaftar, kita akan mengupdate informasi user
 * jika user belum terdaftar, kita akan membuat user baru
 */

/**
 * CARA KERJA finalizeAuth
 * kita akan mengecek apakah user sudah terdaftar dengan akun sosial
 * jika sudah terdaftar, kita akan mengupdate informasi user
 * jika belum terdaftar, kita akan membuat user baru
 * kita akan menyimpan informasi akun sosial ke database
 * kita akan membuat token JWT untuk user
 * kita akan mengembalikan token JWT ke client
 */

class SocialAuthCallbackController extends Controller
{
    public function __invoke(Request $request)
    {
        // Cek apakah ada parameter 'code' di URL
        $code = $request->query('code');
        $from = $request->query('from');

        // Jika tidak ada, kembalikan error
        if (!$code) {
            return $this->errorResponse('Authorization code not received', 401);
        }

        try {
            return $this->handleGoogle($code, $from ?? '');
        } catch (\Exception $e) {
            return $this->errorResponse('Authentication failed', 500);
        }
    }

    protected function handleGoogle(string $code, string $from)
    {
        // Kirim permintaan POST ke Google untuk mendapatkan access token
        $response = Http::asForm()->post("https://oauth2.googleapis.com/token", [
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
            'grant_type' => 'authorization_code',
            'code' => $code,
        ]);

        $data = $response->json();
        $accessToken = $data['access_token'] ?? null;

        if (!$accessToken) {
            return $this->errorResponse('Access token not received from Google', 401);
        }

        // Kirim permintaan GET ke Google untuk mendapatkan informasi pengguna
        $googleUser = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v2/userinfo')->json();

        return $this->finalizeAuth(
            $googleUser['id'],
            $googleUser['email'],
            $googleUser['name'] ?? $googleUser['email'],
            $from
        );
    }

    protected function finalizeAuth(string $providerId, string $email, string $name, string $from)
    {
        // Cek apakah pengguna sudah terdaftar dengan akun sosial
        $socialAccount = SocialAccount::where('provider_id', $providerId)
            ->first();

        // Jika akun sosial ditemukan, ambil pengguna terkait
        if ($socialAccount) {
            $user = $socialAccount->user;
        } else {
            // Jika tidak ditemukan, buat pengguna baru
            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => null]
            );

            SocialAccount::create([
                'user_id' => $user->id,
                'provider_id' => $providerId,
            ]);
        }

        // buatkan token JWT
        $token = JWTAuth::fromUser($user);

        // Jika token tidak berhasil dibuat, kembalikan error
        if (!$token) {
            return $this->errorResponse('Failed to generate token', 401);
        }

        // respon untuk API
        if ($from === 'api') {
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => config('jwt.ttl'),
                'user' => $user,
            ]);
        };

        // respon untuk Web
        return redirect('/dashboard')
            ->cookie(
                'access_token',
                $token,
                config('jwt.ttl'),
                '/',
                null,
                false, //TODO: set true jika sudah HTTPS
                true,
                false,
                'Strict'
            );
    }

    protected function errorResponse(string $message, int $status)
    {
        if (request()->wantsJson()) {
            return response()->json(['error' => $message], $status);
        }

        return redirect("/error");
    }
}
