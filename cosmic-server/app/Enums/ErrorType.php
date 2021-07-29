<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ErrorType extends Enum
{
    const NotFound = 4000; // resource not found
    const CustomError = 10000; // resource not found
}
