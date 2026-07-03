<?php

use App\Http\Controllers\CatalogVehicleController;
use Illuminate\Support\Facades\Route;

Route::post('/internal/catalog-vehicles', [CatalogVehicleController::class, 'storeApi']);
