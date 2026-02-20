import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Map, CheckCircle } from 'lucide-react';

const LOADING_STEPS = [
    {
        message: "Scanning global travel trends...",
        icon: Sparkles,
        color: "text-purple-500"
    },
    {
        message: "Researching hidden gems in the area...",
        icon: Map,
        color: "text-blue-500"
    },
    {
        message: "Calculating optimal solo-friendly routes...",
        icon: CheckCircle,
        color: "text-emerald-500"
    },
    {
        message: "Finalizing your dream itinerary...",
        icon: CheckCircle,
        color: "text-primary-500"
    }
];

export function TripGenerationLoader() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 1500); // Change step every 1.5s

        return () => clearInterval(interval);
    }, []);

    const CurrentIcon = LOADING_STEPS[currentStep].icon;

    return (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center">
            <div className="w-full max-w-md px-6 text-center">
                <div className="mb-8 relative h-24 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CurrentIcon className={`h-20 w-20 ${LOADING_STEPS[currentStep].color}`} />
                        </motion.div>
                    </AnimatePresence>

                    {/* Ring Animation */}
                    <motion.div
                        className="absolute inset-0 border-4 border-slate-100 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.h2
                        key={currentStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-2xl font-heading font-bold text-slate-900 mb-2"
                    >
                        {LOADING_STEPS[currentStep].message}
                    </motion.h2>
                </AnimatePresence>

                <p className="text-slate-500">
                    Just a moment while our AI crafts your perfect solo adventure.
                </p>

                {/* Progress Bar */}
                <div className="mt-8 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>
        </div>
    );
}
