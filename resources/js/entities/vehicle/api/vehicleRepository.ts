import type { Vehicle } from '@/entities/vehicle/model/types';
import { graphqlRequest } from '@/shared/api/graphqlClient';
import { GRAPHQL_PAGE_SIZE } from '@/shared/config/pagination';

interface CatalogVehicleNode {
    id: string;
    source_reference: string;
    price: number;
    mileage: number;
    power: number;
    fuel_type: string;
    year: number;
    created_at: string | null;
    make: { name: string } | null;
    model: { name: string } | null;
}

interface CatalogVehiclesQueryData {
    catalog_vehicles: {
        data: CatalogVehicleNode[];
    };
}

const vehicleImages = [
    'https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
];

export async function getCatalogVehicles(): Promise<Vehicle[]> {
    const data = await graphqlRequest<CatalogVehiclesQueryData>(`
        query GetCatalogVehicles {
          catalog_vehicles(first: ${GRAPHQL_PAGE_SIZE}) {
            data {
              id
              source_reference
              price
              mileage
              power
              fuel_type
              year
              created_at
              make {
                name
              }
              model {
                name
              }
            }
          }
        }
    `);

    return data.catalog_vehicles.data.map(toVehicle);
}

function toVehicle(node: CatalogVehicleNode, index: number): Vehicle {
    const make = node.make?.name ?? 'Unknown';
    const model = node.model?.name ?? 'Unknown';
    const title = `${make} ${model}`;

    return {
        id: Number(node.id),
        make,
        model,
        title,
        description: `${fuelLabel(node.fuel_type)}, ${node.power} л.с., ${node.year} год`,
        price: node.price,
        mileage: node.mileage,
        fuel_type: node.fuel_type,
        power: node.power,
        transmission: 'Автомат',
        drive: 'Передний',
        year: node.year,
        seller: 'Demo Import',
        city: 'Алматы',
        date: node.created_at ? 'из каталога' : 'сегодня',
        image: vehicleImages[index % vehicleImages.length],
        verified: true,
        tag: 'Каталог',
    };
}

function fuelLabel(fuelType: string): string {
    if (fuelType === 'gasoline') {
        return 'Бензин';
    }

    if (fuelType === 'diesel') {
        return 'Дизель';
    }

    if (fuelType === 'electric') {
        return 'Электро';
    }

    if (fuelType === 'hybrid') {
        return 'Гибрид';
    }

    return fuelType;
}
