export interface FilterSubscription {
    id: string;
    user_identifier: string;
    filter: Record<string, unknown>;
    status: number;
}

export interface CreateFilterSubscriptionInput {
    userIdentifier: string;
    filter: Record<string, unknown>;
}
