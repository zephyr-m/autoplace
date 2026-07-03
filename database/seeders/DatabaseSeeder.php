<?php

namespace Database\Seeders;

use App\Models\CatalogVehicle;
use App\Models\FilterSubscription;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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

        $sourceId = DB::table('import_sources')->insertGetId([
            'name' => 'Demo Import',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $makeId = DB::table('makes')->insertGetId([
            'name' => 'Toyota',
            'status_import' => 1,
            'status_app' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $modelId = DB::table('models')->insertGetId([
            'make_id' => $makeId,
            'name' => 'Camry',
            'status_app' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $subscription = FilterSubscription::query()->firstOrCreate(
            ['user_identifier' => 'demo-user@example.com'],
            [
                'filter' => [
                    'make_id' => $makeId,
                    'model_id' => $modelId,
                    'max_price' => 3000000,
                    'fuel_type' => 'gasoline',
                    'year_from' => 2020,
                ],
            ],
        );

        $vehicle = CatalogVehicle::query()->updateOrCreate(
            [
                'source_id' => $sourceId,
                'source_reference' => 'seed-toyota-camry',
            ],
            [
                'source_id' => $sourceId,
                'source_reference' => 'seed-toyota-camry',
                'make_id' => $makeId,
                'model_id' => $modelId,
                'price' => 2600000,
                'mileage' => 42000,
                'power' => 203,
                'fuel_type' => 'gasoline',
                'year' => 2021,
                'raw_payload' => ['source' => 'seed'],
            ],
        );

        $subscription->refresh();
    }
}
