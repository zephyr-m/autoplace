<?php

use App\Http\Controllers\CatalogVehicleController;
use App\Http\Controllers\AdminEventCounterController;
use App\Models\CatalogVehicle;
use Filament\Http\Middleware\Authenticate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/catalog', fn () => Inertia::render('Catalog'))->name('catalog');
Route::get('/vehicles/{vehicle}', function (CatalogVehicle $vehicle) {
    $vehicle->load(['make:id,name', 'model:id,name', 'source:id,name']);

    return Inertia::render('Vehicle', [
        'vehicle' => [
            'id' => $vehicle->id,
            'source_reference' => $vehicle->source_reference,
            'make' => $vehicle->make?->name,
            'model' => $vehicle->model?->name,
            'source' => $vehicle->source?->name,
            'price' => $vehicle->price,
            'mileage' => $vehicle->mileage,
            'power' => $vehicle->power,
            'fuel_type' => $vehicle->fuel_type,
            'year' => $vehicle->year,
        ],
    ]);
})->name('vehicles.show');
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
