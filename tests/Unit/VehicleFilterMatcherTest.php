<?php

namespace Tests\Unit;

use App\Actions\VehicleFilterMatcher;
use App\Models\CatalogVehicle;
use Tests\TestCase;

class VehicleFilterMatcherTest extends TestCase
{
    public function test_matches_sparse_filter_with_price_year_and_fuel(): void
    {
        $vehicle = new CatalogVehicle([
            'make_id' => 1,
            'model_id' => 10,
            'price' => 26000,
            'mileage' => 42000,
            'power' => 203,
            'fuel_type' => 'gasoline',
            'year' => 2021,
        ]);

        $this->assertTrue((new VehicleFilterMatcher)->matches($vehicle, [
            'make_id' => 1,
            'model_id' => 10,
            'max_price' => 30000,
            'fuel_type' => 'gasoline',
            'year_from' => 2020,
        ]));
    }

    public function test_rejects_vehicle_outside_range(): void
    {
        $vehicle = new CatalogVehicle([
            'make_id' => 2,
            'model_id' => 20,
            'price' => 39000,
            'mileage' => 18000,
            'power' => 283,
            'fuel_type' => 'electric',
            'year' => 2022,
        ]);

        $this->assertFalse((new VehicleFilterMatcher)->matches($vehicle, [
            'max_price' => 30000,
            'fuel_type' => 'electric',
        ]));
    }

    public function test_matches_power_and_mileage_combination(): void
    {
        $vehicle = new CatalogVehicle([
            'make_id' => 3,
            'model_id' => 30,
            'price' => 31000,
            'mileage' => 55000,
            'power' => 190,
            'fuel_type' => 'diesel',
            'year' => 2020,
        ]);

        $this->assertTrue((new VehicleFilterMatcher)->matches($vehicle, [
            'min_power' => 180,
            'max_mileage' => 60000,
            'year_to' => 2021,
        ]));
    }

    public function test_matches_multi_value_subscription_filters(): void
    {
        $vehicle = new CatalogVehicle([
            'make_id' => 2,
            'model_id' => 20,
            'price' => 39000,
            'mileage' => 18000,
            'power' => 283,
            'fuel_type' => 'electric',
            'year' => 2022,
        ]);

        $this->assertTrue((new VehicleFilterMatcher)->matches($vehicle, [
            'make_ids' => [1, 2],
            'model_ids' => [20, 21],
            'fuel_types' => ['gasoline', 'electric'],
            'max_price' => 40000,
        ]));
    }
}
