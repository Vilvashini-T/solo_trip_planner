import { useState } from 'react';
import { DestinationSearch } from '@/components/travel/DestinationSearch';
import { DaySelector } from '@/components/travel/DaySelector';
import { InterestCards } from '@/components/travel/InterestCards';
import { BudgetControl } from '@/components/travel/BudgetControl';
import { Button } from '@/components/core/Button';
import { Sparkles, Shield, Info } from 'lucide-react';
import { generateItinerary, Itinerary } from '@/lib/ai-engine';
import { ItineraryView } from '@/components/travel/ItineraryView';
import { TripGenerationLoader } from '@/components/travel/TripGenerationLoader';
import { AnimatePresence } from 'framer-motion';

export function Home() {
    const [destination, setDestination] = useState<any>(null);
    const [days, setDays] = useState(3);
    const [interests, setInterests] = useState<string[]>([]);
    const [budget, setBudget] = useState(15000);
    const [safetyMode, setSafetyMode] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [itinerary, setItinerary] = useState<Itinerary | null>(null);

    const handleGenerate = async (force: boolean = false) => {
        if (!destination) return;

        // Check if trip exists first
        if (!force) {
            try {
                const checkRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trips/check?city=${destination.name}&days=${days}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const checkData = await checkRes.json();
                if (checkData.exists) {
                    if (window.confirm(`You already have a ${days}-day trip to ${destination.name}. Would you like to open it? Click 'Cancel' to generate a fresh one.`)) {
                        setItinerary(checkData.trip);
                        return;
                    }
                }
            } catch (e) {
                // Silently continue to generation if check fails
            }
        }

        setIsGenerating(true);
        try {
            const result = await generateItinerary({
                destinationName: destination.name,
                days,
                interests,
                budget,
                safetyMode,
            });
            setItinerary(result);
        } catch (error) {
            console.error("Failed to generate", error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (itinerary) {
        return (
            <ItineraryView
                itinerary={itinerary}
                onBack={() => setItinerary(null)}
            />
        );
    }

    return (
        <div className="relative min-h-screen">
            <AnimatePresence>
                {isGenerating && <TripGenerationLoader />}
            </AnimatePresence>

            {/* Hero Background */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-white -z-10" />

            <div className="container mx-auto px-4 py-8 pb-32 max-w-3xl">
                <div className="text-center space-y-6 mb-16 animate-fade-in pt-10">
                    <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-2">
                        ✈️  The #1 AI Travel Planner
                    </div>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-slate-900 tracking-tight">
                        Where to next?
                    </h1>
                    <p className="text-xl text-slate-600 max-w-xl mx-auto">
                        Build your perfect <span className="text-primary-600 font-semibold">solo trip</span> in seconds.
                        Personalized itineraries, hidden gems, and smart budgeting.
                    </p>
                </div>

                <div className="space-y-8 animate-slide-up">
                    {/* 1. Destination */}
                    <section className="space-y-4">
                        <DestinationSearch onSelect={setDestination} />
                    </section>

                    {destination && (
                        <>
                            {/* 2. Days */}
                            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 animate-fade-in relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-100/50 transition-colors duration-500" />
                                <DaySelector value={days} onChange={setDays} />
                            </section>

                            {/* 3. Interests */}
                            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 animate-fade-in delay-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-100/50 transition-colors duration-500" />
                                <InterestCards selected={interests} onChange={setInterests} destination={destination?.name} />
                            </section>

                            {/* 4. Budget */}
                            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 animate-fade-in delay-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-100/50 transition-colors duration-500" />
                                <BudgetControl value={budget} onChange={setBudget} />
                            </section>

                            {/* 5. Safety Mode */}
                            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 animate-fade-in delay-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-none">Safety Mode (Beta)</h3>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                                                <Info className="h-3 w-3" />
                                                Priority for safer solo travel zones
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSafetyMode(!safetyMode)}
                                        className={`w-14 h-8 rounded-full transition-all duration-300 relative ${safetyMode ? 'bg-amber-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${safetyMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </section>

                            {/* Action */}
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-40 md:static md:bg-transparent md:border-none md:p-0 mt-8">
                                <div className="container mx-auto max-w-3xl">
                                    <Button
                                        size="lg"
                                        className="w-full text-xl h-16 rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 transition-shadow bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
                                        onClick={handleGenerate}
                                        isLoading={isGenerating}
                                        disabled={interests.length === 0}
                                    >
                                        {!isGenerating && <Sparkles className="mr-2 h-6 w-6" />}
                                        {isGenerating ? 'Designing your trip...' : 'Generate Dream Trip'}
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 mt-2">
                                        Powered by Advanced AI • 100% Free
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
