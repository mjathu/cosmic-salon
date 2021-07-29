<?php

use Illuminate\Support\Facades\Log;

class ResponseHelper 
{

    public static function buildJsonResponse($statusCode, $message = null, $data = null)
    {
        $respose_data = [
            'code' => $statusCode,
            'message' => $message,
        ];

        if(!is_null($data))
        {
            if(is_object($data) && get_class($data) === 'Illuminate\Validation\Validator')
            {
                $respose_data['errors'] = $data->errors();
            }
            else
            {
                $respose_data['data'] = $data;
            }
        }

        return $respose_data;
    }

}