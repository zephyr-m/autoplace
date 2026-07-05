import { useCallback, useEffect, useState } from 'react';

import { getFilterSubscriptions, updateFilterSubscriptionStatus } from '../api/filterSubscriptionRepository';
import type { FilterSubscription } from './types';

export function useFilterSubscriptions(userIdentifier = 'demo-user@example.com') {
    const [subscriptions, setSubscriptions] = useState<FilterSubscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            setSubscriptions(await getFilterSubscriptions(userIdentifier));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Не удалось загрузить подписки');
        } finally {
            setIsLoading(false);
        }
    }, [userIdentifier]);

    useEffect(() => {
        void reload();
    }, [reload]);

    const updateStatus = useCallback(async (subscription: FilterSubscription, status: number) => {
        const updated = await updateFilterSubscriptionStatus(subscription, status);

        setSubscriptions(prev => prev.map(item => item.id === updated.id ? updated : item));

        return updated;
    }, []);

    return { subscriptions, isLoading, error, reload, updateStatus };
}
