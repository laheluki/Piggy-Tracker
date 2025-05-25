<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * ALUR KERJA LOGIN
 * 1. User mengirimkan data ke endpoint POST "api/auth/login"
 * 2. Data yang dikirimkan akan divalidasi menggunakan service Validator
 * 3. Jika validasi gagal, maka akan mengembalikan response error
 * 4. Jika validasi berhasil, maka akan mencari user berdasarkan email
 * 5. Jika user tidak ada atau password yang dikirimkan berbeda, maka akan mengembalikan response error
 * 6. Jika user ada dan password sesuai, maka akan membuat token JWT untuk user tersebut
 */

class LoginController extends Controller
{
    // terima semua data kiriman dari "/auth/login"
    public function __invoke(Request $request)
    {
        // rules validasi untuk login user
        $rules = [
            'email'     => 'required',
            'password'  => 'required',
        ];

        // kustom pesan validasi
        $messages = [
            'email.required' => 'Email tidak boleh kosong',
            'password.required' => 'Password tidak boleh kosong'
        ];

        // membuat validasi dari data yang dikirimkan menggunakan service Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        // jika validasi gagal kembalikan exception
        if ($validator->fails()) {
            return ResponseHelper::validationErrorResponse($validator);
        }

        try {
            // cari user berdasarkan email
            $user = User::where('email', $request->email)->first();

            // jika user tidak ada atau password yang dikirimkan berbeda balikan exception
            //  $user = null
            if (!$user || !Hash::check($request->password, $user->password)) {
                return ResponseHelper::unauthorizedResponse('Email atau password salah.');
            }


            $token = JWTAuth::fromUser($user);
        } catch (\Exception $e) {
            // jika user gagal login di buat balikan exception
            return ResponseHelper::internalServerErrorResponse('Terjadi kesalahan di server. Silakan coba lagi nanti.');
        }

        // jika token berhasil di buat, kembalikan pesan berhasil beserta token dan data user
        // dan jika user login menggunakan "web" kita juga akan secara otomatis set cookie nya

        return ResponseHelper::sendResponse(200, 'Login berhasil.', [
            'user' => $user,
            'token' => $token
        ])->cookie(
            'access_token',
            $token,
            config('jwt.ttl'), // sekitar 3 hari
            null,
            null,
            false, //TODO: secure (set true if using HTTPS)
            true,  // httpOnly
            false,
            'Strict'
        );
    }
}
