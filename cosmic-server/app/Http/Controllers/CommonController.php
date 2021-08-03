<?php

namespace App\Http\Controllers;

use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    public function updateProfile(Request $request)
    {

        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'firstName' => 'required',
                'lastName' => 'required',
                'phone' => 'required'
            ]);

            $user = $request->user();
            $user->first_name = $request->input('firstName');
            $user->last_name = $request->input('lastName');
            $user->phone = $request->input('phone');
            $user->save();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Profile Update Success',
                new UserResource($user)
            ), ResponseCode::CODE_200);
        

        } catch (Exception|Throwable $e) {

            DB::rollBack();

            if($e instanceof ValidationException)
            {
                throw new ValidationException($e->validator);
            }

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

}
