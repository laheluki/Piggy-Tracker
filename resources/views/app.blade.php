<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Piggy Tracker - Catat Keuanganmu Dengan Mudah</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

        <link rel="apple-touch-icon" sizes="180x180" href="{{ config('app.url') }}/assets/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ config('app.url') }}/assets/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ config('app.url') }}/assets/favicon/favicon-16x16.png">
        <link rel="manifest" href="{{ config('app.url') }}/assets/favicon/site.webmanifest">

        <meta property="og:site_name" content="Piggy Tracker - Catat Keuanganmu Dengan Mudah"/>
        <meta property="og:title" content="Piggy Tracker - Catat Keuanganmu Dengan Mudah"/>
        <meta property="og:url" content="{{ config('app.url') }}"/>
        <meta property="og:type" content="website"/>
        <meta property="og:image" content="{{ config('app.url') }}/assets/icons/logo.png" />

        <meta itemprop="name" content="Piggy Tracker - Catat Keuanganmu Dengan Mudah"/>
        <meta itemprop="url" content="{{ config('app.url') }}"/>
        <meta name="twitter:title" content="Piggy Tracker - Catat Keuanganmu Dengan Mudah"/>
        <meta name="twitter:url" content="{{ config('app.url') }}"/>
        <meta name="twitter:card" content="summary"/>
        <meta name="description" content="Lacak keuanganmu" />
        <!-- styles -->
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body class="antialiased">
        <div id="root"></div>
    </body>
</html>