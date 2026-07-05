<?php

namespace App\Http\Controllers;

use App\Models\CatalogVehicle;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;

class AdminEventCounterController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $latestVehicle = CatalogVehicle::query()
            ->with(['make:id,name', 'model:id,name'])
            ->latest('id')
            ->first();
        $latestNotification = Notification::query()
            ->with([
                'subscription:id,user_identifier',
                'vehicle:id,source_reference,make_id,model_id,price,mileage,power,fuel_type,year',
                'vehicle.make:id,name',
                'vehicle.model:id,name',
            ])
            ->latest('id')
            ->first();

        return response()->json([
            'vehicles' => [
                'count' => CatalogVehicle::query()->count(),
                'latest_id' => CatalogVehicle::query()->max('id') ?? 0,
                'latest' => $latestVehicle ? [
                    'id' => $latestVehicle->id,
                    'title' => trim(($latestVehicle->make?->name ?? '') . ' ' . ($latestVehicle->model?->name ?? '')) ?: "Автомобиль #{$latestVehicle->id}",
                    'year' => $latestVehicle->year,
                    'mileage' => $latestVehicle->mileage,
                    'price' => $latestVehicle->price,
                    'power' => $latestVehicle->power,
                    'fuel_type' => $latestVehicle->fuel_type,
                    'source_reference' => $latestVehicle->source_reference,
                    'url' => url("/admin/catalog-vehicles/{$latestVehicle->id}/edit"),
                ] : null,
            ],
            'notifications' => [
                'count' => Notification::query()->count(),
                'latest_id' => Notification::query()->max('id') ?? 0,
                'latest' => $latestNotification ? [
                    'id' => $latestNotification->id,
                    'subscription_id' => $latestNotification->subscription_id,
                    'user_identifier' => $latestNotification->subscription?->user_identifier,
                    'url' => url("/admin/notifications/{$latestNotification->id}/edit"),
                    'vehicle' => $latestNotification->vehicle ? [
                        'id' => $latestNotification->vehicle->id,
                        'title' => trim(($latestNotification->vehicle->make?->name ?? '') . ' ' . ($latestNotification->vehicle->model?->name ?? '')) ?: "Автомобиль #{$latestNotification->vehicle->id}",
                        'year' => $latestNotification->vehicle->year,
                        'mileage' => $latestNotification->vehicle->mileage,
                        'price' => $latestNotification->vehicle->price,
                        'power' => $latestNotification->vehicle->power,
                        'fuel_type' => $latestNotification->vehicle->fuel_type,
                        'source_reference' => $latestNotification->vehicle->source_reference,
                    ] : null,
                ] : null,
            ],
        ]);
    }
}
