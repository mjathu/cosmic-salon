<?php

use App\Models\User;
use Illuminate\Support\Facades\Log;

class Helpers 
{

    const STAFF_DEFAULT_PASSWORD = 'staff123';

    public static function encodeId($value)
    {
        if(is_array($value))
        {
            return array_map(function($item) { return Hashids::encode($item); }, $value);
        }
        else
        {
            return Hashids::encode($value);
        }
    }

    public static function decodeId($value)
    {
        if(is_array($value))
        {
            return array_map(function($value) { return (int) array_values(Hashids::decode($value))[0]; }, $value);
        }
        else
        {
            return (int) array_values(Hashids::decode($value))[0];
        }
    }

    public static function getStaffAccountSetupUrl(User $user)
    {
        return config('app.url').'/staff-account-setup?id='.$user->hashid;
    }

    public static function getUserEmailVerificationUrl(User $user)
    {
        return config('app.url').'/verify-email?id='.$user->hashid;
    }

    public static function getResetPasswordUrl(string $email, string $token)
    {
        return config('app.url').'/reset-password?token='.$token.'&email='.$email;
    }



}