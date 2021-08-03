<?php

namespace Database\Seeders;

use App\Models\User;
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

        // Admin
        User::factory()->count(1)->admin()->create([
            'email' => 'admin@gmail.com'
        ]);

        // Staff
        User::factory()->count(1)->staff()->create([
            'email' => 'staff@gmail.com'
        ]);
        User::factory()->count(25)->staff()->create();

        // Client
        User::factory()->count(1)->client()->create([
            'email' => 'client@gmail.com'
        ]);
        User::factory()->count(25)->client()->create();
    }
}
