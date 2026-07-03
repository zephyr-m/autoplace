import { useForm, usePage } from '@inertiajs/react';
import type { FormEvent, ReactElement } from 'react';
import Layout from './Layout';
import { fuelTypeLabels, type FuelType, type PageProps, type Vehicle } from '../types/app';

type Props = PageProps & {
    vehicles: {
        data: Vehicle[];
    };
    fuelTypes: FuelType[];
};

export default function AdminVehicles() {
    const { vehicles, fuelTypes, errors } = usePage<Props>().props;
    const form = useForm({
        source_reference: `demo-${Date.now()}`,
        make_id: '1',
        model_id: '10',
        make: 'Toyota',
        model: 'Camry',
        price: '26000',
        mileage: '42000',
        power: '203',
        fuel_type: 'gasoline',
        year: '2021',
    });

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/admin/vehicles', { preserveScroll: true });
    }

    return (
        <Layout>
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <form onSubmit={submit} className="rounded-md border border-zinc-200 bg-white p-5">
                    <h1 className="text-xl font-semibold">Новое событие каталога</h1>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Field label="Внешний ID" error={errors.source_reference}>
                            <input value={form.data.source_reference} onChange={(e) => form.setData('source_reference', e.target.value)} />
                        </Field>
                        <Field label="Тип топлива" error={errors.fuel_type}>
                            <select value={form.data.fuel_type} onChange={(e) => form.setData('fuel_type', e.target.value)}>
                                {fuelTypes.map((type) => <option key={type} value={type}>{fuelTypeLabels[type]}</option>)}
                            </select>
                        </Field>
                        <Field label="Марка" error={errors.make}>
                            <input value={form.data.make} onChange={(e) => form.setData('make', e.target.value)} />
                        </Field>
                        <Field label="Модель" error={errors.model}>
                            <input value={form.data.model} onChange={(e) => form.setData('model', e.target.value)} />
                        </Field>
                        <Field label="ID марки" error={errors.make_id}>
                            <input type="number" value={form.data.make_id} onChange={(e) => form.setData('make_id', e.target.value)} />
                        </Field>
                        <Field label="ID модели" error={errors.model_id}>
                            <input type="number" value={form.data.model_id} onChange={(e) => form.setData('model_id', e.target.value)} />
                        </Field>
                        <Field label="Цена" error={errors.price}>
                            <input type="number" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)} />
                        </Field>
                        <Field label="Пробег" error={errors.mileage}>
                            <input type="number" value={form.data.mileage} onChange={(e) => form.setData('mileage', e.target.value)} />
                        </Field>
                        <Field label="Мощность" error={errors.power}>
                            <input type="number" value={form.data.power} onChange={(e) => form.setData('power', e.target.value)} />
                        </Field>
                        <Field label="Год" error={errors.year}>
                            <input type="number" value={form.data.year} onChange={(e) => form.setData('year', e.target.value)} />
                        </Field>
                    </div>
                    <button disabled={form.processing} className="mt-5 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                        Добавить событие
                    </button>
                </form>

                <section className="rounded-md border border-zinc-200 bg-white p-5">
                    <h2 className="text-xl font-semibold">Автомобили в каталоге</h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-zinc-200 text-zinc-500">
                                <tr>
                                    <th className="py-2 pr-3">Автомобиль</th>
                                    <th className="py-2 pr-3">Год</th>
                                    <th className="py-2 pr-3">Топливо</th>
                                    <th className="py-2 pr-3">Цена</th>
                                    <th className="py-2 pr-3">Пробег</th>
                                    <th className="py-2 pr-3">Мощность</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.data.map((vehicle) => (
                                    <tr key={vehicle.id} className="border-b border-zinc-100">
                                        <td className="py-3 pr-3 font-medium">{vehicle.make} {vehicle.model} <span className="text-xs text-zinc-500">#{vehicle.make_id}/{vehicle.model_id}</span></td>
                                        <td className="py-3 pr-3">{vehicle.year}</td>
                                        <td className="py-3 pr-3">{fuelTypeLabels[vehicle.fuel_type]}</td>
                                        <td className="py-3 pr-3">${vehicle.price.toLocaleString()}</td>
                                        <td className="py-3 pr-3">{vehicle.mileage.toLocaleString()}</td>
                                        <td className="py-3 pr-3">{vehicle.power} л.с.</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactElement }) {
    return (
        <label className="grid gap-1 text-sm font-medium text-zinc-700">
            <span>{label}</span>
            {children}
            {error && <span className="text-xs text-red-600">{error}</span>}
        </label>
    );
}
