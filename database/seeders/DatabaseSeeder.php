<?php

namespace Database\Seeders;

use App\Models\CatalogVehicle;
use App\Models\FilterSubscription;
use App\Models\ImportSource;
use App\Models\Make;
use App\Models\User;
use App\Models\VehicleModel;
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

        $source = ImportSource::query()->firstOrCreate([
            'name' => 'Demo Import',
        ], [
            'is_active' => true,
        ]);

        $models = $this->seedCatalogReferences();
        $camry = $models['Toyota']['Camry'];
        $toyota = $camry->make;

        $subscription = FilterSubscription::query()->firstOrCreate(
            ['user_identifier' => 'demo-user@example.com'],
            [
                'filter' => [
                    'make_id' => $toyota->id,
                    'model_id' => $camry->id,
                    'max_price' => 3000000,
                    'fuel_type' => 'gasoline',
                    'year_from' => 2020,
                ],
                'status' => FilterSubscription::STATUS_ACTIVE,
            ],
        );

        $this->call(CatalogVehicleSeeder::class);

        $subscription->refresh();
    }

    /**
     * @return array<string, array<string, VehicleModel>>
     */
    private function seedCatalogReferences(): array
    {
        $references = [];

        foreach ($this->catalogReferences() as $makeName => $modelNames) {
            $make = Make::query()->firstOrCreate([
                'name' => $makeName,
            ], [
                'status_import' => 1,
                'status_app' => 1,
            ]);

            foreach ($modelNames as $modelName) {
                $references[$makeName][$modelName] = VehicleModel::query()->firstOrCreate([
                    'make_id' => $make->id,
                    'name' => $modelName,
                ], [
                    'status_app' => 1,
                ])->load('make');
            }
        }

        return $references;
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function catalogReferences(): array
    {
        return [
            'Toyota' => ['Camry', 'RAV4', 'Corolla'],
            'BMW' => ['320d', 'X5', 'X3'],
            'Tesla' => ['Model 3', 'Model Y', 'Model S'],
            'Hyundai' => ['Tucson', 'Elantra', 'Santa Fe'],
            'Mercedes-Benz' => ['C-Class', 'E-Class', 'GLC'],
        ];
    }
}
