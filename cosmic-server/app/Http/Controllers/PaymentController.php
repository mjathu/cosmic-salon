<?php

namespace App\Http\Controllers;

use App\Enums\ResponseCode;
use App\Enums\RoleType;
use App\Exceptions\ApiException;
use App\Http\Resources\PaymentResourceCollection;
use App\Models\Payment;
use Exception;
use Illuminate\Http\Request;
use ResponseHelper;

class PaymentController extends Controller
{
    
    public function list(Request $request)
    {

        try {

            $user = $request->user();

            $paymentList = Payment::with(['customer', 'booking', 'booking.customer', 'booking.staff', 'booking.services', 'paymentMethod'])
                ->when($user->role === RoleType::CUSTOMER, function($query) use($user) {
                    return $query->where('customer_id', $user->id);
                })
                ->orderBy('id', 'desc')
                ->get();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                new PaymentResourceCollection($paymentList)
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

}
