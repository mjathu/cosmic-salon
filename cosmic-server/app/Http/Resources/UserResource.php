<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            "firstName" => $this->first_name,
            "lastName" => $this->last_name,
            "fullName" => $this->full_name,
            "email" => $this->email,
            "phone" => $this->phone,
            "rememberToken" => $this->remember_token,
            "role" => $this->role,
            "active" => $this->active,
            "createdAt" => $this->created_at,
            "updatedAt" => $this->updated_at
        ];

        if (array_key_exists('token', $this->params) && !empty($this->params['token']))
        {
            $result['token'] = $this->params['token'];
        }

        return $result;
    }
}
