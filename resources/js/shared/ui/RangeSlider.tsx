import type { CSSProperties, ChangeEvent } from 'react';

interface RangeSliderProps {
    min: number;
    max: number;
    step: number;
    minValue: number;
    maxValue: number;
    formatType?: 'currency' | 'mileage' | 'plain';
    onChangeMin: (val: number) => void;
    onChangeMax: (val: number) => void;
}

export default function RangeSlider({
    min,
    max,
    step,
    minValue,
    maxValue,
    formatType = 'plain',
    onChangeMin,
    onChangeMax,
}: RangeSliderProps) {
    const fromPercent = ((minValue - min) / (max - min)) * 100;
    const toPercent = 100 - ((maxValue - min) / (max - min)) * 100;

    const formatValue = (val: number) => {
        if (formatType === 'currency') {
            return `$${val.toLocaleString('ru-RU')}`;
        }
        if (formatType === 'mileage') {
            return `${val.toLocaleString('ru-RU')} км`;
        }
        return val.toLocaleString('ru-RU');
    };

    const handleTextChangeMin = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/[^\d-]/g, ''));
        if (!isNaN(val)) {
            onChangeMin(Math.min(Math.max(val, min), maxValue));
        }
    };

    const handleTextChangeMax = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/[^\d-]/g, ''));
        if (!isNaN(val)) {
            onChangeMax(Math.max(Math.min(val, max), minValue));
        }
    };

    return (
        <div className="space-y-1.5 focus-within:z-10 relative">
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="text"
                    value={formatValue(minValue)}
                    onChange={handleTextChangeMin}
                    className="w-full text-sm font-semibold border border-zinc-200 rounded px-2.5 py-1.5 text-center focus:border-zinc-950 outline-none"
                    placeholder="от"
                />
                <input
                    type="text"
                    value={formatValue(maxValue)}
                    onChange={handleTextChangeMax}
                    className="w-full text-sm font-semibold border border-zinc-200 rounded px-2.5 py-1.5 text-center focus:border-zinc-950 outline-none"
                    placeholder="до"
                />
            </div>

            <div className="range-slider double-range-slider select-none">
                <div className="slider-track" />
                <div
                    className="slider-fill"
                    style={{
                        '--from': `${fromPercent}%`,
                        '--to': `${toPercent}%`,
                    } as CSSProperties}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minValue}
                    onChange={(e) => onChangeMin(Math.min(Number(e.target.value), maxValue))}
                    className="absolute left-0 top-0.5 w-full h-6 appearance-none bg-transparent pointer-events-none focus:outline-none"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxValue}
                    onChange={(e) => onChangeMax(Math.max(Number(e.target.value), minValue))}
                    className="absolute left-0 top-0.5 w-full h-6 appearance-none bg-transparent pointer-events-none focus:outline-none"
                />
            </div>
        </div>
    );
}
