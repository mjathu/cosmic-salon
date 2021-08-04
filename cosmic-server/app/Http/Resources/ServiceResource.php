<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
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
            "name" => $this->name,
            "description" => $this->description,
            "price" => $this->price,
            "duration" => $this->duration,
            "archived" => $this->archived,
            "active" => $this->active,
            "createdAt" => $this->created_at,
            "updatedAt" => $this->updated_at
        ];

        return $result;
    }
}
