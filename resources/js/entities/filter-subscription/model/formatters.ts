import type { FilterSubscription } from './types';

export const FILTER_SUBSCRIPTION_STATUS = {
    active: 1,
    paused: 2,
} as const;

export function formatFilterSubscriptionTitle(subscription: FilterSubscription): string {
    const filter = subscription.filter;
    const parts = [
        formatArrayPart(filter.make_ids, 'марки'),
        formatArrayPart(filter.model_ids, 'модели'),
        formatArrayPart(filter.fuel_types, 'топливо'),
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(' · ') : 'Все автомобили';
}

export function formatFilterSubscriptionCriteria(subscription: FilterSubscription): string {
    const filter = subscription.filter;
    const parts = [
        formatRange('цена', filter.min_price, filter.max_price, '$'),
        formatRange('пробег', filter.min_mileage, filter.max_mileage, 'км'),
        formatRange('год', filter.year_from, filter.year_to),
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(' · ') : 'Без дополнительных ограничений';
}

function formatArrayPart(value: unknown, label: string): string | null {
    if (!Array.isArray(value) || value.length === 0) {
        return null;
    }

    return `${label}: ${value.join(', ')}`;
}

function formatRange(label: string, min: unknown, max: unknown, suffix = ''): string | null {
    const formattedMin = formatScalar(min, suffix);
    const formattedMax = formatScalar(max, suffix);

    if (formattedMin && formattedMax) {
        return `${label}: ${formattedMin} - ${formattedMax}`;
    }

    if (formattedMin) {
        return `${label}: от ${formattedMin}`;
    }

    if (formattedMax) {
        return `${label}: до ${formattedMax}`;
    }

    return null;
}

function formatScalar(value: unknown, suffix: string): string | null {
    if (typeof value !== 'number' && typeof value !== 'string') {
        return null;
    }

    const numeric = Number(value);
    const formatted = Number.isFinite(numeric) ? numeric.toLocaleString('ru-RU') : String(value);

    return suffix ? `${formatted} ${suffix}` : formatted;
}
