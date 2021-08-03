<?php

namespace App\Http\Controllers;

use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Http\Resources\UserResourceCollection;
use App\Models\User;
use Illuminate\Http\Request;
use ResponseHelper;
use Exception;
use Helpers;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
{
    
    public function list(Request $request)
    {

        try {

            $clientList = User::Customer()->orderBy('id', 'desc')->get();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                new UserResourceCollection($clientList)
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

    public function update(Request $request)
    {

        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'id' => 'required',
                'phone' => 'required',
                'firstName' => 'required',
                'lastName' => 'required',
                'active' => ['required', 'boolean']
            ]);
        
            $decId = Helpers::decodeId($request->input('id'));

            $staff = User::findOrFail($decId);
            $staff->first_name = $request->input('firstName');
            $staff->last_name = $request->input('lastName');
            $staff->phone = $request->input('phone');
            $staff->active = $request->input('active');
            $staff->save();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Customer Updated'
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            DB::rollBack();

            if($e instanceof ValidationException)
            {
                throw new ValidationException($e->validator);
            }

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

    public function delete(Request $request)
    {

        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'id' => 'required'
            ]);
        
            $decId = Helpers::decodeId($request->input('id'));

            $staff = User::findOrFail($decId);

            $staff->delete();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Customer Deleted'
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            DB::rollBack();

            if($e instanceof ValidationException)
            {
                throw new ValidationException($e->validator);
            }

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

}
