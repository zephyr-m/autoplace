import { useState } from 'react';

import type { CatalogFiltersModel, CatalogFiltersState } from './types';

const DEFAULT_FILTERS: CatalogFiltersState = {
    selectedMakes: [],
    selectedModels: [],
    minPrice: 20000,
    maxPrice: 50000,
    minYear: 2018,
    maxYear: 2024,
    minMileage: 0,
    maxMileage: 80000,
    fuels: ['gasoline'],
};

const RESET_FILTERS: CatalogFiltersState = {
    selectedMakes: [],
    selectedModels: [],
    minPrice: 0,
    maxPrice: 150000,
    minYear: 1990,
    maxYear: 2026,
    minMileage: 0,
    maxMileage: 250000,
    fuels: [],
};

export function useCatalogFilters(): CatalogFiltersModel {
    const [selectedMakes, setSelectedMakes] = useState<string[]>(DEFAULT_FILTERS.selectedMakes);
    const [selectedModels, setSelectedModels] = useState<string[]>(DEFAULT_FILTERS.selectedModels);
    const [minPrice, setMinPrice] = useState(DEFAULT_FILTERS.minPrice);
    const [maxPrice, setMaxPrice] = useState(DEFAULT_FILTERS.maxPrice);
    const [minYear, setMinYear] = useState(DEFAULT_FILTERS.minYear);
    const [maxYear, setMaxYear] = useState(DEFAULT_FILTERS.maxYear);
    const [minMileage, setMinMileage] = useState(DEFAULT_FILTERS.minMileage);
    const [maxMileage, setMaxMileage] = useState(DEFAULT_FILTERS.maxMileage);
    const [fuels, setFuels] = useState<string[]>(DEFAULT_FILTERS.fuels);

    const toggleFuel = (fuel: string) => {
        setFuels(prev => prev.includes(fuel) ? prev.filter(item => item !== fuel) : [...prev, fuel]);
    };

    const resetFilters = () => {
        setSelectedMakes(RESET_FILTERS.selectedMakes);
        setSelectedModels(RESET_FILTERS.selectedModels);
        setMinPrice(RESET_FILTERS.minPrice);
        setMaxPrice(RESET_FILTERS.maxPrice);
        setMinYear(RESET_FILTERS.minYear);
        setMaxYear(RESET_FILTERS.maxYear);
        setMinMileage(RESET_FILTERS.minMileage);
        setMaxMileage(RESET_FILTERS.maxMileage);
        setFuels(RESET_FILTERS.fuels);
    };

    return {
        selectedMakes,
        selectedModels,
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        minMileage,
        maxMileage,
        fuels,
        setSelectedMakes,
        setSelectedModels,
        setMinPrice,
        setMaxPrice,
        setMinYear,
        setMaxYear,
        setMinMileage,
        setMaxMileage,
        toggleFuel,
        resetFilters,
    };
}
