import { Link } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

import AppHeader from './AppHeader';
import type { HeaderNavItem } from './AppHeader';
import Button from '@/shared/ui/Button';

interface AppLayoutProps {
    navItems?: HeaderNavItem[];
    actions?: ReactNode;
    children: ReactNode;
}

const defaultNavItems: HeaderNavItem[] = [
    { label: 'Каталог', href: '/catalog' },
    { label: 'Тарифы', href: '#' },
    { label: 'Для дилеров', href: '#' },
    { label: 'Кабинет', href: '/account' },
    { label: 'Мои подписки', href: '/account' },
    { label: 'Помощь', href: '#' },
];

const defaultActions = (
    <>
        <Button href="/account" variant="outline" size="sm" className="h-9 px-4">
            Войти
        </Button>
        <Button href="/catalog" variant="default" size="sm" className="h-9 px-4">
            <RefreshCw size={15} />
            Обновить
        </Button>
    </>
);

export default function AppLayout({ navItems, actions, children }: AppLayoutProps) {
    return (
        <main className="min-h-screen bg-zinc-50 font-sans leading-normal text-zinc-950">
            <AppHeader navItems={navItems ?? defaultNavItems} actions={actions ?? defaultActions} />

            {children}

            <footer className="mt-12 border-t border-zinc-200 bg-white py-6">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs font-semibold text-zinc-500 sm:flex-row sm:px-6">
                    <span>AutoPlace, 2026</span>
                    <span className="flex gap-4">
                        <Link href="/catalog" className="hover:underline">Каталог</Link>
                        <span>·</span>
                        <a href="#" className="hover:underline">Проверка</a>
                        <span>·</span>
                        <a href="#" className="hover:underline">Сделка</a>
                    </span>
                </div>
            </footer>
        </main>
    );
}
