<?php

use App\Http\Controllers\CatalogVehicleController;
use App\Http\Controllers\FilterSubscriptionController;
use App\Http\Controllers\ImportSourceController;
use App\Http\Controllers\MakeController;
use App\Http\Controllers\VehicleModelController;
use Illuminate\Support\Facades\Route;

Route::post('/internal/catalog-vehicles', [CatalogVehicleController::class, 'storeApi']);

Route::apiResource('makes', MakeController::class);
Route::apiResource('models', VehicleModelController::class);
Route::apiResource('import-sources', ImportSourceController::class);
Route::get('catalog-vehicles', [CatalogVehicleController::class, 'index'])->name('catalog-vehicles.index');
Route::apiResource('filter-subscriptions', FilterSubscriptionController::class);
