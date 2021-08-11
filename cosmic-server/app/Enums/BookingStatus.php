<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class BookingStatus extends Enum
{
    const BOOKED =   'booked';
    const NOSHOW =   'noshow';
    const CANCELLED = 'cancelled';
    const COMPLETED = 'completed';
}
