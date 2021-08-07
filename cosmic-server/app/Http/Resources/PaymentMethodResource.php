<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentMethodResource extends JsonResource
{
    private $params;

    public function __construct($resource, $params = [])
    {
        // Ensure you call the parent constructor
        parent::__construct($resource);

        $this->resource = $resource;

        $this->params = $params;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if (is_null($this->resource)) {
            return [];
        }

        $result = [
            "id" => $this->hashid,
            "cardReference" => $this->card_reference,
            "fingerprint" => $this->fingerprint,
            "brand" => $this->brand,
            "lastDigits" => $this->last_digits,
            "expMonth" => $this->exp_month,
            "expYear" => $this->exp_year,
            "default" => $this->default,
            "cardNumber" => $this->card_number,
            "expiry" => $this->expiry,
            "createdAt" => $this->created_at,
            "updatedAt" => $this->updated_at,
            "user" => new UserResource($this->whenLoaded('user'))
        ];

        return $result;
    }
}
