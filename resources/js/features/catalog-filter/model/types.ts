export interface CatalogFiltersState {
    selectedMakes: string[];
    selectedModels: string[];
    minPrice: number;
    maxPrice: number;
    minYear: number;
    maxYear: number;
    minMileage: number;
    maxMileage: number;
    fuels: string[];
}

export interface CatalogFiltersActions {
    setSelectedMakes: (makes: string[]) => void;
    setSelectedModels: (models: string[]) => void;
    setMinPrice: (value: number) => void;
    setMaxPrice: (value: number) => void;
    setMinYear: (value: number) => void;
    setMaxYear: (value: number) => void;
    setMinMileage: (value: number) => void;
    setMaxMileage: (value: number) => void;
    toggleFuel: (fuel: string) => void;
    resetFilters: () => void;
}

export type CatalogFiltersModel = CatalogFiltersState & CatalogFiltersActions;
