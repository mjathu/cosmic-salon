<?php

namespace App\Enums;

use BenSampo\Enum\Enum;


final class ResponseCode extends Enum
{
    const CODE_200 = 200;   // OK
    const CODE_201 = 201;   // created
    const CODE_204 = 204;   // no content
    const CODE_400 = 400;	// Bad request
    const CODE_401 = 401;	// Unauthenticated
    const CODE_403 = 403;	// Unauthorized
    const CODE_404 = 404;	// Not Found
    const CODE_405 = 405;   // Method not allowed
    const CODE_422 = 422;	// Unprocessable Entity (validation failed)
    const CODE_429 = 429;   // Too many attempts
    const CODE_500 = 500;   // Server error
    const CODE_503 = 503;   // Unavailable
}