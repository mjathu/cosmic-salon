<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'cosmic-api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Accept',
        'Authorization',
        'Cookie',
        'DNT',
        'Origin',
        'User-Agent',
        'X-Requested-With',
        'Refresh-Token',
        'Auth-Client',
        'Content-Type',
        'Content-Length',
        'Content-Language',
        'Client',
        'Client-Ref'
    ],

    'exposed_headers' => [
        'Accept',
        'Authorization',
        'Origin',
        'Content-Type',
        'X-Requested-With',
        'Refresh-Token'
    ],

    'max_age' => 0,

    'supports_credentials' => true,

];
