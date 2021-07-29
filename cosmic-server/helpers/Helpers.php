<?php

use Illuminate\Support\Facades\Log;

class Helpers 
{

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
}