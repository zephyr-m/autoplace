<?php

namespace Database\Seeders;

use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use App\Models\FilterSubscription;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::query()->firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => 'password',
            ],
        );

        $subscription = FilterSubscription::query()->firstOrCreate(
            ['user_identifier' => 'demo-user@example.com'],
            [
                'filter' => [
                    'make' => 'Toyota',
                    'max_price' => 30000,
                    'fuel_type' => 'gasoline',
                    'year_from' => 2020,
                ],
                'status' => FilterSubscription::STATUS_ACTIVE,
            ],
        );

        $vehicles = [
            [
                'source_reference' => 'seed-toyota-camry',
                'make_id' => 1,
                'model_id' => 10,
                'make' => 'Toyota',
                'model' => 'Camry',
                'price' => 26000,
                'mileage' => 42000,
                'power' => 203,
                'fuel_type' => 'gasoline',
                'year' => 2021,
                'payload' => ['source' => 'seed'],
            ],
            [
                'source_reference' => 'seed-tesla-model-3',
                'make_id' => 2,
                'model_id' => 20,
                'make' => 'Tesla',
                'model' => 'Model 3',
                'price' => 39000,
                'mileage' => 18000,
                'power' => 283,
                'fuel_type' => 'electric',
                'year' => 2022,
                'payload' => ['source' => 'seed'],
            ],
        ];

        foreach ($vehicles as $vehicleData) {
            $vehicle = CatalogVehicle::query()->updateOrCreate(
                ['source_reference' => $vehicleData['source_reference']],
                $vehicleData,
            );

            ProcessVehicleSubscriptions::dispatchSync($vehicle->id);
        }

        $subscription->refresh();
    }
}
