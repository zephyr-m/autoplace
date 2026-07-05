import type { Vehicle } from '@/entities/vehicle/model/types';

import type { CatalogFiltersState } from './types';

export type CatalogSortOrder = 'newest' | 'cheapest' | 'expensive' | 'mileage';

export function filterAndSortVehicles(
    vehicles: Vehicle[],
    filters: CatalogFiltersState,
    sortOrder: CatalogSortOrder,
): Vehicle[] {
    let result = [...vehicles];

    if (filters.selectedMakes.length > 0) {
        result = result.filter(vehicle => filters.selectedMakes.includes(vehicle.make));
    }

    if (filters.selectedModels.length > 0) {
        result = result.filter(vehicle => filters.selectedModels.includes(vehicle.model));
    }

    result = result.filter(vehicle => vehicle.price >= filters.minPrice && vehicle.price <= filters.maxPrice);
    result = result.filter(vehicle => vehicle.year >= filters.minYear && vehicle.year <= filters.maxYear);
    result = result.filter(vehicle => vehicle.mileage >= filters.minMileage && vehicle.mileage <= filters.maxMileage);

    if (filters.fuels.length > 0) {
        result = result.filter(vehicle => filters.fuels.includes(vehicle.fuel_type));
    }

    if (sortOrder === 'newest') {
        result.sort((a, b) => b.year - a.year);
    } else if (sortOrder === 'cheapest') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'expensive') {
        result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'mileage') {
        result.sort((a, b) => a.mileage - b.mileage);
    }

    return result;
}
