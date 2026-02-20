import { useState } from 'react';
import { INTERESTS } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Check, Info, X, MapPin, Sparkles, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InterestCardsProps {
    selected: string[];
    onChange: (selected: string[]) => void;
    destination?: string; // Add destination to provide context
}

export function InterestCards({ selected, onChange, destination }: InterestCardsProps) {
    const [showDeepDive, setShowDeepDive] = useState<string | null>(null);

    const toggleInterest = (id: string) => {
        if (selected.includes(id)) {
            onChange(selected.filter(i => i !== id));
        } else {
            onChange([...selected, id]);
            // Show deep dive if destination is set (specifically India for now)
            if (destination?.toLowerCase().includes('india')) {
                setShowDeepDive(id);
            }
        }
    };

    const getCultureData = (interestId: string) => {
        if (interestId === 'culture') {
            return {
                title: "The Soul of Incredible India",
                description: "India is the cradle of civilization. Its culture is a 5,000-year-old masterpiece of philosophy, architecture, and spirituality. From the Sanskrit chants echoing in Varanasi's fog to the intricate Rajasthani folk art, every corner tells a story of 'Ganga-Jamuni Tehzeeb'—the beautiful fusion of cultures. You will experience the concept of 'Dharma'—the righteous path that guides millions.",
                festivals: ["Dilwali - Festival of Lights", "Holi - Festival of Colors", "Pushkar Camel Fair"],
                traditions: ["Classical Dance (Kathak, Bharatanatyam)", "Ayurvedic Wellness", "Spiritual Pilgrimages"],
                landmarks: [
                    { name: "The Taj Mahal", significance: "Symbol of Eternal Love" },
                    { name: "Hampi Ruins", significance: "The Lost Empire of Vijayanagara" },
                    { name: "Ajanta Caves", significance: "2nd Century BC Rock-cut Architecture" }
                ],
                attractions: ["Varanasi Ghats", "Mysuru Palace", "Konark Sun Temple", "Amritsar Golden Temple"]
            };
        }
        if (interestId === 'food') {
            return {
                title: "India's Culinary Odyssey",
                description: "Indian cuisine is not just 'curry'; it's a spice-led symphony. Every 100 kilometers, the flavors, ingredients, and cooking techniques change completely. From the rich, buttery textures of North India to the coconut-infused, spicy seafood of the South, food in India is an act of love and hospitality.",
                festivals: ["Pongal - Harvest Festival", "Iftar at Jama Masjid", "Goa Food and Music Festival"],
                traditions: ["Thali Serving Style", "Tandoori Cooking", "Spice Blending (Masala)"],
                landmarks: [
                    { name: "Old Delhi Streets", significance: "Street Food Capital" },
                    { name: "Lucknow Imambara", significance: "Gharana of Awadhi Cuisine" }
                ],
                attractions: ["Chandni Chowk", "Hyderabad Biryani Hubs", "Pondicherry Cafes"]
            };
        }
        return {
            title: `Expanding ${interestId} in India`,
            description: `Experience the best of ${interestId} across the Indian subcontinent. Discover hidden gems and world-famous landmarks tailored to your passion.`,
            attractions: ["Jaipur Forts", "Kerala Backwaters", "Ladakh Monasteries"]
        };
    };

    return (
        <div className="space-y-4">
            <label className="text-lg font-heading font-semibold text-slate-900">
                What are you into?
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {INTERESTS.map((interest) => {
                    const isSelected = selected.includes(interest.id);
                    const Icon = interest.icon;

                    return (
                        <motion.button
                            key={interest.id}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleInterest(interest.id)}
                            className={cn(
                                "relative group overflow-hidden rounded-3xl aspect-[4/3] text-left transition-all duration-300",
                                isSelected ? "ring-4 ring-primary-500 ring-offset-2" : "ring-1 ring-slate-200 hover:shadow-lg"
                            )}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={interest.image}
                                    alt={interest.label}
                                    className={cn(
                                        "w-full h-full object-cover transition-transform duration-700",
                                        isSelected ? "scale-110" : "group-hover:scale-110"
                                    )}
                                />
                                <div className={cn(
                                    "absolute inset-0 transition-opacity duration-300",
                                    isSelected ? "bg-slate-900/60" : "bg-slate-900/40 group-hover:bg-slate-900/50"
                                )} />
                            </div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-end p-4">
                                <div className={cn(
                                    "absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-all",
                                    isSelected ? "bg-primary-500 text-white scale-100" : "bg-white/20 text-white scale-0 opacity-0"
                                )}>
                                    <Check className="h-5 w-5" />
                                </div>

                                <Icon className="h-8 w-8 text-white mb-2" />
                                <span className="text-white font-bold text-lg">{interest.label}</span>
                            </div>

                            {/* Deep Dive Trigger Overlay (if selected) */}
                            {isSelected && (
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-md">
                                        <Sparkles className="h-3 w-3 text-white animate-pulse" />
                                    </div>
                                </div>
                            )}

                            {/* Selection Glow Gradient (Bottom) */}
                            {isSelected && (
                                <div className={cn("absolute inset-0 bg-gradient-to-t opacity-30 pointer-events-none", interest.color)} />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Cultural Deep Dive Modal */}
            <AnimatePresence>
                {showDeepDive && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden shadow-primary-900/20"
                        >
                            <div className="relative h-48 bg-primary-600 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
                                </div>
                                <Sparkles className="h-16 w-16 text-white/40 absolute -top-4 -right-4 rotate-12" />
                                <h2 className="relative text-white font-heading font-bold text-3xl px-8 text-center italic">
                                    "{getCultureData(showDeepDive).title}"
                                </h2>
                                <button
                                    onClick={() => setShowDeepDive(null)}
                                    className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <section className="max-h-[300px] overflow-y-auto pr-2 space-y-6">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                                            <Info className="h-4 w-4 text-primary-500" />
                                            Deep Dive Insight
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed text-sm">
                                            {getCultureData(showDeepDive).description}
                                        </p>
                                    </div>

                                    {getCultureData(showDeepDive).landmarks && (
                                        <div>
                                            <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-3">
                                                <Navigation className="h-4 w-4 text-primary-500" />
                                                Historical Significance
                                            </h3>
                                            <div className="space-y-2">
                                                {getCultureData(showDeepDive).landmarks.map(mark => (
                                                    <div key={mark.name} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-xl border border-slate-100">
                                                        <span className="font-bold text-slate-800">{mark.name}</span>
                                                        <span className="text-slate-400 italic">{mark.significance}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-3">
                                            <MapPin className="h-4 w-4 text-emerald-500" />
                                            Must-Visit Highlights
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {getCultureData(showDeepDive).attractions.map(attr => (
                                                <div key={attr} className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">{attr}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <button
                                    onClick={() => setShowDeepDive(null)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                                >
                                    Got it, Let's Plan!
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
