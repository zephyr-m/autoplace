import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import Button from '@/shared/ui/Button';

export interface HeaderNavItem {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
    tone?: 'default' | 'accent';
}

export interface AppHeaderProps {
    navItems?: HeaderNavItem[];
    actions?: ReactNode;
}

export default function AppHeader({ navItems = [], actions }: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-3 font-semibold">
                    <img src="/assets/autoplace-logo.png" alt="AutoPlace" className="h-10 w-auto max-w-[150px] object-contain" />
                </Link>

                {navItems.length > 0 && (
                    <nav className="hidden items-center gap-6 text-sm text-zinc-500 md:flex">
                        {navItems.map((item) => {
                            const className = [
                                item.active ? 'text-zinc-950' : 'hover:text-zinc-950',
                                item.tone === 'accent' ? 'text-amber-700 hover:text-amber-800' : '',
                            ].join(' ');

                            if (item.href) {
                                return (
                                    <Link key={item.label} href={item.href} className={className}>
                                        {item.label}
                                    </Link>
                                );
                            }

                            return (
                                <button key={item.label} type="button" onClick={item.onClick} className={className}>
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                )}

                <div className="flex items-center gap-2">
                    {actions ?? (
                        <>
                            <Button href="/account" variant="outline">Войти</Button>
                            <Button href="#sell" className="hidden sm:inline-flex">Разместить авто</Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
