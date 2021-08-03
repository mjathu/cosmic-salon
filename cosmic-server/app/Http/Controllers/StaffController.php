<?php

namespace App\Http\Controllers;

use App\Enums\ErrorType;
use App\Enums\ResponseCode;
use App\Enums\RoleType;
use App\Exceptions\ApiException;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserResourceCollection;
use App\Models\User;
use App\Notifications\StaffNewPassword;
use Illuminate\Http\Request;
use ResponseHelper;
use Exception;
use Helpers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StaffController extends Controller
{
    
    public function list(Request $request)
    {

        try {

            $staffList = User::Staff()->orderBy('id', 'desc')->get();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                new UserResourceCollection($staffList)
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

    public function store(Request $request)
    {

        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'email' => 'required',
                'phone' => 'required',
                'first_name' => 'required',
                'last_name' => 'required'
            ]);
        
            $existingUser = User::where('email', $request->input('email'))->first();

            if ($existingUser)
            {
                throw new Exception('Email already exists', ErrorType::CustomError);
            }

            $staff = new User();
            $staff->first_name = $request->input('first_name');
            $staff->last_name = $request->input('last_name');
            $staff->email = $request->input('email');
            $staff->password = Hash::make(Helpers::STAFF_DEFAULT_PASSWORD);
            $staff->phone = $request->input('phone');
            $staff->email_verified_at = null;
            $staff->remember_token = Str::random(10);
            $staff->active = false;
            $staff->role = RoleType::STAFF;
            $staff->save();

            $url = Helpers::getStaffAccountSetupUrl($staff);

            $staff->notify(new StaffNewPassword($url, $staff));

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Staff Added'
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

    public function update(Request $request)
    {

        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'id' => 'required',
                'phone' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
                'active' => ['required', 'boolean']
            ]);
        
            $decId = Helpers::decodeId($request->input('id'));

            $staff = User::findOrFail($decId);
            $staff->first_name = $request->input('first_name');
            $staff->last_name = $request->input('last_name');
            $staff->phone = $request->input('phone');
            $staff->active = $request->input('active');
            $staff->save();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Staff Updated'
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
                'Staff Deleted'
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
