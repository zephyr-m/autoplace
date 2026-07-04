<?php

namespace App\Actions;

use App\Models\CatalogVehicle;

class VehicleFilterMatcher
{
    public const FUEL_TYPES = ['gasoline', 'diesel', 'hybrid', 'electric', 'lpg'];

    /**
     * The subscription filter is intentionally sparse: missing keys mean "any value".
     */
    public function matches(CatalogVehicle $vehicle, array $filter): bool
    {
        return $this->integerEqualsIfPresent($filter, 'make_id', $vehicle->make_id)
            && $this->integerEqualsIfPresent($filter, 'model_id', $vehicle->model_id)
            && $this->minIfPresent($filter, 'min_price', $vehicle->price)
            && $this->maxIfPresent($filter, 'max_price', $vehicle->price)
            && $this->minIfPresent($filter, 'min_mileage', $vehicle->mileage)
            && $this->maxIfPresent($filter, 'max_mileage', $vehicle->mileage)
            && $this->minIfPresent($filter, 'min_power', $vehicle->power)
            && $this->maxIfPresent($filter, 'max_power', $vehicle->power)
            && $this->equalsIfPresent($filter, 'fuel_type', $vehicle->fuel_type)
            && $this->minIfPresent($filter, 'year_from', $vehicle->year)
            && $this->maxIfPresent($filter, 'year_to', $vehicle->year);
    }

    public static function cleanFilter(array $input): array
    {
        return collect($input)
            ->only([
                'make_id',
                'model_id',
                'min_price',
                'max_price',
                'min_mileage',
                'max_mileage',
                'min_power',
                'max_power',
                'fuel_type',
                'year_from',
                'year_to',
            ])
            ->reject(fn ($value) => $value === null || $value === '')
            ->all();
    }

    private function integerEqualsIfPresent(array $filter, string $key, int $actual): bool
    {
        return ! array_key_exists($key, $filter) || (int) $filter[$key] === $actual;
    }

    private function equalsIfPresent(array $filter, string $key, string $actual): bool
    {
        return ! array_key_exists($key, $filter) || mb_strtolower((string) $filter[$key]) === mb_strtolower($actual);
    }

    private function minIfPresent(array $filter, string $key, int $actual): bool
    {
        return ! array_key_exists($key, $filter) || $actual >= (int) $filter[$key];
    }

    private function maxIfPresent(array $filter, string $key, int $actual): bool
    {
        return ! array_key_exists($key, $filter) || $actual <= (int) $filter[$key];
    }
}
