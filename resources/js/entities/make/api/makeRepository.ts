import { graphqlRequest } from '@/shared/api/graphqlClient';
import { GRAPHQL_PAGE_SIZE } from '@/shared/config/pagination';
import type { Make } from '../model/types';

interface MakesQueryData {
    makes: {
        data: Make[];
    };
}

export async function getMakes(): Promise<Make[]> {
    const data = await graphqlRequest<MakesQueryData>(`
        query GetMakes {
          makes(first: ${GRAPHQL_PAGE_SIZE}) {
            data {
              id
              name
            }
          }
        }
    `);

    return data.makes.data;
}
