<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * ALUR MENDAPATKAN DATA USER YANG LOGIN
 * 1. User mengunjungi route GET /api/auth/me
 * 2. Kita ambil token dari request header
 * 3. Kita ambil data user dari token
 * 4. Kita kembalikan data user ke client
 * 5. Jika token tidak ada, kita kembalikan response error
 */

/**
 * ALUR LOGOUT
 * 1. User mengunjungi route POST /api/auth/logout
 * 2. Kita ambil token dari request header
 * 3. Kita invalidate token
 * 4. Kita kembalikan response logout success
 * 5. Kita hapus cookie access_token
 */

class UserController extends Controller
{
    public function me()
    {
        // ambil token dari request header

        $user = auth()->user();

        // jika token ada, kita ambil data user dari token
        return ResponseHelper::sendResponse(200, 'User data retrieved successfully.', ['user' => $user]);
    }

    public function logout()
    {
        try {
            // ambil token dari request header
            JWTAuth::invalidate(JWTAuth::getToken());

            // kembalikan response logout success
            return response()->json([
                'message' => 'Logout successful'
            ])->cookie(
                'access_token',
                '',
                -1,
                '/',
                null,
                false,
                true,
                false,
                'Strict'
            );
        } catch (\Exception $e) {
            // jika token tidak ada, kita kembalikan response error
            return ResponseHelper::sendResponse(500, 'Logout failed.', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
