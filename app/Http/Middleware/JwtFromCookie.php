<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Ambil token dari cookie jika belum ada di header
        $token = $request->bearerToken() ?? $request->cookie('access_token');

        if (!$token) {
            return response()->json(['message' => 'Token tidak ditemukan.'], 401);
        }

        try {
            // Set token ke JWTAuth dan autentikasi user
            JWTAuth::setToken($token);
            $user = JWTAuth::authenticate();

            if (!$user) {
                return response()->json(['message' => 'User tidak ditemukan.'], 401);
            }

            // Login user secara manual
            // auth()->login($user);
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token kedaluwarsa.'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Token tidak valid.'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Gagal mengautentikasi token.'], 401);
        }

        return $next($request);
    }
}
