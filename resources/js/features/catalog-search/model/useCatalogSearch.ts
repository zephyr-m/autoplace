import { useCallback, useEffect, useState } from 'react';

import { getMakes } from '@/entities/make/api/makeRepository';
import type { Make } from '@/entities/make/model/types';
import { getCatalogVehicles } from '@/entities/vehicle/api/vehicleRepository';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { getVehicleModels } from '@/entities/vehicle-model/api/vehicleModelRepository';
import type { VehicleModel } from '@/entities/vehicle-model/model/types';

interface CatalogSearchState {
    vehicles: Vehicle[];
    makes: Make[];
    models: VehicleModel[];
    isLoading: boolean;
    error: string | null;
    reload: () => Promise<void>;
}

export function useCatalogSearch(): CatalogSearchState {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [makes, setMakes] = useState<Make[]>([]);
    const [models, setModels] = useState<VehicleModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [nextVehicles, nextMakes, nextModels] = await Promise.all([
                getCatalogVehicles(),
                getMakes(),
                getVehicleModels(),
            ]);

            setVehicles(nextVehicles);
            setMakes(nextMakes);
            setModels(nextModels);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Не удалось загрузить каталог.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void reload();
    }, [reload]);

    return { vehicles, makes, models, isLoading, error, reload };
}
