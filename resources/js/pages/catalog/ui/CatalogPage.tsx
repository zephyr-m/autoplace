import { Link } from '@inertiajs/react';
import { Bell, SlidersHorizontal, Trash2, AlertCircle, List as ListIcon, Grid, Table as TableIcon, RefreshCw } from 'lucide-react';
import { useState, useMemo } from 'react';

import { createFilterSubscription } from '@/entities/filter-subscription/api/filterSubscriptionRepository';
import { buildSubscriptionFilter } from '@/features/catalog-filter/model/buildSubscriptionFilter';
import { filterAndSortVehicles } from '@/features/catalog-filter/model/filterVehicles';
import type { CatalogSortOrder } from '@/features/catalog-filter/model/filterVehicles';
import { useCatalogFilters } from '@/features/catalog-filter/model/useCatalogFilters';
import CatalogFilters from '@/features/catalog-filter/ui/CatalogFilters';
import { useCatalogSearch } from '@/features/catalog-search/model/useCatalogSearch';
import VehicleCard from '@/entities/vehicle/ui/VehicleCard';
import VehicleTable from '@/entities/vehicle/ui/VehicleTable';
import AppLayout from '@/shared/layout/AppLayout';
import { CATALOG_PAGE_SIZE_OPTIONS, DEFAULT_CATALOG_PAGE_SIZE } from '@/shared/config/pagination';
import Button from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';

