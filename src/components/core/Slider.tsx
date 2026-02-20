import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange: (value: number) => void;
    formatLabel?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
    (
        { className, min = 0, max = 100, step = 1, value, onValueChange, formatLabel, ...props },
        ref
    ) => {
        // Calculate percentage for background fill
        const percentage = ((value - min) / (max - min)) * 100;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onValueChange(Number(e.target.value));
        };

        return (
            <div className={cn('w-full relative py-4', className)}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    ref={ref}
                    className="w-full absolute z-20 opacity-0 cursor-pointer h-full top-0 left-0"
                    {...props}
                />

                {/* Track Background */}
                <div className="w-full h-2 bg-slate-200 rounded-full relative z-10 overflow-hidden">
                    {/* Progress Fill */}
                    <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-75 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Thumb (Visual Only) */}
                <div
                    className="absolute h-6 w-6 bg-white border-2 border-primary-500 rounded-full shadow-md z-10 top-1/2 -translate-y-1/2 transform transition-all duration-75 ease-out pointer-events-none"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                />

                {/* Label (Optional) */}
                {formatLabel && (
                    <div
                        className="absolute -top-6 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity hover:opacity-100"
                        style={{ left: `${percentage}%` }}
                    >
                        {formatLabel(value)}
                    </div>
                )}
            </div>
        );
    }
);
Slider.displayName = 'Slider';

export { Slider };
