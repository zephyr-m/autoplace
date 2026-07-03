import { Link, usePage } from '@inertiajs/react';
import { Bell, Car, ListFilter } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import type { PageProps } from '../types/app';

const nav = [
    { href: '/subscriptions', label: 'Подписки', icon: ListFilter },
    { href: '/notifications', label: 'Уведомления', icon: Bell },
    { href: '/admin/vehicles', label: 'Каталог', icon: Car },
];

export default function Layout({ children }: PropsWithChildren) {
    const { flash } = usePage<PageProps>().props;

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-950">
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    <div>
                        <div className="text-lg font-semibold">Автоподбор</div>
                        <div className="text-sm text-zinc-500">Подписки пользователей и события внутреннего каталога</div>
                    </div>
                    <nav className="flex gap-2">
                        {nav.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
                                    <Icon size={16} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-5 py-6">
                {flash?.success && (
                    <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}
                {children}
            </section>
        </main>
    );
}
