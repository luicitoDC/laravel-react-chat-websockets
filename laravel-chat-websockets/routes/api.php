<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\JWTController;
use App\Http\Controllers\ChatsController;
use App\Http\Controllers\UsersController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware(['api'])->group(function () {
    Route::get('/users', [UsersController::class, 'get']);
    Route::get('/profile', [JWTController::class, 'profile']);
    Route::get('/messages', [ChatsController::class, 'fetchMessages']);
    Route::post('/messages', [ChatsController::class, 'sendMessage']);
    Route::post('/logout', [JWTController::class, 'logout']);
});

Route::post('/login', [JWTController::class, 'login']);
Route::post('/register', [JWTController::class, 'register']);

