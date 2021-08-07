<?php

namespace App\Http\Controllers;

use App\Enums\ErrorType;
use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Http\Resources\PaymentMethodResourceCollection;
use App\Models\PaymentMethod;
use Exception;
use Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use ResponseHelper;
use \Stripe\StripeClient;

class PaymentMethodController extends Controller
{

    private $stripeClient;

    public function __construct(StripeClient $stripeClient)
    {
        $this->stripeClient = $stripeClient;
    }

    public function list(Request $request)
    {

        try {

            $userId = $request->user()->id;

            $paymentMethods = PaymentMethod::with('user')
                ->where('user_id', '=', $userId)
                ->orderBy('id', 'desc')
                ->get();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                new PaymentMethodResourceCollection($paymentMethods)
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
                'name' => 'required',
                'token' => 'required'
            ]);

            $user = $request->user();
            $stripeCustomer = null;
            $token = $request->input('token');

            if (is_null($user->stripe_customer_id)) {

                $stripeCustomer = $this->stripeClient->customers->create([
                    'email' => $user->email,
                    'name' => $user->full_name,
                    'metadata' => [
                        'user_code' => $user->code
                    ] 
                ]);

                $user->stripe_customer_id = $stripeCustomer->id;
                $user->save();

            } else {

                $stripeCustomer = $this->stripeClient->customers->retrieve($user->stripe_customer_id);

            }

            $card = $this->stripeClient->customers->createSource($stripeCustomer->id, [
                'source' => $token
            ]);

            $this->stripeClient->customers->update($stripeCustomer->id, [
                'default_source' => $card->id
            ]);

            PaymentMethod::where('user_id', '=', $user->id)->update(['default' => false]);

            $paymentMethod = new PaymentMethod();
            $paymentMethod->user_id = $user->id;
            $paymentMethod->card_reference = $card->id;
            $paymentMethod->fingerprint = $card->fingerprint;
            $paymentMethod->brand = $card->brand;
            $paymentMethod->last_digits = $card->last4;
            $paymentMethod->exp_month = $card->exp_month;
            $paymentMethod->exp_year = $card->exp_year;
            $paymentMethod->default = true;
            $paymentMethod->save();

            
            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Payment Method Added'
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
                'id' => 'required'
            ]);
        
            $decId = Helpers::decodeId($request->input('id'));
            $user = $request->user();
            $stripeCustomer = $this->stripeClient->customers->retrieve($user->stripe_customer_id);
        
            PaymentMethod::where('user_id', '=', $user->id)->update(['default' => false]);

            $paymentMethod = PaymentMethod::findOrFail($decId);
            $paymentMethod->default = true;
            $paymentMethod->save();

            $this->stripeClient->customers->update($stripeCustomer->id, [
                'default_source' => $paymentMethod->card_reference
            ]);

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Default Payment Method Set'
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

            $user = $request->user();
            $stripeCustomer = $this->stripeClient->customers->retrieve($user->stripe_customer_id);
        
            $paymentMethod = PaymentMethod::findOrFail($decId);

            $alternateMethod = PaymentMethod::where('user_id', '=', $user->id)->where('id', '!=', $decId)->latest()->first();

            if ($alternateMethod) {

                $alternateMethod->default = true;
                $alternateMethod->save();

                $this->stripeClient->customers->update($stripeCustomer->id, [
                    'default_source' => $alternateMethod->card_reference
                ]);

            }

            $this->stripeClient->customers->deleteSource($stripeCustomer->id, $paymentMethod->card_reference);

            $paymentMethod->delete();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Payment Method Deleted'
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
