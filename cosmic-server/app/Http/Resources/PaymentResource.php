<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            "date" => $this->date,
            "paymentReference" => $this->payment_reference,
            "transactionReference" => $this->transaction_reference,
            "price" => $this->price,
            "createdAt" => $this->created_at,
            "updatedAt" => $this->updated_at,
            "customer" => new UserResource($this->whenLoaded('customer')),
            "booking" => new BookingResource($this->whenLoaded('booking')),
            "paymentMethod" => new PaymentMethodResource($this->whenLoaded('paymentMethod')),
        ];

        return $result;
    }
}
