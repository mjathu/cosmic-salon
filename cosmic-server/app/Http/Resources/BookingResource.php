<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            "startTime" => $this->start_time,
            "endTime" => $this->end_time,
            "price" => $this->price,
            "status" => $this->status,
            "createdAt" => $this->created_at,
            "updatedAt" => $this->updated_at,
            "customer" => new UserResource($this->whenLoaded('customer')),
            "staff" => new UserResource($this->whenLoaded('staff')),
            "services" => new ServiceResourceCollection($this->whenLoaded('services')),
        ];

        return $result;
    }
}
