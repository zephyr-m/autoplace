import { graphqlRequest } from '@/shared/api/graphqlClient';
import { GRAPHQL_PAGE_SIZE } from '@/shared/config/pagination';
import type { VehicleModel } from '../model/types';

interface VehicleModelsQueryData {
    vehicle_models: {
        data: VehicleModel[];
    };
}

export async function getVehicleModels(): Promise<VehicleModel[]> {
    const data = await graphqlRequest<VehicleModelsQueryData>(`
        query GetVehicleModels {
          vehicle_models(first: ${GRAPHQL_PAGE_SIZE}) {
            data {
              id
              make_id
              name
            }
          }
        }
    `);

    return data.vehicle_models.data;
}
