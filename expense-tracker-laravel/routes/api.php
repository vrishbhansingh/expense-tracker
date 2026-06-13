<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {

    // Public auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        // User
        Route::get('/user', [UserController::class, 'show']);
        Route::put('/user/profile', [UserController::class, 'updateProfile']);
        Route::put('/user/password', [UserController::class, 'updatePassword']);
        Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);

        // Expenses
        Route::get('/expenses', [ExpenseController::class, 'index']);
        Route::post('/expenses', [ExpenseController::class, 'store']);
        Route::get('/expenses/{expense}', [ExpenseController::class, 'show']);
        Route::put('/expenses/{expense}', [ExpenseController::class, 'update']);
        Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy']);
        Route::post('/expenses/bulk-delete', [ExpenseController::class, 'bulkDelete']);

        // Categories
        Route::apiResource('categories', CategoryController::class);

        // Budgets
        Route::apiResource('budgets', BudgetController::class);

        // Analytics
        Route::prefix('analytics')->group(function () {
            Route::get('/daily', [AnalyticsController::class, 'daily']);
            Route::get('/monthly', [AnalyticsController::class, 'monthly']);
            Route::get('/yearly', [AnalyticsController::class, 'yearly']);
            Route::get('/category-breakdown', [AnalyticsController::class, 'categoryBreakdown']);
            Route::get('/trends', [AnalyticsController::class, 'trends']);
        });

        // Export
        Route::get('/export/csv', [ExportController::class, 'csv']);
    });
});
