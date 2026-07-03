import { router, useForm, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import type { FormEvent, ReactElement } from 'react';
import Layout from './Layout';
import { filterFieldLabels, fuelTypeLabels, type FuelType, type PageProps, type Subscription } from '../types/app';

type Props = PageProps & {
    subscriptions: Subscription[];
    fuelTypes: FuelType[];
};

const emptyForm = {
    user_identifier: 'demo-user@example.com',
    make_id: '',
    model_id: '',
    make: '',
    model: '',
    min_price: '',
    max_price: '',
    min_mileage: '',
    max_mileage: '',
    min_power: '',
    max_power: '',
    fuel_type: '',
    year_from: '',
    year_to: '',
};

export default function Subscriptions() {
    const { subscriptions, fuelTypes, errors } = usePage<Props>().props;
    const form = useForm(emptyForm);

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/subscriptions', { preserveScroll: true });
    }

    return (
        <Layout>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <form onSubmit={submit} className="rounded-md border border-zinc-200 bg-white p-5">
                    <h1 className="text-xl font-semibold">Создать подписку на фильтр</h1>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Field label="Пользователь" error={errors.user_identifier}>
                            <input value={form.data.user_identifier} onChange={(e) => form.setData('user_identifier', e.target.value)} />
                        </Field>
                        <Field label="Тип топлива" error={errors.fuel_type}>
                            <select value={form.data.fuel_type} onChange={(e) => form.setData('fuel_type', e.target.value)}>
                                <option value="">Любой</option>
                                {fuelTypes.map((type) => <option key={type} value={type}>{fuelTypeLabels[type]}</option>)}
                            </select>
                        </Field>
                        <Field label="Марка" error={errors.make}>
                            <input value={form.data.make} onChange={(e) => form.setData('make', e.target.value)} placeholder="Toyota" />
                        </Field>
                        <Field label="Модель" error={errors.model}>
                            <input value={form.data.model} onChange={(e) => form.setData('model', e.target.value)} placeholder="Camry" />
                        </Field>
                        <Field label="ID марки" error={errors.make_id}>
                            <input type="number" value={form.data.make_id} onChange={(e) => form.setData('make_id', e.target.value)} placeholder="1" />
                        </Field>
                        <Field label="ID модели" error={errors.model_id}>
                            <input type="number" value={form.data.model_id} onChange={(e) => form.setData('model_id', e.target.value)} placeholder="10" />
                        </Field>
                        <Field label="Цена от" error={errors.min_price}>
                            <input type="number" value={form.data.min_price} onChange={(e) => form.setData('min_price', e.target.value)} />
                        </Field>
                        <Field label="Цена до" error={errors.max_price}>
                            <input type="number" value={form.data.max_price} onChange={(e) => form.setData('max_price', e.target.value)} />
                        </Field>
                        <Field label="Пробег от" error={errors.min_mileage}>
                            <input type="number" value={form.data.min_mileage} onChange={(e) => form.setData('min_mileage', e.target.value)} />
                        </Field>
                        <Field label="Пробег до" error={errors.max_mileage}>
                            <input type="number" value={form.data.max_mileage} onChange={(e) => form.setData('max_mileage', e.target.value)} />
                        </Field>
                        <Field label="Мощность от" error={errors.min_power}>
                            <input type="number" value={form.data.min_power} onChange={(e) => form.setData('min_power', e.target.value)} />
                        </Field>
                        <Field label="Мощность до" error={errors.max_power}>
                            <input type="number" value={form.data.max_power} onChange={(e) => form.setData('max_power', e.target.value)} />
                        </Field>
                        <Field label="Год от" error={errors.year_from}>
                            <input type="number" value={form.data.year_from} onChange={(e) => form.setData('year_from', e.target.value)} />
                        </Field>
                        <Field label="Год до" error={errors.year_to}>
                            <input type="number" value={form.data.year_to} onChange={(e) => form.setData('year_to', e.target.value)} />
                        </Field>
                    </div>
                    <button disabled={form.processing} className="mt-5 rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                        Подписаться
                    </button>
                </form>

                <section className="rounded-md border border-zinc-200 bg-white p-5">
                    <h2 className="text-xl font-semibold">Мои подписки</h2>
                    <div className="mt-4 space-y-3">
                        {subscriptions.map((subscription) => (
                            <article key={subscription.id} className="rounded-md border border-zinc-200 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-medium">{subscription.user_identifier}</div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {Object.entries(subscription.filter).map(([key, value]) => (
                                                <span key={key} className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-700">{filterFieldLabels[key] ?? key}: {formatFilterValue(key, value)}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button title="Удалить подписку" onClick={() => router.delete(`/subscriptions/${subscription.id}`)} className="rounded-md border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </article>
                        ))}
                        {subscriptions.length === 0 && <p className="text-sm text-zinc-500">Подписок пока нет.</p>}
                    </div>
                </section>
            </div>
        </Layout>
    );
}

function formatFilterValue(key: string, value: unknown): string {
    if (key === 'fuel_type' && typeof value === 'string' && value in fuelTypeLabels) {
        return fuelTypeLabels[value as FuelType];
    }

    return String(value);
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
