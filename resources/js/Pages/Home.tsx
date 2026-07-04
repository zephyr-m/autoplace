import { Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Bell, CarFront, Gauge, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';

const vehicles = [
    {
        title: 'Toyota Camry',
        price: '$26 000',
        image: 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&w=900&q=80',
        meta: ['2021', '42 000 км', 'Бензин', '203 л.с.'],
        seller: 'Дилер · Алматы',
    },
    {
        title: 'Tesla Model 3',
        price: '$39 000',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=80',
        meta: ['2022', '18 000 км', 'Электро', '283 л.с.'],
        seller: 'Частный продавец · Астана',
    },
    {
        title: 'BMW 320d',
        price: '$31 000',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
        meta: ['2020', '55 000 км', 'Дизель', '190 л.с.'],
        seller: 'Дилер · Алматы',
    },
];

const stats = [
    { value: '1 248', label: 'активных объявлений' },
    { value: '82%', label: 'с проверенной историей' },
    { value: '24 ч', label: 'среднее время ответа' },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-3 font-semibold">
                        <span className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white">
                            <CarFront size={21} />
                        </span>
                        <span className="text-lg">AutoPlace</span>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm text-zinc-500 md:flex">
                        <a href="#catalog" className="hover:text-zinc-950">Каталог</a>
                        <a href="#alerts" className="hover:text-zinc-950">Уведомления</a>
                        <a href="#sell" className="text-amber-700 hover:text-amber-800">Продать авто</a>
                        <a href="#dealers" className="text-amber-700 hover:text-amber-800">Дилеры</a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button href="#catalog" variant="outline">Войти</Button>
                        <Button href="#sell" className="hidden sm:inline-flex">Разместить авто</Button>
                    </div>
                </div>
            </header>

            <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
                <div>
                    <Badge>
                        <BadgeCheck size={14} />
                        Маркетплейс проверенных автомобилей
                    </Badge>
                    <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-normal text-zinc-950 sm:text-6xl">
                        Найдите автомобиль без лишнего шума
                    </h1>
                    <p className="mt-5 max-w-xl text-lg text-zinc-600">
                        AutoPlace собирает объявления от частных продавцов и дилеров в одном спокойном каталоге с понятными фильтрами, ценами и историей автомобиля.
                    </p>

                    <Card className="mt-8 shadow-xl shadow-zinc-950/5">
                        <div className="flex gap-1 border-b border-zinc-200 p-2">
                            <Tab active>Купить</Tab>
                            <Tab>Новые</Tab>
                            <Tab>С пробегом</Tab>
                        </div>
                        <form className="grid gap-3 p-4 sm:grid-cols-2">
                            <Field label="Марка">
                                <select>
                                    <option>Любая марка</option>
                                    <option>Toyota</option>
                                    <option>BMW</option>
                                    <option>Tesla</option>
                                    <option>Hyundai</option>
                                </select>
                            </Field>
                            <Field label="Модель">
                                <select>
                                    <option>Любая модель</option>
                                    <option>Camry</option>
                                    <option>RAV4</option>
                                    <option>Model 3</option>
                                    <option>320d</option>
                                </select>
                            </Field>
                            <Field label="Бюджет до">
                                <select>
                                    <option>До $30 000</option>
                                    <option>До $50 000</option>
                                    <option>До $80 000</option>
                                </select>
                            </Field>
                            <Field label="Город">
                                <select>
                                    <option>Алматы</option>
                                    <option>Астана</option>
                                    <option>Шымкент</option>
                                </select>
                            </Field>
                            <Button href="#catalog" className="mt-1 w-full sm:col-span-2">
                                <Search size={16} />
                                Показать 1 248 автомобилей
                            </Button>
                        </form>
                    </Card>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {stats.map((stat) => (
                            <Card key={stat.label} className="p-4">
                                <div className="text-lg font-semibold">{stat.value}</div>
                                <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="grid content-start gap-4">
                    <Card className="overflow-hidden">
                        <img
                            className="aspect-video w-full object-cover"
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                            alt="Серый спортивный автомобиль на дороге"
                        />
                        <div className="flex items-center justify-between gap-4 p-4">
                            <div>
                                <h2 className="text-lg font-semibold">Porsche 911 Carrera</h2>
                                <p className="text-sm text-zinc-500">2021 · 18 000 км · бензин</p>
                            </div>
                            <div className="font-semibold">$118 900</div>
                        </div>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <MiniVehicle
                            image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
                            title="Chevrolet Camaro"
                            meta="2019 · $42 500"
                        />
                        <MiniVehicle
                            image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
                            title="Mercedes-Benz C-Class"
                            meta="2020 · $36 200"
                        />
                    </div>
                </div>
            </section>

            <section id="catalog" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-normal">Свежие предложения</h2>
                        <p className="mt-2 max-w-xl text-zinc-600">Каталог строится вокруг быстрых решений: цена, год, пробег и продавец видны сразу.</p>
                    </div>
                    <Button href="#catalog" variant="outline">
                        Открыть весь каталог
                        <ArrowRight size={16} />
                    </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.title} className="overflow-hidden">
                            <img className="aspect-[4/3] w-full object-cover" src={vehicle.image} alt={vehicle.title} />
                            <div className="p-4">
                                <div className="flex justify-between gap-3 font-semibold">
                                    <span>{vehicle.title}</span>
                                    <span>{vehicle.price}</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {vehicle.meta.map((item) => (
                                        <span key={item} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">{item}</span>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4">
                                    <span className="text-sm text-zinc-500">{vehicle.seller}</span>
                                    <Button href="#details" variant="outline" size="sm">Подробнее</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            <section id="alerts" className="border-y border-zinc-200 bg-zinc-50">
                <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3">
                    <Feature icon={<SlidersHorizontal size={18} />} title="Фильтры без перегруза" text="Подбор по цене, году, пробегу, мощности и типу топлива." />
                    <Feature icon={<ShieldCheck size={18} />} title="Проверка истории" text="Важные параметры автомобиля видны до перехода в сделку." />
                    <Feature icon={<Bell size={18} />} title="Уведомления" text="Подписки помогают не пропустить подходящий автомобиль." />
                </div>
            </section>

            <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 py-6 text-sm text-zinc-500 sm:flex-row sm:px-6">
                <span>AutoPlace, 2026</span>
                <span>Каталог · Проверка · Сделка</span>
            </footer>
        </main>
    );
}

function Button({ href, variant = 'default', size = 'default', className = '', children }: { href: string; variant?: 'default' | 'outline'; size?: 'default' | 'sm'; className?: string; children: ReactNode }) {
    const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50';
    const variants = {
        default: 'bg-zinc-950 text-white hover:bg-zinc-800',
        outline: 'border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-100',
    };
    const sizes = {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
    };

    if (href.startsWith('/')) {
        return <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</Link>;
    }

    return <a href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</a>;
}

function Card({ className = '', children }: { className?: string; children: ReactNode }) {
    return <div className={`rounded-md border border-zinc-200 bg-white ${className}`}>{children}</div>;
}

function Badge({ children }: { children: ReactNode }) {
    return <div className="inline-flex h-7 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-500">{children}</div>;
}

function Tab({ active = false, children }: { active?: boolean; children: ReactNode }) {
    return <button type="button" className={`rounded-md px-3 py-2 text-sm font-medium ${active ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-zinc-950'}`}>{children}</button>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
            <span>{label}</span>
            {children}
        </label>
    );
}

function MiniVehicle({ image, title, meta }: { image: string; title: string; meta: string }) {
    return (
        <Card className="overflow-hidden">
            <img className="aspect-[4/3] w-full object-cover" src={image} alt={title} />
            <div className="p-3">
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-1 text-sm text-zinc-500">{meta}</div>
            </div>
        </Card>
    );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
    return (
        <div className="flex gap-3">
            <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700">
                {icon}
            </div>
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{text}</p>
            </div>
        </div>
    );
}
