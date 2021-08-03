<?php

namespace App\Enums;

use BenSampo\Enum\Enum;


final class RoleType extends Enum
{
    const ADMIN = 'admin';
    const STAFF = 'staff';
    const CUSTOMER = 'customer';
}
