<?php

namespace Database\Seeders;

use App\Models\CatalogVehicle;
use App\Models\ImportSource;
use App\Models\Make;
use App\Models\VehicleModel;
use Illuminate\Database\Seeder;

class CatalogVehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $source = ImportSource::query()->firstOrCreate([
            'name' => 'Demo Import',
        ], [
            'is_active' => true,
        ]);

        foreach ($this->vehicles() as $vehicle) {
            $make = Make::query()->firstOrCreate([
                'name' => $vehicle['make'],
            ], [
                'status_import' => 1,
                'status_app' => 1,
            ]);

            $model = VehicleModel::query()->firstOrCreate([
                'make_id' => $make->id,
                'name' => $vehicle['model'],
            ], [
                'status_app' => 1,
            ]);

            CatalogVehicle::query()->updateOrCreate(
                [
                    'source_id' => $source->id,
                    'source_reference' => $vehicle['source_reference'],
                ],
                [
                    'source_id' => $source->id,
                    'source_reference' => $vehicle['source_reference'],
                    'make_id' => $make->id,
                    'model_id' => $model->id,
                    'price' => $vehicle['price'],
                    'mileage' => $vehicle['mileage'],
                    'power' => $vehicle['power'],
                    'fuel_type' => $vehicle['fuel_type'],
                    'year' => $vehicle['year'],
                    'raw_payload' => [
                        'source' => 'seed',
                        'title' => $vehicle['title'],
                        'city' => $vehicle['city'],
                        'seller' => $vehicle['seller'],
                        'condition' => $vehicle['condition'],
                    ],
                ],
            );
        }
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function vehicles(): array
    {
        return [
            [
                'source_reference' => 'seed-toyota-camry-2021',
                'make' => 'Toyota',
                'model' => 'Camry',
                'title' => 'Toyota Camry 2.5 Comfort',
                'price' => 26000,
                'mileage' => 42000,
                'power' => 203,
                'fuel_type' => 'gasoline',
                'year' => 2021,
                'city' => 'Алматы',
                'seller' => 'Дилер AutoLine',
                'condition' => 'Проверенная история, один владелец',
            ],
            [
                'source_reference' => 'seed-toyota-rav4-2020',
                'make' => 'Toyota',
                'model' => 'RAV4',
                'title' => 'Toyota RAV4 Hybrid',
                'price' => 33500,
                'mileage' => 68000,
                'power' => 219,
                'fuel_type' => 'hybrid',
                'year' => 2020,
                'city' => 'Астана',
                'seller' => 'Toyota City',
                'condition' => 'Гибрид, полный привод, сервис у дилера',
            ],
            [
                'source_reference' => 'seed-bmw-320d-2019',
                'make' => 'BMW',
                'model' => '320d',
                'title' => 'BMW 320d xDrive',
                'price' => 31800,
                'mileage' => 89000,
                'power' => 190,
                'fuel_type' => 'diesel',
                'year' => 2019,
                'city' => 'Алматы',
                'seller' => 'Premium Cars',
                'condition' => 'Дизель, полный привод, зимний комплект',
            ],
            [
                'source_reference' => 'seed-bmw-x5-2022',
                'make' => 'BMW',
                'model' => 'X5',
                'title' => 'BMW X5 40i',
                'price' => 72000,
                'mileage' => 31000,
                'power' => 340,
                'fuel_type' => 'gasoline',
                'year' => 2022,
                'city' => 'Астана',
                'seller' => 'Bavaria Motors',
                'condition' => 'Премиальная комплектация, панорама',
            ],
            [
                'source_reference' => 'seed-tesla-model3-2022',
                'make' => 'Tesla',
                'model' => 'Model 3',
                'title' => 'Tesla Model 3 Long Range',
                'price' => 39000,
                'mileage' => 18000,
                'power' => 283,
                'fuel_type' => 'electric',
                'year' => 2022,
                'city' => 'Астана',
                'seller' => 'Частный продавец',
                'condition' => 'Домашняя зарядка, чистый салон',
            ],
            [
                'source_reference' => 'seed-tesla-modely-2023',
                'make' => 'Tesla',
                'model' => 'Model Y',
                'title' => 'Tesla Model Y Performance',
                'price' => 54500,
                'mileage' => 12000,
                'power' => 450,
                'fuel_type' => 'electric',
                'year' => 2023,
                'city' => 'Алматы',
                'seller' => 'EV Market',
                'condition' => 'Performance, свежая батарея',
            ],
            [
                'source_reference' => 'seed-hyundai-tucson-2021',
                'make' => 'Hyundai',
                'model' => 'Tucson',
                'title' => 'Hyundai Tucson 2.5',
                'price' => 28500,
                'mileage' => 36000,
                'power' => 187,
                'fuel_type' => 'gasoline',
                'year' => 2021,
                'city' => 'Шымкент',
                'seller' => 'Частный продавец',
                'condition' => 'Камера 360, аккуратный кузов',
            ],
            [
                'source_reference' => 'seed-hyundai-santafe-2020',
                'make' => 'Hyundai',
                'model' => 'Santa Fe',
                'title' => 'Hyundai Santa Fe Diesel',
                'price' => 33200,
                'mileage' => 76000,
                'power' => 200,
                'fuel_type' => 'diesel',
                'year' => 2020,
                'city' => 'Караганда',
                'seller' => 'Family Auto',
                'condition' => 'Семиместный салон, экономичный дизель',
            ],
            [
                'source_reference' => 'seed-mercedes-cclass-2020',
                'make' => 'Mercedes-Benz',
                'model' => 'C-Class',
                'title' => 'Mercedes-Benz C 200',
                'price' => 36200,
                'mileage' => 48000,
                'power' => 184,
                'fuel_type' => 'gasoline',
                'year' => 2020,
                'city' => 'Астана',
                'seller' => 'Star Motors',
                'condition' => 'Без ДТП, подтвержденный пробег',
            ],
            [
                'source_reference' => 'seed-mercedes-glc-2021',
                'make' => 'Mercedes-Benz',
                'model' => 'GLC',
                'title' => 'Mercedes-Benz GLC 300',
                'price' => 49800,
                'mileage' => 54000,
                'power' => 258,
                'fuel_type' => 'gasoline',
                'year' => 2021,
                'city' => 'Алматы',
                'seller' => 'German Auto',
                'condition' => 'AMG пакет, дилерское обслуживание',
            ],
        ];
    }
}
