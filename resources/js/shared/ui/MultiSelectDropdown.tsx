import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectDropdownProps {
    label: string;
    placeholder: string;
    options: string[];
    selected: string[];
    onSelectedChange: (selected: string[]) => void;
}

export default function MultiSelectDropdown({
    label,
    placeholder,
    options,
    selected,
    onSelectedChange,
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options matching search query
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const isChecked = selected.includes(option);
        if (isChecked) {
            onSelectedChange(selected.filter(item => item !== option));
        } else {
            onSelectedChange([...selected, option]);
        }
    };

    const removeTag = (option: string) => {
        onSelectedChange(selected.filter(item => item !== option));
    };

    return (
        <div ref={dropdownRef} className="relative">
            <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">{label}</span>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-10 border border-zinc-200 rounded-md bg-white px-3 flex items-center justify-between text-sm text-zinc-900 hover:bg-zinc-50 transition-all font-medium select-none"
            >
                <span className="truncate">
                    {selected.length > 0 ? `Выбрано: ${selected.length}` : placeholder}
                </span>
                <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-1 z-30 bg-white border border-zinc-200 rounded-md shadow-lg p-2 max-h-60 overflow-hidden flex flex-col">
                    <input
                        type="search"
                        placeholder="Найти..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 text-xs border border-zinc-200 px-2.5 rounded bg-zinc-50 focus:bg-white outline-none mb-2"
                    />
                    <div className="overflow-y-auto space-y-0.5 flex-1 pr-1">
                        {filteredOptions.map(option => {
                            const isChecked = selected.includes(option);
                            return (
                                <label key={option} className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-100 rounded text-sm text-zinc-700 cursor-pointer font-medium select-none">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleOption(option)}
                                        className="rounded border-zinc-300 size-4 text-zinc-900 focus:ring-zinc-900"
                                    />
                                    {option}
                                </label>
                            );
                        })}
                        {filteredOptions.length === 0 && (
                            <div className="text-xs text-zinc-400 text-center py-4">Ничего не найдено</div>
                        )}
                    </div>
                </div>
            )}

            {/* Selected Option Tags */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {selected.map(item => (
                        <span key={item} className="inline-flex items-center gap-1 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                            {item}
                            <button type="button" onClick={() => removeTag(item)} className="hover:text-zinc-950 font-bold text-zinc-400 hover:text-zinc-700">
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
