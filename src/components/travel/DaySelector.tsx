
import { Slider } from '@/components/core/Slider'; // Assuming we have or will update Slider to standard input or custom
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';

interface DaySelectorProps {
    value: number;
    onChange: (days: number) => void;
}

export function DaySelector({ value, onChange }: DaySelectorProps) {



    const presets = [
        { label: 'Stopover', value: 0.5, icon: '⏱️' },
        { label: 'Weekend', value: 2, icon: '🏙️' },
        { label: 'Standard', value: 4, icon: '🏛️' },
        { label: 'Deep Dive', value: 7, icon: '🎒' },
    ];

    const getTravelStyle = (days: number) => {
        if (days <= 1) return { label: 'Lightning Fast', color: 'text-rose-500' };
        if (days <= 3) return { label: 'The Explorer', color: 'text-blue-500' };
        if (days <= 6) return { label: 'The Local', color: 'text-indigo-500' };
        return { label: 'The Nomad', color: 'text-purple-500' };
    };

    const style = getTravelStyle(value);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <label className="text-lg font-heading font-semibold text-slate-900">
                        How long?
                    </label>
                    <p className={cn("text-xs font-bold uppercase tracking-widest mt-0.5", style.color)}>
                        {style.label}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-primary-600">
                        {value}
                    </span>
                    <span className="text-sm font-medium text-slate-400 ml-1">Days</span>
                </div>
            </div>

            {/* Presets */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {presets.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => onChange(p.value)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                            value === p.value
                                ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                        )}
                    >
                        <span>{p.icon}</span>
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="px-2">
                <Slider
                    min={0.5}
                    max={14}
                    step={0.5}
                    value={value}
                    onValueChange={onChange}
                    className="h-12"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className={cn("p-4 rounded-[2rem] border flex items-center gap-3 transition-colors",
                    value >= 1 ? "bg-amber-50/50 border-amber-100 text-amber-900" : "bg-slate-50 border-slate-100 text-slate-400"
                )}>
                    <div className="p-2.5 bg-white rounded-2xl shadow-sm text-amber-500"><Sun className="h-5 w-5" /></div>
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Full Days</div>
                        <div className="text-sm font-bold">{Math.floor(value)}</div>
                    </div>
                </div>
                <div className={cn("p-4 rounded-[2rem] border flex items-center gap-3 transition-colors",
                    value % 1 !== 0 ? "bg-indigo-50/50 border-indigo-100 text-indigo-900" : "bg-slate-50 border-slate-100 text-slate-400"
                )}>
                    <div className="p-2.5 bg-white rounded-2xl shadow-sm text-indigo-500"><Moon className="h-5 w-5" /></div>
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Half Days</div>
                        <div className="text-sm font-bold">{value % 1 !== 0 ? '1 (Eve)' : '0'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
