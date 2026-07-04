<?php

use App\Http\Controllers\CatalogVehicleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Home'))->name('home');

Route::get('/health/metrics', fn () => response("app_up 1\n", 200, [
    'Content-Type' => 'text/plain; version=0.0.4',
]))->name('health.metrics');

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::post('/vehicles', [CatalogVehicleController::class, 'store'])->name('vehicles.store');
});
