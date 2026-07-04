<?php

namespace App\Console\Commands;

use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
use App\Models\ImportSource;
use App\Models\Make;
use App\Models\VehicleModel;
use Illuminate\Console\Command;

class AddDemoCatalogVehicle extends Command
{
    protected $signature = 'demo:add-catalog-vehicle {--count=1 : Number of vehicles to add}';

    protected $description = 'Add demo catalog vehicles and queue subscription matching.';

    public function handle(): int
    {
        $count = max(1, (int) $this->option('count'));
        $created = [];
        $templates = $this->templates();

        for ($i = 0; $i < $count; $i++) {
            $template = $templates[array_rand($templates)];
            $make = Make::query()->firstOrCreate(['name' => $template['make_name']]);
            $model = VehicleModel::query()->firstOrCreate([
                'make_id' => $make->id,
                'name' => $template['model_name'],
            ]);
            $source = ImportSource::query()->firstOrCreate(['name' => 'Scheduler Demo']);

            $vehicle = CatalogVehicle::query()->create([
                'source_id' => $source->id,
                'source_reference' => sprintf('auto-%s-%04d', now()->format('YmdHis'), random_int(1, 9999)),
                'make_id' => $make->id,
                'model_id' => $model->id,
                'price' => $this->vary($template['price'], 2500, 5000),
                'mileage' => max(0, $this->vary($template['mileage'], 4000, 9000)),
                'power' => $template['power'],
                'fuel_type' => $template['fuel_type'],
                'year' => $template['year'],
                'raw_payload' => ['created_from' => 'scheduler'],
            ]);

            ProcessVehicleSubscriptions::dispatch($vehicle->id);
            $created[] = [$vehicle->id, "{$make->name} {$model->name}", $vehicle->year, $this->fuelLabel($vehicle->fuel_type), $vehicle->price];
        }

        $this->table(['ID', 'Автомобиль', 'Год', 'Топливо', 'Цена'], $created);

        return self::SUCCESS;
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function templates(): array
    {
        return [
            [
                'make_name' => 'Toyota',
                'model_name' => 'Camry',
                'price' => 26000,
                'mileage' => 42000,
                'power' => 203,
                'fuel_type' => 'gasoline',
                'year' => 2021,
            ],
            [
                'make_name' => 'Toyota',
                'model_name' => 'RAV4',
                'price' => 33500,
                'mileage' => 31000,
                'power' => 219,
                'fuel_type' => 'hybrid',
                'year' => 2022,
            ],
            [
                'make_name' => 'Tesla',
                'model_name' => 'Model 3',
                'price' => 39000,
                'mileage' => 18000,
                'power' => 283,
                'fuel_type' => 'electric',
                'year' => 2022,
            ],
            [
                'make_name' => 'BMW',
                'model_name' => '320d',
                'price' => 31000,
                'mileage' => 55000,
                'power' => 190,
                'fuel_type' => 'diesel',
                'year' => 2020,
            ],
            [
                'make_name' => 'Hyundai',
                'model_name' => 'Tucson',
                'price' => 28500,
                'mileage' => 36000,
                'power' => 187,
                'fuel_type' => 'gasoline',
                'year' => 2021,
            ],
        ];
    }

    private function vary(int $value, int $down, int $up): int
    {
        return $value + random_int(-$down, $up);
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
