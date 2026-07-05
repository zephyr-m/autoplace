import type { ReactNode } from 'react';

interface BadgeProps {
    className?: string;
    children: ReactNode;
}

export default function Badge({ className = '', children }: BadgeProps) {
    return (
        <div className={`inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-xs text-zinc-500 font-semibold ${className}`}>
            {children}
        </div>
    );
}
