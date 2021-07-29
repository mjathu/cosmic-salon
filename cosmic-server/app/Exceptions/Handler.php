<?php

namespace App\Exceptions;

use App\Enums\ErrorType;
use App\Enums\ResponseCode;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use ResponseHelper;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthenticationException::class,
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        TokenMismatchException::class,
        ValidationException::class,
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (Throwable $e, $request) {
            

            if ($request->is('api/*')) 
            {

                // REST API ERRORS

                if ($e instanceof ApiException)
                {
                    if($e->getCode() === ErrorType::NotFound)
                    {
                        return response()->json(
                            ResponseHelper::buildJsonResponse(
                                ResponseCode::CODE_404,
                                'Resource Not Found'
                            ), ResponseCode::CODE_404);
                    }
                    else if($e->getCode() === ErrorType::CustomError)
                    {
                        return response()->json(
                            ResponseHelper::buildJsonResponse(
                                ResponseCode::CODE_400,
                                $e->getMessage()
                            ), ResponseCode::CODE_400);
                    }
                    else
                    {
                        return response()->json(
                            ResponseHelper::buildJsonResponse(
                                ResponseCode::CODE_500,
                                'API Server Error'
                            ), ResponseCode::CODE_500);
                    }
                }
                else if($e instanceof ErrorException)
                {
                    return response()->json(
                        ResponseHelper::buildJsonResponse(
                            ResponseCode::CODE_500,
                            'API Server Error'
                        ), ResponseCode::CODE_500);
                }
                else if($e instanceof ValidationException)
                {
                    Log::debug('ValidationException: ' . json_encode($e->errors()));

                    return response()->json(
                        ResponseHelper::buildJsonResponse(
                            ResponseCode::CODE_400,
                            'Invalid Inputs',
                            $e->validator
                        ), ResponseCode::CODE_400);
                }
                else if ($e instanceof NotFoundHttpException)
                {
                    return response()->json(
                        ResponseHelper::buildJsonResponse(
                            ResponseCode::CODE_500,
                            'API Server Error'
                        ), ResponseCode::CODE_500);
                }
                else if ($e instanceof ModelNotFoundException)
                {
                    return response()->json(
                        ResponseHelper::buildJsonResponse(
                            ResponseCode::CODE_500,
                            'API Server Error'
                        ), ResponseCode::CODE_500);
                }
                else if ($e instanceof RequestException)
                {
                    return response()->json(
                        ResponseHelper::buildJsonResponse(
                            ResponseCode::CODE_500,
                            'API Request Failed'
                        ), ResponseCode::CODE_500);
                }
                else if($e instanceof MaintenanceModeException)
                {
                    return response()->json(
                        ResponseHelper::buildJsonResponse(
                            ResponseCode::CODE_503,
                            'System under maintenance'
                        ), ResponseCode::CODE_503);
                }
                else if($e instanceof ThrottleRequestsException)
                {
                    return response()->json(
                        ResponseHelper::buildJsonResponse(
                            ResponseCode::CODE_429,
                            $e->getMessage()
                        ), ResponseCode::CODE_429);
                }


            }


        });
    }


    
}
