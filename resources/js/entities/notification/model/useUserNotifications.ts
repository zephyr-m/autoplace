import { useCallback, useEffect, useState } from 'react';

import { getUserNotifications } from '../api/notificationRepository';
import type { AccountNotification } from './types';

export function useUserNotifications(userIdentifier = 'demo-user@example.com') {
    const [notifications, setNotifications] = useState<AccountNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            setNotifications(await getUserNotifications(userIdentifier));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : 'Не удалось загрузить уведомления');
        } finally {
            setIsLoading(false);
        }
    }, [userIdentifier]);

    useEffect(() => {
        void reload();
    }, [reload]);

    return { notifications, isLoading, error, reload };
}
