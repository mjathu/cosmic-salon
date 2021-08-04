<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Service::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->city(),
            'description' => $this->faker->city(),
            'price' => rand(10, 100),
            'duration' => rand(10, 60),
            'archived' => false,
            'active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
