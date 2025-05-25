<?php

namespace App\Helpers;

use Illuminate\Contracts\Validation\Validator;

class ResponseHelper
{
    public static function sendResponse(int $status_code, string $message, $data = null)
    {
        // Siapkan response dengan message
        $response = ['message' => $message];

        // Jika ada data, tambahkan ke response
        if (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response, $status_code);
    }

    public static function validationErrorResponse(Validator $validator)
    {
        //  ambil semua error
        $errors = $validator->errors()->all();

        // jika ada error ambil error pertama
        // jika tidak ada error, kembalikan pesan default
        $message = $errors[0] ?? 'Terjadi kesalahan validasi.';
        return self::sendResponse(422, $message);
    }

    public static function unauthorizedResponse(string $message = 'Unauthorized')
    {
        return self::sendResponse(401, $message);
    }

    public static function internalServerErrorResponse(string $message = 'Terjadi kesalahan server.')
    {
        return self::sendResponse(500, $message);
    }
}
