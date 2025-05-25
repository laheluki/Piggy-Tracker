<?php

namespace App\Http\Controllers;


/**
 * ALUR AUTHENTIKASI GOOGLE
 * 1. User mengklik tombol login dengan google
 * 2. User diarahkan ke halaman login google
 */

class SocialAuthRedirectController extends Controller
{
    public function __invoke()
    {
        // ubah array menjadi string url agar aman dari url injection
        // contoh: https://accounts.google.com/o/oauth2/v2/auth?client_id=123&redirect_uri=http:/localhost:8000/auth/google/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent
        $query = http_build_query([
            'client_id'     => env('GOOGLE_CLIENT_ID'),
            'redirect_uri'  => env('GOOGLE_REDIRECT_URI'),
            'response_type' => 'code',
            'scope'         => 'openid email profile',
            'access_type'   => 'offline',
            'prompt'        => 'consent',
        ]);

        $url =  "https://accounts.google.com/o/oauth2/v2/auth?$query";

        // https://accounts.google.com/o/oauth2/v2/auth?client_id=123&redirect_uri=http:/localhost:8000/auth/google/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent


        return redirect($url);
    }
}
