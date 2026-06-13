<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Expense Tracker API',
        'version' => '1.0.0',
        'docs' => '/api',
    ]);
});
