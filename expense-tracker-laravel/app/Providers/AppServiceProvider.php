<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        \Laravel\Sanctum\Sanctum::ignoreMigrations();
    }

    public function boot(): void
    {
        Schema::defaultStringLength(191);
    }
}
