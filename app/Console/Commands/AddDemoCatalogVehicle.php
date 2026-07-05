<?php

namespace App\Console\Commands;

use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use App\Models\ImportSource;
use App\Models\Make;
use App\Models\VehicleModel;
use App\Support\DemoVehicleGeneration;
use Illuminate\Console\Command;

class AddDemoCatalogVehicle extends Command
{
    protected $signature = 'demo:add-catalog-vehicle {--count=1 : Number of vehicles to add}';

    protected $description = 'Add demo catalog vehicles and queue subscription matching.';

    public function handle(): int
    {
        if (! DemoVehicleGeneration::isEnabled()) {
            $this->info('Demo catalog vehicle generation is disabled.');

            return self::SUCCESS;
        }

        $count = max(1, (int) $this->option('count'));
        $created = [];
        $this->ensureCatalogReferences();

        for ($i = 0; $i < $count; $i++) {
            $model = VehicleModel::query()
                ->with('make:id,name')
                ->inRandomOrder()
                ->firstOrFail();
            $profile = $this->randomSourceProfile();
            $source = ImportSource::query()->firstOrCreate(['name' => $profile['source']]);
            $year = random_int($profile['year'][0], $profile['year'][1]);
            $fuelTypes = $this->fuelTypesFor($model, $profile['fuel_types']);
            $fuelType = $fuelTypes[array_rand($fuelTypes)];

            $vehicle = CatalogVehicle::query()->create([
                'source_id' => $source->id,
                'source_reference' => sprintf('auto-%s-%04d', now()->format('YmdHis'), random_int(1, 9999)),
                'make_id' => $model->make_id,
                'model_id' => $model->id,
                'price' => random_int($profile['price'][0], $profile['price'][1]),
                'mileage' => random_int($profile['mileage'][0], $profile['mileage'][1]),
                'power' => random_int($profile['power'][0], $profile['power'][1]),
                'fuel_type' => $fuelType,
                'year' => $year,
                'raw_payload' => [
                    'created_from' => 'scheduler',
                    'source_profile' => $profile['source'],
                    'generated_at' => now()->toISOString(),
                ],
            ]);

            ProcessVehicleSubscriptions::dispatch($vehicle->id);
            $created[] = [
                $vehicle->id,
                "{$model->make->name} {$model->name}",
                $source->name,
                $vehicle->year,
                $vehicle->mileage,
                $this->fuelLabel($vehicle->fuel_type),
                $vehicle->price,
            ];
        }

        $this->table(['ID', 'Автомобиль', 'Источник', 'Год', 'Пробег', 'Топливо', 'Цена'], $created);

        return self::SUCCESS;
    }

    /**
     * @return array<int, array{
     *     source: string,
     *     price: array{int, int},
     *     mileage: array{int, int},
     *     power: array{int, int},
     *     year: array{int, int},
     *     fuel_types: array<int, string>
     * }>
     */
    private function sourceProfiles(): array
    {
        return [
            [
                'source' => 'dealer_feed',
                'price' => [28000, 85000],
                'mileage' => [0, 65000],
                'power' => [150, 420],
                'year' => [2020, ((int) date('Y')) + 1],
                'fuel_types' => ['gasoline', 'diesel', 'hybrid', 'electric'],
            ],
            [
                'source' => 'auction_feed',
                'price' => [7000, 45000],
                'mileage' => [60000, 240000],
                'power' => [90, 320],
                'year' => [2012, 2022],
                'fuel_types' => ['gasoline', 'diesel', 'hybrid', 'lpg'],
            ],
            [
                'source' => 'classifieds_feed',
                'price' => [5000, 65000],
                'mileage' => [10000, 210000],
                'power' => [80, 450],
                'year' => [2010, ((int) date('Y')) + 1],
                'fuel_types' => ['gasoline', 'diesel', 'hybrid', 'electric', 'lpg'],
            ],
        ];
    }

    /**
     * @return array{
     *     source: string,
     *     price: array{int, int},
     *     mileage: array{int, int},
     *     power: array{int, int},
     *     year: array{int, int},
     *     fuel_types: array<int, string>
     * }
     */
    private function randomSourceProfile(): array
    {
        $profiles = $this->sourceProfiles();

        return $profiles[array_rand($profiles)];
    }

    private function ensureCatalogReferences(): void
    {
        if (VehicleModel::query()->exists()) {
            return;
        }

        foreach ($this->fallbackModels() as $modelData) {
            $make = Make::query()->firstOrCreate(['name' => $modelData['make']]);
            VehicleModel::query()->firstOrCreate([
                'make_id' => $make->id,
                'name' => $modelData['model'],
            ]);
        }
    }

    /**
     * @return array<int, array{make: string, model: string}>
     */
    private function fallbackModels(): array
    {
        return [
            [
                'make' => 'Toyota',
                'model' => 'Camry',
            ],
            [
                'make' => 'Toyota',
                'model' => 'RAV4',
            ],
            [
                'make' => 'Toyota',
                'model' => 'Corolla',
            ],
            [
                'make' => 'Tesla',
                'model' => 'Model 3',
            ],
            [
                'make' => 'Tesla',
                'model' => 'Model Y',
            ],
            [
                'make' => 'Tesla',
                'model' => 'Model S',
            ],
            [
                'make' => 'BMW',
                'model' => '320d',
            ],
            [
                'make' => 'BMW',
                'model' => 'X5',
            ],
            [
                'make' => 'BMW',
                'model' => 'X3',
            ],
            [
                'make' => 'Hyundai',
                'model' => 'Tucson',
            ],
            [
                'make' => 'Hyundai',
                'model' => 'Elantra',
            ],
            [
                'make' => 'Hyundai',
                'model' => 'Santa Fe',
            ],
            [
                'make' => 'Mercedes-Benz',
                'model' => 'C-Class',
            ],
            [
                'make' => 'Mercedes-Benz',
                'model' => 'E-Class',
            ],
            [
                'make' => 'Mercedes-Benz',
                'model' => 'GLC',
            ],
        ];
    }

    /**
     * @param array<int, string> $profileFuelTypes
     *
     * @return array<int, string>
     */
    private function fuelTypesFor(VehicleModel $model, array $profileFuelTypes): array
    {
        $modelFuelTypes = [
            'Camry' => ['gasoline', 'hybrid'],
            'RAV4' => ['gasoline', 'hybrid'],
            'Corolla' => ['gasoline', 'hybrid'],
            'Model 3' => ['electric'],
            'Model Y' => ['electric'],
            'Model S' => ['electric'],
            '320d' => ['diesel'],
            'X5' => ['gasoline', 'diesel', 'hybrid'],
            'X3' => ['gasoline', 'diesel', 'hybrid'],
            'Tucson' => ['gasoline', 'diesel', 'hybrid'],
            'Elantra' => ['gasoline', 'hybrid', 'lpg'],
            'Santa Fe' => ['gasoline', 'diesel', 'hybrid'],
            'C-Class' => ['gasoline', 'diesel', 'hybrid'],
            'E-Class' => ['gasoline', 'diesel', 'hybrid'],
            'GLC' => ['gasoline', 'diesel', 'hybrid'],
        ][$model->name] ?? $profileFuelTypes;

        return array_values(array_intersect($profileFuelTypes, $modelFuelTypes)) ?: $modelFuelTypes;
    }

    private function fuelLabel(string $fuelType): string
    {
        return [
            'gasoline' => 'Бензин',
            'diesel' => 'Дизель',
            'hybrid' => 'Гибрид',
            'electric' => 'Электро',
            'lpg' => 'Газ',
        ][$fuelType] ?? $fuelType;
    }
}
