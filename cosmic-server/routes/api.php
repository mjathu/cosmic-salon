<?php

use App\Enums\ErrorType;
use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StaffController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;


//---------- Open Routes --------------//
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register-customer', [AuthController::class, 'registerClient']);
Route::get('/check-email-exists', [CommonController::class, 'checkExistingEmail']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/staff-set-password', [AuthController::class, 'setStaffPassword']);
//---------- /Open Routes --------------//


//---------- Authenticated Routes --------------//
Route::group(['middleware' => ['auth:sanctum']], function () {

    // Profile Routes
    Route::post('/update-profile', [CommonController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/staff-new-password', [AuthController::class, 'staffNewPassword']);

    // Staff Routes
    Route::get('/staff-list', [StaffController::class, 'list']);
    Route::post('/staff-store', [StaffController::class, 'store']);
    Route::post('/staff-update', [StaffController::class, 'update']);
    Route::post('/staff-delete', [StaffController::class, 'delete']);

    // Customer Routes
    Route::get('/customer-list', [CustomerController::class, 'list']);
    Route::post('/customer-update', [CustomerController::class, 'update']);
    Route::post('/customer-delete', [CustomerController::class, 'delete']);

    // Service Routes
    Route::get('/service-list', [ServiceController::class, 'list']);
    Route::post('/service-store', [ServiceController::class, 'store']);
    Route::post('/service-update', [ServiceController::class, 'update']);
    Route::post('/service-delete', [ServiceController::class, 'delete']);

    // Payment Method Routes
    Route::get('/payment-method-list', [PaymentMethodController::class, 'list']);
    Route::post('/payment-method-store', [PaymentMethodController::class, 'store']);
    Route::post('/payment-method-update', [PaymentMethodController::class, 'update']);
    Route::post('/payment-method-delete', [PaymentMethodController::class, 'delete']);

    // Booking Routes
    Route::get('/booking-list', [BookingController::class, 'list']);
    Route::post('/booking-store', [BookingController::class, 'store']);
    Route::post('/booking-update', [BookingController::class, 'update']);
    Route::post('/booking-change-status', [BookingController::class, 'changeStatus']);
    Route::post('/booking-delete', [BookingController::class, 'delete']);

    // Payment Routes
    Route::get('/payment-list', [PaymentController::class, 'list']);


    Route::post('/logout', [AuthController::class, 'logout']);

});
//---------- /Authenticated Routes --------------//

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
