import { usePage } from '@inertiajs/react';
import Layout from './Layout';
import { fuelTypeLabels, type PageProps, type Subscription, type Vehicle } from '../types/app';

type Notification = {
    id: number;
    type: string;
    created_at: string;
    subscription: Subscription;
    vehicle: Vehicle;
};

type Props = PageProps & {
    notifications: Notification[];
};

export default function Notifications() {
    const { notifications } = usePage<Props>().props;

    return (
        <Layout>
            <section className="rounded-md border border-zinc-200 bg-white p-5">
                <h1 className="text-xl font-semibold">Полученные уведомления</h1>
                <div className="mt-4 space-y-3">
                    {notifications.map((notification) => (
                        <article key={notification.id} className="rounded-md border border-zinc-200 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="font-semibold">{notification.vehicle.make} {notification.vehicle.model}</div>
                                    <div className="mt-1 text-sm text-zinc-600">
                                        {notification.vehicle.year} · {fuelTypeLabels[notification.vehicle.fuel_type]} · ${notification.vehicle.price.toLocaleString()} · {notification.vehicle.mileage.toLocaleString()} км · {notification.vehicle.power} л.с.
                                    </div>
                                    <div className="mt-2 text-sm text-zinc-500">Для {notification.subscription.user_identifier}</div>
                                </div>
                                <span className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700">{notification.type === 'vehicle_match' ? 'Совпадение' : notification.type}</span>
                            </div>
                        </article>
                    ))}
                    {notifications.length === 0 && <p className="text-sm text-zinc-500">Уведомлений пока нет. Создайте подписку, затем добавьте подходящее событие каталога.</p>}
                </div>
            </section>
        </Layout>
    );
}
