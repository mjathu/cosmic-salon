<?php

namespace App\Http\Controllers;

use App\Enums\ResponseCode;
use App\Exceptions\ApiException;
use App\Http\Resources\ServiceResourceCollection;
use App\Models\Service;
use App\Models\User;
use Exception;
use Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use ResponseHelper;

class ServiceController extends Controller
{
    
    public function list(Request $request)
    {

        try {

            $serviceList = Service::when(!$request->input('with_archive'), function($query) {
                return $query->where('archived', '=', false);
            })->orderBy('id', 'desc')->get();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Success',
                new ServiceResourceCollection($serviceList)
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
                'description' => 'required',
                'duration' => 'required',
                'price' => 'required'
            ]);

            $service = new Service();
            $service->name = $request->input('name');
            $service->description = $request->input('description');
            $service->duration = $request->input('duration');
            $service->price = $request->input('price');
            $service->active = true;
            $service->save();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Service Added'
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
                'name' => 'required',
                'description' => 'required',
                'duration' => 'required',
                'price' => 'required',
                'active' => ['required', 'boolean']
            ]);
        
            $decId = Helpers::decodeId($request->input('id'));

            $existingService = Service::with(['bookings'])->findOrFail($decId);

            if (count($existingService->bookings) > 0) {

                $existingService->archived = true;
                $existingService->save();

                $service = new Service();

            } else {
                $service = Service::findOrFail($decId);
            }

            $service->name = $request->input('name');
            $service->description = $request->input('description');
            $service->duration = $request->input('duration');
            $service->price = $request->input('price');
            $service->active = $request->input('active');
            $service->save();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Service Updated'
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

            $service = Service::findOrFail($decId);

            $service->delete();

            DB::commit();

            return response()->json(ResponseHelper::buildJsonResponse(
                ResponseCode::CODE_200,
                'Service Deleted'
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
