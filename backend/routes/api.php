<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StockController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Stock Data
Route::get('/stocks', [StockController::class, 'index']);
Route::get('/stocks/{stock}', [StockController::class, 'show']);
Route::get('/stocks/{stock}/history', [StockController::class, 'history']);
Route::get('/market/summary', [StockController::class, 'marketSummary']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Wallet
    Route::get('/wallet/balance', [WalletController::class, 'balance']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);
    Route::get('/wallet/history', [WalletController::class, 'history']);
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
});
