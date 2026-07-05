import { graphqlRequest } from '@/shared/api/graphqlClient';

import type { CreateFilterSubscriptionInput, FilterSubscription } from '../model/types';

const ACTIVE_STATUS = 1;

interface CreateFilterSubscriptionData {
    createFilterSubscription: FilterSubscription;
}

interface FilterSubscriptionsData {
    filter_subscriptions: {
        data: FilterSubscription[];
    };
}

interface CreateFilterSubscriptionVariables extends Record<string, unknown> {
    userIdentifier: string;
    filter: Record<string, unknown>;
    status: number;
}

export async function createFilterSubscription(input: CreateFilterSubscriptionInput): Promise<FilterSubscription> {
    const data = await graphqlRequest<CreateFilterSubscriptionData, CreateFilterSubscriptionVariables>(
        `
            mutation CreateFilterSubscription($userIdentifier: String!, $filter: JSON!, $status: Int!) {
              createFilterSubscription(user_identifier: $userIdentifier, filter: $filter, status: $status) {
                id
                user_identifier
                filter
                status
              }
            }
        `,
        {
            userIdentifier: input.userIdentifier,
            filter: input.filter,
            status: ACTIVE_STATUS,
        },
    );

    return data.createFilterSubscription;
}

export async function getFilterSubscriptions(userIdentifier = 'demo-user@example.com'): Promise<FilterSubscription[]> {
    const data = await graphqlRequest<FilterSubscriptionsData, { userIdentifier: string }>(
        `
            query GetFilterSubscriptions($userIdentifier: String!) {
              filter_subscriptions(user_identifier: $userIdentifier, first: 100) {
                data {
                  id
                  user_identifier
                  filter
                  status
                }
              }
            }
        `,
        { userIdentifier },
    );

    return data.filter_subscriptions.data;
}
