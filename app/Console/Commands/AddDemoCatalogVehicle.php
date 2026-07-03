<?php

namespace App\Console\Commands;

use App\Jobs\ProcessVehicleSubscriptions;
use App\Models\CatalogVehicle;
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
            $vehicle = CatalogVehicle::query()->create([
                ...$template,
                'source_reference' => sprintf('auto-%s-%04d', now()->format('YmdHis'), random_int(1, 9999)),
                'price' => $this->vary($template['price'], 2500, 5000),
                'mileage' => max(0, $this->vary($template['mileage'], 4000, 9000)),
                'payload' => ['created_from' => 'scheduler'],
            ]);

            ProcessVehicleSubscriptions::dispatch($vehicle->id);
            $created[] = [$vehicle->id, "{$vehicle->make} {$vehicle->model}", $vehicle->year, $this->fuelLabel($vehicle->fuel_type), $vehicle->price];
        }

        $this->table(['ID', 'Автомобиль', 'Год', 'Топливо', 'Цена'], $created);

        return self::SUCCESS;
    }

    /**
     * IDs are demo catalog identifiers, matching the subscription filter contract.
     *
     * @return array<int, array<string, int|string>>
     */
    private function templates(): array
    {
        return [
            [
                'make_id' => 1,
                'model_id' => 10,
                'make' => 'Toyota',
                'model' => 'Camry',
                'price' => 26000,
                'mileage' => 42000,
                'power' => 203,
                'fuel_type' => 'gasoline',
                'year' => 2021,
            ],
            [
                'make_id' => 1,
                'model_id' => 11,
                'make' => 'Toyota',
                'model' => 'RAV4',
                'price' => 33500,
                'mileage' => 31000,
                'power' => 219,
                'fuel_type' => 'hybrid',
                'year' => 2022,
            ],
            [
                'make_id' => 2,
                'model_id' => 20,
                'make' => 'Tesla',
                'model' => 'Model 3',
                'price' => 39000,
                'mileage' => 18000,
                'power' => 283,
                'fuel_type' => 'electric',
                'year' => 2022,
            ],
            [
                'make_id' => 3,
                'model_id' => 30,
                'make' => 'BMW',
                'model' => '320d',
                'price' => 31000,
                'mileage' => 55000,
                'power' => 190,
                'fuel_type' => 'diesel',
                'year' => 2020,
            ],
            [
                'make_id' => 4,
                'model_id' => 40,
                'make' => 'Hyundai',
                'model' => 'Tucson',
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
