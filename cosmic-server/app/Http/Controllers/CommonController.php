<?php

namespace App\Http\Controllers;

use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Models\User;
use Illuminate\Http\Request;
use ResponseHelper;
use Throwable;

class CommonController extends Controller
{

    public function checkExistingEmail(Request $request)
    {

        try {

            $exists = false;

            if ($request->input('email')) {

                $user = User::where('email', $request->input('email'))->first();

                if ($user) {
                    $exists = true;
                }

            }

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                $exists
            ), ResponseCode::CODE_200);
        

        } catch (Exception|Throwable $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

}
