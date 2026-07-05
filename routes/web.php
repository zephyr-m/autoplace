<?php

use App\Http\Controllers\CatalogVehicleController;
use App\Http\Controllers\AdminEventCounterController;
use Filament\Http\Middleware\Authenticate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/catalog', fn () => Inertia::render('Catalog'))->name('catalog');
Route::get('/account', fn () => Inertia::render('Account'))->name('account');

Route::get('/health/metrics', fn () => response("app_up 1\n", 200, [
    'Content-Type' => 'text/plain; version=0.0.4',
]))->name('health.metrics');

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::post('/vehicles', [CatalogVehicleController::class, 'store'])->name('vehicles.store');
    Route::get('/event-counters', AdminEventCounterController::class)
        ->middleware(Authenticate::class)
        ->name('event-counters');
});
