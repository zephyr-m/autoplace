<?php

use App\Http\Controllers\CatalogVehicleController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Home'))->name('home');

Route::get('/health/metrics', fn () => response("app_up 1\n", 200, [
    'Content-Type' => 'text/plain; version=0.0.4',
]))->name('health.metrics');

Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
Route::post('/subscriptions', [SubscriptionController::class, 'store'])->name('subscriptions.store');
Route::delete('/subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])->name('subscriptions.destroy');

Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/vehicles', [CatalogVehicleController::class, 'index'])->name('vehicles.index');
    Route::post('/vehicles', [CatalogVehicleController::class, 'store'])->name('vehicles.store');
});
