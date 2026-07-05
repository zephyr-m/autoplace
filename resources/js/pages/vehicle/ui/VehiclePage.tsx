import { Link } from '@inertiajs/react';

import AppLayout from '@/shared/layout/AppLayout';
import Button from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';

interface VehiclePageProps {
    vehicle: {
        id: number;
        source_reference: string;
        make: string | null;
        model: string | null;
        source: string | null;
        price: number;
        mileage: number;
        power: number;
        fuel_type: string;
        year: number;
    };
}

export default function Vehicle({ vehicle }: VehiclePageProps) {
    const title = `${vehicle.make ?? 'Марка'} ${vehicle.model ?? 'модель'}`;

    return (
        <AppLayout>
            <main className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-5 text-xs font-medium text-zinc-500">
                    <Link href="/catalog" className="hover:text-zinc-900">Каталог</Link>
                    <span className="mx-2">/</span>
                    <span>{title}</span>
                </div>

                <Card className="p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-950">{title}</h1>
                            <p className="mt-1 text-sm font-medium text-zinc-500">
                                #{vehicle.id} · {vehicle.source_reference}
                            </p>
                        </div>
                        <div className="text-3xl font-bold text-zinc-950">
                            ${vehicle.price.toLocaleString('ru-RU')}
                        </div>
                    </div>

                    <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Spec label="Год" value={String(vehicle.year)} />
                        <Spec label="Пробег" value={`${vehicle.mileage.toLocaleString('ru-RU')} км`} />
                        <Spec label="Мощность" value={`${vehicle.power} л.с.`} />
                        <Spec label="Топливо" value={fuelLabel(vehicle.fuel_type)} />
                        <Spec label="Источник" value={vehicle.source ?? 'не указан'} />
                    </dl>

                    <div className="mt-6 flex gap-2">
                        <Button href="/catalog" variant="outline">В каталог</Button>
                        <Button href="/account">В кабинет</Button>
                    </div>
                </Card>
            </main>
        </AppLayout>
    );
}

function Spec({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <dt className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-900">{value}</dd>
        </div>
    );
}

function fuelLabel(type: string): string {
    return {
        gasoline: 'Бензин',
        diesel: 'Дизель',
        hybrid: 'Гибрид',
        electric: 'Электро',
        lpg: 'Газ',
    }[type] ?? type;
}
