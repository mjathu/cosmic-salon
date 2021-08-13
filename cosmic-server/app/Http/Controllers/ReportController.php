<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Models\Booking;
use Exception;
use Helpers;
use Illuminate\Http\Request;
use ResponseHelper;

class ReportController extends Controller
{
    
    public function bookingReportData(Request $request)
    {

        try {

            $validated = $request->validate([
                'start_date' => 'required',
                'end_date' => 'required'
            ]);

            if (!$request->user()->isAdmin()) {
                throw new Exception('Not allowed');
            }

            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $bookings = Booking::with(['customer', 'staff', 'services'])
                ->where('date', '>=', $startDate)
                ->where('date', '<=', $endDate)
                ->get();

            $reportData = [];

            foreach ($bookings as $data) {

                array_push($reportData, [
                    'customer' => $data->customer->full_name,
                    'staff' => $data->staff->full_name,
                    'date' => $data->date,
                    'start_time' => Helpers::convertMinToDateObj($data->start_time, null, 'H:i A'),
                    'end_time' => Helpers::convertMinToDateObj($data->end_time, null, 'H:i A'),
                    'services' => implode(',', $data->services->pluck('name')->toArray()),
                    'status' => $data->status,
                    'price' => $data->price
                ]);

            }

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                $reportData
            ), ResponseCode::CODE_200);
        

        } catch (Exception|Throwable $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

    public function incomeReportData(Request $request)
    {

        try {

            $validated = $request->validate([
                'start_date' => 'required',
                'end_date' => 'required'
            ]);

            if (!$request->user()->isAdmin()) {
                throw new Exception('Not allowed');
            }

            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $bookings = Booking::with(['customer', 'staff', 'services', 'payment.paymentMethod'])
                ->where('date', '>=', $startDate)
                ->where('date', '<=', $endDate)
                ->where('status', '=', BookingStatus::COMPLETED)
                ->get();

            $reportData = [];

            foreach ($bookings as $data) {

                $paymentMethod = $data->payment->paymentMethod ? 'Card ending in ' . $data->payment->paymentMethod->last_digits : 'Cash';

                array_push($reportData, [
                    'customer' => $data->customer->full_name,
                    'staff' => $data->staff->full_name,
                    'date' => $data->date,
                    'payment_method' => $paymentMethod,
                    'payment_reference' => $data->payment->payment_reference,
                    'price' => $data->price
                ]);

            }

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                $reportData
            ), ResponseCode::CODE_200);
        

        } catch (Exception|Throwable $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

}
