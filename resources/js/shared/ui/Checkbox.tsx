import { Check } from 'lucide-react';

interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: () => void;
    icon: string;
    label: string;
}

export default function Checkbox({ id, checked, onChange, icon, label }: CheckboxProps) {
    return (
        <button
            id={id}
            type="button"
            onClick={onChange}
            className={`flex items-center gap-3 w-full border rounded-md p-2 hover:bg-zinc-50 transition-colors text-sm font-semibold select-none ${checked ? 'border-zinc-950 bg-white ring-1 ring-zinc-950' : 'border-zinc-200 bg-white'
                }`}
        >
            <span className="flex size-6 items-center justify-center rounded bg-zinc-100 border border-zinc-200 text-xs font-bold font-mono">
                {icon}
            </span>
            <span className="flex-1 text-left">{label}</span>
            {checked && <Check size={16} className="text-zinc-950" />}
        </button>
    );
}
