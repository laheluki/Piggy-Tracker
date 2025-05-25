<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * ALUR KERJA REGISTER
 * 1. User mengirimkan data ke endpoint POST "api/auth/register"
 * 2. Data yang dikirimkan akan divalidasi menggunakan service Validator
 * 3. Jika validasi gagal, maka akan mengembalikan response error
 * 4. Jika validasi berhasil, maka akan membuat user baru menggunakan model User
 */

class RegisterController extends Controller
{
    // terima semua data kiriman dari "/auth/register"
    public function __invoke(Request $request)
    {
        // rules validasi untuk registrasi user
        $rules = [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8'
        ];

        // kustom pesan validasi
        $messages = [
            'name.required' => 'Nama tidak boleh kosong',
            'email.required' => 'Email tidak boleh kosong',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password tidak boleh kosong',
            'password.min' => 'Password minimal 8 karakter'
        ];

        // membuat validasi dari data yang dikirimkan menggunakan service Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        // jika validasi gagal kembalikan exception
        if ($validator->fails()) {
            return ResponseHelper::validationErrorResponse($validator);
        }

        try {
            // coba buat user dari data yang dikirimkan tadi, hashing password dengan menggunaakan service Hash dari laravel
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
        } catch (\Exception $e) {
            // jika user gagal di buat balika exception
            return ResponseHelper::internalServerErrorResponse('Terjadi kesalahan di server. Silakan coba lagi nanti.');
        }

        // balikan pesan berhasil beserta data user yang berhasil dibuat
        return ResponseHelper::sendResponse(201, 'User berhasil dibuat.', ['user' => $user]);
    }
}