export default function Catalog() {
    const { vehicles, makes, models, isLoading, error, reload } = useCatalogSearch();
    const filters = useCatalogFilters();

    // View & Order
    const [viewMode, setViewMode] = useState<'list' | 'gallery' | 'table'>('list');
    const [sortOrder, setSortOrder] = useState<CatalogSortOrder>('newest');
    const [perPage, setPerPage] = useState(DEFAULT_CATALOG_PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);

    // Subscriptions & Notifications
    const [subscriptions, setSubscriptions] = useState<any[]>([
        {
            id: 1,
            filter: { makes: ['Toyota', 'BMW'], maxPrice: 40000 },
            description: 'Toyota, BMW · до $40 000'
        }
    ]);
    const [notifications, setNotifications] = useState<any[]>([
        {
            id: 1,
            title: 'Новый матч по вашей подписке',
            text: 'В каталоге появился Toyota Camry 2.5 ($26 000)',
            time: '15 минут назад'
        }
    ]);

    // Alert simulation triggers
    const [alertMsg, setAlertMsg] = useState<string | null>(null);

    const makeOptions = useMemo(() => makes.map(make => make.name), [makes]);
    const modelOptions = useMemo(() => models.map(model => model.name), [models]);

    const processedVehicles = useMemo(
        () => filterAndSortVehicles(vehicles, filters, sortOrder),
        [vehicles, filters, sortOrder],
    );

    // Add Subscription
    const handleSubscribe = async () => {
        const desc = [
            filters.selectedMakes.length > 0 ? filters.selectedMakes.join(', ') : 'Все марки',
            filters.selectedModels.length > 0 ? filters.selectedModels.join(', ') : 'Все модели',
            `до $${filters.maxPrice.toLocaleString('ru-RU')}`,
            `до ${filters.maxMileage.toLocaleString('ru-RU')} км`
        ].join(' · ');

        const newSub = {
            id: Date.now(),
            filter: { makes: filters.selectedMakes, models: filters.selectedModels, maxPrice: filters.maxPrice, maxMileage: filters.maxMileage },
            description: desc
        };

        setIsCreatingSubscription(true);

        try {
            const subscription = await createFilterSubscription({
                userIdentifier: 'demo-user@example.com',
                filter: buildSubscriptionFilter(filters, makes, models),
            });

            setSubscriptions([...subscriptions, { ...newSub, id: Number(subscription.id) }]);
            setAlertMsg(`Подписка #${subscription.id} создана`);
            setTimeout(() => setAlertMsg(null), 3000);
        } catch (caught) {
            setAlertMsg(caught instanceof Error ? caught.message : 'Не удалось создать подписку');
            setTimeout(() => setAlertMsg(null), 5000);
        } finally {
            setIsCreatingSubscription(false);
        }
    };

    const handleDeleteSubscription = (id: number) => {
        setSubscriptions(subscriptions.filter(s => s.id !== id));
    };

    const handleReloadCatalog = async () => {
        await reload();
        setAlertMsg('Каталог обновлён из GraphQL API');
        setTimeout(() => setAlertMsg(null), 3000);
    };

    return (
        <AppLayout
            navItems={[
                { label: 'Каталог', href: '/catalog', active: true },
                { label: 'Тарифы', href: '#' },
                { label: 'Для дилеров', href: '#' },
                { label: 'Кабинет', href: '/account' },
                { label: 'Мои подписки', href: '#subscriptions' },
                { label: 'Помощь', href: '#' },
            ]}
            actions={(
                <>
                    <Button href="/account" variant="outline" size="sm" className="h-9 px-4">
                        Войти
                    </Button>
                    <Button onClick={handleReloadCatalog} variant="default" size="sm" className="h-9 px-4">
                        <RefreshCw size={15} />
                        Обновить
                    </Button>
                </>
            )}
        >
            {/* Alert Notifications */}
            {alertMsg && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md bg-zinc-900 border border-zinc-800 p-4 text-white shadow-lg transition-all animate-bounce">
                    <AlertCircle className="text-green-400 size-5" />
                    <span className="text-sm font-medium">{alertMsg}</span>
                </div>
            )}

            {/* Hero Header */}
            <section className="bg-gradient-to-b from-white to-zinc-50 border-b border-zinc-200 py-8">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mb-3">
                        <Link href="/" className="hover:text-zinc-900 flex items-center gap-1">Главная</Link>
                        <span>/</span>
                        <span className="text-zinc-800">Каталог</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">Каталог автомобилей</h1>
                            <p className="mt-2.5 max-w-2xl text-base text-zinc-500 font-medium">
                                Подберите автомобиль по бюджету, пробегу, году выпуска и типу продавца. Карточки показывают главное сразу, без перегруженных деталей.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700 border border-zinc-200">
                                {vehicles.length} объявлений
                            </span>
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 font-semibold text-zinc-700 border border-zinc-200">
                                326 от дилеров
                            </span>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 font-semibold text-green-700 border border-green-200">
                                82% с историей
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workspace search listings */}
            <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

                <CatalogFilters
                    filters={filters}
                    makeOptions={makeOptions}
                    modelOptions={modelOptions}
                    resultCount={processedVehicles.length}
                    isCreatingSubscription={isCreatingSubscription}
                    onSubscribe={handleSubscribe}
                />

                {/* Results Container */}
                <section className="space-y-6">
                    {error && (
                        <Card className="border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                            {error}
                        </Card>
                    )}

                    {/* Output header bar */}
                    <div className="bg-white border border-zinc-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm select-none">
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-zinc-900">
                                {isLoading ? 'Загрузка каталога...' : `${processedVehicles.length} автомобилей`}
                            </span>
                            <span className="text-xs text-zinc-500 truncate mt-0.5 font-medium">
                                {[
                                    filters.selectedMakes.length > 0 ? filters.selectedMakes.join(', ') : 'Все марки',
                                    filters.selectedModels.length > 0 ? filters.selectedModels.join(', ') : 'Все модели',
                                    `до $${filters.maxPrice.toLocaleString('ru-RU')}`,
                                    `до ${filters.maxMileage.toLocaleString('ru-RU')} км`
                                ].join(' · ')}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                            {/* Toggles */}
                            <div className="inline-flex rounded-md border border-zinc-200 p-0.5 bg-zinc-50 gap-0.5">
                                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white shadow text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}>
                                    <ListIcon size={16} />
                                </button>
                                <button onClick={() => setViewMode('gallery')} className={`p-1.5 rounded-sm transition-all ${viewMode === 'gallery' ? 'bg-white shadow text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}>
                                    <Grid size={16} />
                                </button>
                                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-sm transition-all ${viewMode === 'table' ? 'bg-white shadow text-zinc-950' : 'text-zinc-400 hover:text-zinc-800'}`}>
                                    <TableIcon size={16} />
                                </button>
                            </div>

                            {/* Sorter */}
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as CatalogSortOrder)} className="h-9 border border-zinc-200 bg-white rounded-md text-xs font-semibold px-2 py-1 text-zinc-800 focus:outline-none w-40">
                                <option value="newest">Сначала новые</option>
                                <option value="cheapest">Сначала дешевле</option>
                                <option value="expensive">Сначала дороже</option>
                                <option value="mileage">Меньше пробег</option>
                            </select>
                        </div>
                    </div>

                    {/* Cards Views */}
                    {viewMode !== 'table' && (
                        <div className={viewMode === 'gallery' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
                            {!isLoading && processedVehicles.map(vehicle => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
                            ))}
                            {isLoading && (
                                <Card className="p-10 text-center text-zinc-400 font-medium">
                                    Загружаем автомобили ...
                                </Card>
                            )}
                            {!isLoading && processedVehicles.length === 0 && (
                                <Card className="p-10 text-center text-zinc-400 font-medium">
                                    Автомобили не найдены. Попробуйте сбросить фильтры.
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Table View */}
                    {viewMode === 'table' && !isLoading && (
                        <VehicleTable vehicles={processedVehicles} />
                    )}

                    {/* Bottom Pagination */}
                    {processedVehicles.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-zinc-200">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                Показывать
                                <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="border border-zinc-200 rounded p-1 bg-white font-semibold text-zinc-805">
                                    {CATALOG_PAGE_SIZE_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                на странице
                            </label>

                            <nav className="flex items-center gap-1 select-none">
                                {[1, 2, 3].map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`size-9 border text-xs font-bold rounded flex items-center justify-center ${page === currentPage
                                            ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                                            : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}

                </section>
            </div>
        </AppLayout>
    );
}
