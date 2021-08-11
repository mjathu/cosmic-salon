<?php

namespace App\Http\Controllers;

use App\Enums\BookingStatus;
use App\Enums\ErrorType;
use App\Enums\ResponseCode;
use App\Enums\RoleType;
use App\Exceptions\ApiException;
use App\Http\Resources\BookingResourceCollection;
use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Exception;
use Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use ResponseHelper;

class BookingController extends Controller
{

    public function list(Request $request)
    {

        try {

            $dateFilter = $request->has('dates') ? json_decode($request->input('dates')) : null;
            $filters = $request->has('filters') && $request->filters != null ? json_decode($request->input('filters')) : null;

            $user = $request->user();

            $bookings = Booking::with(['customer', 'staff', 'services'])
                ->when($dateFilter, function($query) use($dateFilter) {
                    return $query
                        ->where('date', '>=', $dateFilter->startDate)
                        ->where('date', '<=', $dateFilter->endDate);
                })
                ->when($filters && property_exists($filters, 'customer') && !is_null($filters->customer), function($query) use($filters) {
                    return $query->where('customer_id', '=', Helpers::decodeId($filters->customer));
                })
                ->when($filters && property_exists($filters, 'staff') && !is_null($filters->staff), function($query) use($filters) {
                    return $query->where('staff_id', '=', Helpers::decodeId($filters->staff));
                })
                ->when($user->role === RoleType::STAFF, function ($query) use($user) {
                    return $query->where('staff_id', '=', $user->id);
                })
                ->get();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                new BookingResourceCollection($bookings)
            ), ResponseCode::CODE_200);
        

        } catch (Exception $e) {

            throw new ApiException($e->getMessage(), $e->getCode(), $e);

        }

    }

    public function store(Request $request)
    {

        DB::beginTransaction();

        try {

            $user = $request->user();

            $validated = $request->validate([
                'customer' => Rule::requiredIf($user->isAdmin()),
                'staff' => 'required|string',
                'date' => 'required|string',
                'startTime' => 'required|numeric',
                'services' => 'required'
            ]);

            if ($user->isStaff()) {
                throw new Exception('Not allowed', ErrorType::CustomError);
            }

            $customerId = $user->isAdmin() ? Helpers::decodeId($request->input('customer')) : $user->id;
            $staffId = Helpers::decodeId($request->input('staff'));
            $serviceIds = Helpers::decodeId($request->input('services'));
            $startTime = $request->input('startTime');
            $endTime = Helpers::calculateEndTime($startTime, $serviceIds);
            $date = $request->input('date');
            $price = Service::whereIn('id', $serviceIds)->pluck('price')->sum();

            $dateTimeObj = Carbon::createFromFormat('Y-m-d', $date)->startOfDay()->addMinutes($startTime);

            if ($dateTimeObj <= Carbon::now()) {
                throw new Exception('Cannot book for past date or time', ErrorType::CustomError);
            }

            $overlapBookings = Booking::where('date', '=', $date)
                ->where(function ($query) {
                    $query->where('status', '=', BookingStatus::BOOKED)
                        ->orWhere('status', '=', BookingStatus::COMPLETED);
                })
                ->where(function($query) use($customerId, $staffId, $startTime, $endTime) {

                    $query->where(function($subquery) use($customerId, $staffId, $startTime, $endTime) {

                        $subquery->where('customer_id', '=', $customerId)
                            ->where('start_time', '<', $endTime)
                            ->where('end_time', '>', $startTime);

                    })
                    ->orWhere(function($subquery) use($customerId, $staffId, $startTime, $endTime) {

                        $subquery->where('staff_id', '=', $staffId)
                            ->where('start_time', '<', $endTime)
                            ->where('end_time', '>', $startTime);

                    });

                })->get();

            if (count($overlapBookings) > 0) {
                throw new Exception('This staff or customer has another booking on this date at this time slot range. Please choose different time', ErrorType::CustomError);
            }

            $booking = new Booking();
            $booking->customer_id = $customerId;
            $booking->staff_id = $staffId;
            $booking->date = $date;
            $booking->start_time = $startTime;
            $booking->end_time = $endTime;
            $booking->price = $price;
            $booking->status = BookingStatus::BOOKED;
            $booking->save();

            $booking->services()->attach($serviceIds);

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Booking Added'
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

            $user = $request->user();

            $validated = $request->validate([
                'id' => 'required',
                'customer' => Rule::requiredIf($user->isAdmin()),
                'staff' => 'required|string',
                'date' => 'required|string',
                'startTime' => 'required|numeric',
                'services' => 'required'
            ]);

            if ($user->isStaff()) {
                throw new Exception('Not allowed', ErrorType::CustomError);
            }
        
            $decId = Helpers::decodeId($request->input('id'));
            $customerId = $user->isAdmin() ? Helpers::decodeId($request->input('customer')) : $user->id;
            $staffId = Helpers::decodeId($request->input('staff'));
            $serviceIds = Helpers::decodeId($request->input('services'));
            $startTime = $request->input('startTime');
            $endTime = Helpers::calculateEndTime($startTime, $serviceIds);
            $date = $request->input('date');
            $price = Service::whereIn('id', $serviceIds)->pluck('price')->sum();

            $dateTimeObj = Carbon::createFromFormat('Y-m-d', $date)->startOfDay()->addMinutes($startTime);

            if ($dateTimeObj <= Carbon::now()) {
                throw new Exception('Cannot book for past date or time', ErrorType::CustomError);
            }

            $overlapBookings = Booking::where('id', '!=', $decId)
                ->where('date', '=', $date)
                ->where(function ($query) {
                    $query->where('status', '=', BookingStatus::BOOKED)
                        ->orWhere('status', '=', BookingStatus::COMPLETED);
                })
                ->where(function($query) use($customerId, $staffId, $startTime, $endTime) {

                    $query->where(function($subquery) use($customerId, $staffId, $startTime, $endTime) {

                        $subquery->where('customer_id', '=', $customerId)
                            ->where('start_time', '<', $endTime)
                            ->where('end_time', '>', $startTime);

                    })
                    ->orWhere(function($subquery) use($customerId, $staffId, $startTime, $endTime) {

                        $subquery->where('staff_id', '=', $staffId)
                            ->where('start_time', '<', $endTime)
                            ->where('end_time', '>', $startTime);

                    });

                })->get();

            Log::info($overlapBookings);

            if (count($overlapBookings) > 0) {
                throw new Exception('This staff or customer has another booking on this date at this time slot range. Please choose different time', ErrorType::CustomError);
            }

            $booking = Booking::findOrFail($decId);
            $booking->customer_id = $customerId;
            $booking->staff_id = $staffId;
            $booking->date = $date;
            $booking->start_time = $startTime;
            $booking->end_time = $endTime;
            $booking->price = $price;
            $booking->save();

            $booking->services()->sync($serviceIds);

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Booking Updated'
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

    public function changeStatus(Request $request)
    {

        DB::beginTransaction();

        try {

            $user = $request->user();

            $validated = $request->validate([
                'id' => 'required',
                'status' => 'required'
            ]);

            if ($user->isCustomer()) {
                throw new Exception('Not allowed', ErrorType::CustomError);
            }
        
            $decId = Helpers::decodeId($request->input('id'));
            $status = $request->input('status');

            $booking = Booking::findOrFail($decId);
            $booking->status = $status;
            $booking->save();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Booking Updated'
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

            $booking = Booking::findOrFail($decId);

            $booking->delete();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Booking Deleted'
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
