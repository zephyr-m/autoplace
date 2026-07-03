export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'lpg';

export const fuelTypeLabels: Record<FuelType, string> = {
    gasoline: 'Бензин',
    diesel: 'Дизель',
    hybrid: 'Гибрид',
    electric: 'Электро',
    lpg: 'Газ',
};

export const filterFieldLabels: Record<string, string> = {
    make: 'Марка',
    model: 'Модель',
    make_id: 'ID марки',
    model_id: 'ID модели',
    min_price: 'Цена от',
    max_price: 'Цена до',
    min_mileage: 'Пробег от',
    max_mileage: 'Пробег до',
    min_power: 'Мощность от',
    max_power: 'Мощность до',
    fuel_type: 'Топливо',
    year_from: 'Год от',
    year_to: 'Год до',
};

export type Vehicle = {
    id: number;
    source_reference?: string | null;
    make_id: number;
    model_id: number;
    make: string;
    model: string;
    price: number;
    mileage: number;
    power: number;
    fuel_type: FuelType;
    year: number;
};

export type Filter = {
    make?: string;
    model?: string;
    make_id?: number;
    model_id?: number;
    min_price?: number;
    max_price?: number;
    min_mileage?: number;
    max_mileage?: number;
    min_power?: number;
    max_power?: number;
    fuel_type?: FuelType;
    year_from?: number;
    year_to?: number;
};

export type Subscription = {
    id: number;
    user_identifier: string;
    filter: Filter;
    status: 'active' | 'paused';
    created_at: string;
};

export type PageProps = {
    errors: Record<string, string>;
    flash: {
        success?: string;
    };
};
