<?php

use App\Enums\ErrorType;
use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommonController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;


//---------- Open Routes --------------//
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-client', [AuthController::class, 'registerClient']);
Route::get('/check-email-exists', [CommonController::class, 'checkExistingEmail']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
//---------- /Open Routes --------------//


//---------- Authenticated Routes --------------//
Route::group(['middleware' => ['auth:sanctum']], function () {


    Route::post('/logout', [AuthController::class, 'logout']);

});
//---------- /Authenticated Routes --------------//

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
