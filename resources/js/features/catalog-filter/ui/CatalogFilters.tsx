import { PlusCircle, SlidersHorizontal } from 'lucide-react';

import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import MultiSelectDropdown from '@/shared/ui/MultiSelectDropdown';
import RangeSlider from '@/shared/ui/RangeSlider';

import type { CatalogFiltersModel } from '../model/types';

interface CatalogFiltersProps {
    filters: CatalogFiltersModel;
    makeOptions: string[];
    modelOptions: string[];
    resultCount: number;
    isCreatingSubscription?: boolean;
    onSubscribe: () => void;
}

export default function CatalogFilters({
    filters,
    makeOptions,
    modelOptions,
    resultCount,
    isCreatingSubscription = false,
    onSubscribe,
}: CatalogFiltersProps) {
    return (
        <aside className="sticky top-20 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-2">
                <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
                    <SlidersHorizontal size={16} /> Фильтры
                </h2>
                <button
                    type="button"
                    onClick={filters.resetFilters}
                    className="rounded bg-zinc-50 px-2 py-1.5 text-xs font-semibold text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900"
                >
                    Сбросить
                </button>
            </div>

            <div className="space-y-4">
                <MultiSelectDropdown
                    label="Марка"
                    placeholder="Любая марка"
                    options={makeOptions}
                    selected={filters.selectedMakes}
                    onSelectedChange={filters.setSelectedMakes}
                />
                <MultiSelectDropdown
                    label="Модель"
                    placeholder="Любая модель"
                    options={modelOptions}
                    selected={filters.selectedModels}
                    onSelectedChange={filters.setSelectedModels}
                />

                <div className="border-t border-zinc-100 pt-3">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Цена</span>
                    <RangeSlider
                        min={0}
                        max={150000}
                        step={500}
                        minValue={filters.minPrice}
                        maxValue={filters.maxPrice}
                        formatType="currency"
                        onChangeMin={filters.setMinPrice}
                        onChangeMax={filters.setMaxPrice}
                    />
                </div>

                <div className="border-t border-zinc-100 pt-3">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Год выпуска</span>
                    <RangeSlider
                        min={1990}
                        max={2026}
                        step={1}
                        minValue={filters.minYear}
                        maxValue={filters.maxYear}
                        formatType="plain"
                        onChangeMin={filters.setMinYear}
                        onChangeMax={filters.setMaxYear}
                    />
                </div>

                <div className="border-t border-zinc-100 pt-3">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Пробег</span>
                    <RangeSlider
                        min={0}
                        max={250000}
                        step={1000}
                        minValue={filters.minMileage}
                        maxValue={filters.maxMileage}
                        formatType="mileage"
                        onChangeMin={filters.setMinMileage}
                        onChangeMax={filters.setMaxMileage}
                    />
                </div>

                <div className="space-y-2 border-t border-zinc-100 pt-3">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Топливо</span>
                    <Checkbox id="fuel-gas" checked={filters.fuels.includes('gasoline')} onChange={() => filters.toggleFuel('gasoline')} icon="G" label="Бензин" />
                    <Checkbox id="fuel-dsl" checked={filters.fuels.includes('diesel')} onChange={() => filters.toggleFuel('diesel')} icon="D" label="Дизель" />
                    <Checkbox id="fuel-hyb" checked={filters.fuels.includes('hybrid')} onChange={() => filters.toggleFuel('hybrid')} icon="H" label="Гибрид" />
                    <Checkbox id="fuel-elc" checked={filters.fuels.includes('electric')} onChange={() => filters.toggleFuel('electric')} icon="E" label="Электро" />
                </div>

                <div className="flex flex-col gap-2 border-t border-zinc-100 pt-4">
                    <Button className="w-full text-center font-bold">
                        Показать {resultCount} авто
                    </Button>
                    <Button onClick={onSubscribe} variant="outline" disabled={isCreatingSubscription} className="flex w-full items-center justify-center gap-1.5 text-center font-bold focus:ring-0">
                        <PlusCircle size={15} />
                        {isCreatingSubscription ? 'Создаём...' : 'Создать подписку'}
                    </Button>
                </div>
            </div>
        </aside>
    );
}
