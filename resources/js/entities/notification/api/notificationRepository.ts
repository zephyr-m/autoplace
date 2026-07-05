import { graphqlRequest } from '@/shared/api/graphqlClient';

import type { AccountNotification } from '../model/types';

interface UserNotificationsData {
    user_notifications: AccountNotification[];
}

interface UserNotificationsVariables extends Record<string, unknown> {
    userIdentifier: string;
    limit: number;
}

export async function getUserNotifications(
    userIdentifier = 'demo-user@example.com',
    limit = 50,
): Promise<AccountNotification[]> {
    const data = await graphqlRequest<UserNotificationsData, UserNotificationsVariables>(
        `
            query GetUserNotifications($userIdentifier: String!, $limit: Int!) {
              user_notifications(user_identifier: $userIdentifier, limit: $limit) {
                id
                type
                status
                payload
                read_at
                created_at
                subscription {
                  id
                  user_identifier
                }
                vehicle {
                  id
                  source_reference
                  price
                  mileage
                  power
                  fuel_type
                  year
                  make {
                    name
                  }
                  model {
                    name
                  }
                }
              }
            }
        `,
        { userIdentifier, limit },
    );

    return data.user_notifications;
}
