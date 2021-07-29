<?php

namespace App\Http\Controllers;

use App\Enums\ErrorType;
use App\Enums\ResponseCode;
use App\Enums\RoleType;
use App\Exceptions\ApiException;
use App\Http\Resources\UserResource;
use App\Mail\EmailVerification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Exception;
use Helpers;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Validator;
use ResponseHelper;

class AuthController extends Controller
{
    

    public function login(Request $request)
    {

        try {

            $validated = $request->validate([
                'email' => 'required',
                'password' => 'required',
            ]);
        
            $user = User::where('email', $request->input('email'))->first();

            if (! $user || ! Hash::check($request->input('password'), $user->password)) 
            {
                throw new Exception('Provided email or password is incorrect', ErrorType::CustomError);
            }

            if (!$user->email_verified_at) 
            {
                throw new Exception('Please verify your email', ErrorType::CustomError);
            }

            if (!$user->active) 
            {
                throw new Exception('User is inactive', ErrorType::CustomError);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Login Success',
                new UserResource($user, ['token' => $token])
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            if($e instanceof ValidationException)
            {
                throw new ValidationException($e->validator);
            }

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

    public function logout(Request $request)
    {

        try {

            $request->user()->currentAccessToken()->delete();
            // $request->user()->tokens()->delete();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Logout Success',
            ), ResponseCode::CODE_200);

        } catch (Exception $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);
        
        }
        
    }

    public function registerClient(Request $request)
    {

        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'email' => 'required',
                'password' => 'required',
                'first_name' => 'required',
                'last_name' => 'required'
            ]);
        
            $existingUser = User::where('email', $request->input('email'))->first();

            if ($existingUser)
            {
                throw new Exception('Email already exists', ErrorType::CustomError);
            }

            $newUser = new User();
            $newUser->first_name = $request->input('first_name');
            $newUser->last_name = $request->input('last_name');
            $newUser->email = $request->input('email');
            $newUser->password = Hash::make($request->input('password'));
            $newUser->email_verified_at = null;
            $newUser->remember_token = Str::random(10);
            $newUser->active = false;
            $newUser->role = RoleType::CLIENT;
            $newUser->save();

            Mail::to($newUser)->send(new EmailVerification($newUser));

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Registration Success'
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

    public function verifyEmail(Request $request)
    {

        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'id' => 'required'
            ]);
        
            $dec_id = Helpers::decodeId($request->input('id'));
            $user = User::findOrFail($dec_id);

            if (!$user)
            {
                throw new Exception('Verification failed', ErrorType::CustomError);
            }

            $user->active = true;
            $user->email_verified_at = Carbon::now();
            $user->save();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Verification Success',
                new UserResource($user)
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

    public function forgotPassword(Request $request)
    {

        try {

            $validated = $request->validate([
                'email' => 'required'
            ]);
        
            $user = User::where('email', '=', $request->input('email'))->first();

            if (!$user)
            {
                throw new Exception('User not found', ErrorType::CustomError);
            }

            $status = Password::sendResetLink($request->only('email'));

            if (Password::RESET_LINK_SENT != $status) {

                throw new Exception(trans($status), ErrorType::CustomError);

            }
            
            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Password reset link sent'
            ), ResponseCode::CODE_200);

        } catch (Exception $e) {

            if($e instanceof ValidationException)
            {
                throw new ValidationException($e->validator);
            }

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

    public function resetPassword(Request $request)
    {


        try {

            $validated = $request->validate([
                'token' => 'required',
                'password' => 'required',
                'confirm_password' => 'required',
                'email' => 'required'
            ]);

            $status = Password::reset(
                $request->only('email', 'password', 'confirm_password', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(10));
        
                    $user->save();

                    $user->tokens()->delete();

                }
            );
           
            if ($status != Password::PASSWORD_RESET) {
                throw new Exception(trans($status), ErrorType::CustomError);
            }

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Reset Success',
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            if($e instanceof ValidationException)
            {
                throw new ValidationException($e->validator);
            }

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

}
