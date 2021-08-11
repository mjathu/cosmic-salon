<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        // Service
        Service::factory()->count(25)->create();

        // Admin
        User::factory()->count(1)->admin()->create([
            'email' => 'admin@gmail.com'
        ]);

        // Staff
        User::factory()->count(1)->staff()->create([
            'email' => 'staff@gmail.com'
        ]);
        User::factory()->count(25)->staff()->create();

        // Customer
        User::factory()->count(1)->customer()->create([
            'email' => 'customer@gmail.com'
        ]);
        User::factory()->count(25)->customer()->create();

        $customers = User::Customer()->inRandomOrder()->limit(3)->get();
        $staff = User::Staff()->inRandomOrder()->limit(5)->get();

        $customers->each(function ($customer) use($staff) {

            foreach (range(0, rand(0, 2)) as $num) {

                Booking::create([
                    'customer_id' => $customer->id,
                    'staff_id' => $staff->random(1)->first()->id,
                    'date' => Carbon::today()->addDays(rand(0, 5)),
                    'start_time' => rand(480, 600),
                    'end_time' => rand(800, 900),
                    'price' => rand(50, 150),
                    'status' => BookingStatus::BOOKED
                ]);
                
            }

        });

        $bookings = Booking::all();
        $services = Service::inRandomOrder()->limit(10)->get();

        $bookings->each(function ($booking) use($services) {

            foreach (range(0, rand(0, 2)) as $num) {

                $booking->services()->attach($services->random(rand(1, 2))->pluck('id')->toArray());
                
            }

        });
    }
}
