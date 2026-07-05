import type { Make } from '@/entities/make/model/types';
import type { VehicleModel } from '@/entities/vehicle-model/model/types';

import type { CatalogFiltersState } from './types';

export function buildSubscriptionFilter(
    filters: CatalogFiltersState,
    makes: Make[],
    models: VehicleModel[],
): Record<string, unknown> {
    const makeIds = makes
        .filter(make => filters.selectedMakes.includes(make.name))
        .map(make => Number(make.id));

    const modelIds = models
        .filter(model => filters.selectedModels.includes(model.name))
        .map(model => Number(model.id));

    return removeEmptyValues({
        make_ids: makeIds,
        model_ids: modelIds,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        min_mileage: filters.minMileage,
        max_mileage: filters.maxMileage,
        fuel_types: filters.fuels,
        year_from: filters.minYear,
        year_to: filters.maxYear,
    });
}

function removeEmptyValues(filter: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(filter).filter(([, value]) => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }

            return value !== null && value !== undefined && value !== '';
        }),
    );
}
