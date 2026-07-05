import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface ButtonProps {
    href?: string;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit';
    children: ReactNode;
}

export default function Button({
    href,
    variant = 'default',
    size = 'default',
    className = '',
    onClick,
    disabled = false,
    type = 'button',
    children,
}: ButtonProps) {
    const base = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 select-none';
    const variants = {
        default: 'bg-zinc-950 text-white hover:bg-zinc-800',
        outline: 'border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-100',
    };
    const sizes = {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
    };

    const combinedClasses = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    if (href) {
        if (href.startsWith('/')) {
            return <Link href={href} className={combinedClasses} onClick={disabled ? undefined : onClick}>{children}</Link>;
        }
        return <a href={href} className={combinedClasses} onClick={disabled ? undefined : onClick}>{children}</a>;
    }

    return (
        <button type={type} className={combinedClasses} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
