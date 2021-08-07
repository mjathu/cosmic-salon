<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use \Stripe\StripeClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        
        $this->app->bind(StripeClient::class, function () {
            return new StripeClient(env('STRIPE_PRIVATE_KEY'));
        });

    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
