import { useState, useEffect } from 'react';
import { Slider } from '@/components/core/Slider'; // Ensure this path is correct
import { BUDGET_PRESETS } from '@/data/mockData';
import { cn } from '@/lib/utils';


interface BudgetControlProps {
    value: number;
    onChange: (value: number) => void;
}

export function BudgetControl({ value, onChange }: BudgetControlProps) {
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    // Update preset selection based on slider value (reverse check)
    useEffect(() => {
        const preset = BUDGET_PRESETS.find(p => value >= p.min && value <= p.max);
        if (preset) {
            setSelectedPreset(preset.id);
        } else {
            setSelectedPreset(null);
        }
    }, [value]);

    const handlePresetClick = (preset: typeof BUDGET_PRESETS[0]) => {
        setSelectedPreset(preset.id);
        // Set to average or min of preset? Let's tick to min for start
        onChange(preset.min);
    };

    const dailyEstimate = Math.round(value / (Math.max(1, value > 0 ? value : 1)));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <label className="text-lg font-heading font-semibold text-slate-900">
                        Budget
                    </label>
                    <p className="text-xs font-bold uppercase tracking-widest mt-0.5 text-emerald-600 transition-all">
                        {value > 50000 ? 'Luxury Experience' : value > 15000 ? 'Balanced Trip' : 'Savvy Explorer'}
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-emerald-600">
                        ₹{value.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-3">
                {BUDGET_PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        onClick={() => handlePresetClick(preset)}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-[2rem] border transition-all duration-300",
                            selectedPreset === preset.id
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-100 -translate-y-1"
                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                        )}
                    >
                        <span className="text-3xl mb-2">{preset.icon}</span>
                        <span className="text-sm font-bold">{preset.label}</span>
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70",
                            selectedPreset === preset.id ? "text-emerald-100" : "text-slate-400")}>
                            {preset.range}
                        </span>
                    </button>
                ))}
            </div>

            {/* Slider & Daily Breakdown */}
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    <span>Low</span>
                    <span>High</span>
                </div>
                <Slider
                    min={0}
                    max={100000}
                    step={1000}
                    value={value}
                    onValueChange={onChange}
                    className="h-10"
                />

                <div className="mt-6 pt-6 border-t border-slate-200/50 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Daily Spend</p>
                        <p className="text-lg font-bold text-slate-900">₹{dailyEstimate.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Style</p>
                        <p className="text-sm font-bold text-emerald-600">
                            {value < 10000 ? 'Backpacker' : value < 40000 ? 'Comfort' : 'Luxury'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
