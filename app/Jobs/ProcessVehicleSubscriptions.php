<?php

namespace App\Jobs;

use App\Actions\VehicleFilterMatcher;
use App\Models\CatalogVehicle;
use App\Models\FilterSubscription;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessVehicleSubscriptions implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $vehicleId) {}

    public function handle(VehicleFilterMatcher $matcher): void
    {
        $vehicle = CatalogVehicle::query()
            ->with(['make:id,name', 'model:id,name'])
            ->findOrFail($this->vehicleId);

        FilterSubscription::query()
            ->where('status', FilterSubscription::STATUS_ACTIVE)
            ->orderBy('id')
            ->chunkById(100, function ($subscriptions) use ($matcher, $vehicle): void {
                $forceMatch = (bool) config('services.vehicle_matching.force_match');

                foreach ($subscriptions as $subscription) {
                    if (! $forceMatch && ! $matcher->matches($vehicle, $subscription->filter ?? [])) {
                        continue;
                    }

                    Notification::query()->createOrFirst(
                        [
                            'subscription_id' => $subscription->id,
                            'vehicle_id' => $vehicle->id,
                            'type' => Notification::TYPE_VEHICLE_MATCH,
                        ],
                        [
                            'payload' => [
                                'vehicle' => [
                                    'id' => $vehicle->id,
                                    'make_id' => $vehicle->make_id,
                                    'model_id' => $vehicle->model_id,
                                    'make' => $vehicle->make?->name,
                                    'model' => $vehicle->model?->name,
                                    'price' => $vehicle->price,
                                    'mileage' => $vehicle->mileage,
                                    'power' => $vehicle->power,
                                    'fuel_type' => $vehicle->fuel_type,
                                    'year' => $vehicle->year,
                                ],
                                'matched_filter' => $subscription->filter,
                            ],
                        ],
                    );
                }
            });
    }
}
