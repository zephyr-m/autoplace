import type { ReactNode } from 'react';

interface CardProps {
    className?: string;
    onClick?: () => void;
    children: ReactNode;
}

export default function Card({ className = '', onClick, children }: CardProps) {
    return (
        <div onClick={onClick} className={`rounded-md border border-zinc-200 bg-white ${className}`}>
            {children}
        </div>
    );
}
