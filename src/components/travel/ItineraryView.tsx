import { Itinerary, Place, saveTrip } from '@/lib/ai-engine';
import { Card, CardContent } from '@/components/core/Card';
import { Button } from '@/components/core/Button';
import { Map, Download, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MapView } from '@/components/travel/MapView';
import { CommunityExperiences } from '@/components/travel/CommunityExperiences';

interface ItineraryViewProps {
    itinerary: Itinerary;
    onBack: () => void;
}

export function ItineraryView({ itinerary, onBack }: ItineraryViewProps) {
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [userReview, setUserReview] = useState('');
    const [userRating, setUserRating] = useState(5);
    const [showMap, setShowMap] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveTrip(itinerary);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save trip', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleShareExperience = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/experiences/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    location: itinerary.destination,
                    experience: userReview,
                    rating: userRating,
                    tripId: (itinerary as any)._id
                })
            });
            if (res.ok) {
                setShowExperienceModal(false);
                setUserReview('');
                alert('Experience shared with the community!');
            }
        } catch (error) {
            console.error('Failed to share experience', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 pb-32 max-w-5xl animate-fade-in relative">
            <AnimatePresence>
                {showExperienceModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl"
                        >
                            <h2 className="text-2xl font-heading font-bold mb-6 text-slate-900 text-center">Share your {itinerary.destination} Experience</h2>
                            <textarea
                                className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="What was the highlight of your trip?"
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                            />
                            <div className="flex items-center justify-between mt-6 mb-8">
                                <span className="text-sm font-semibold text-slate-600">Your Rating</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={`h-6 w-6 cursor-pointer transition-colors ${userRating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                            onClick={() => setUserRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setShowExperienceModal(false)}>Cancel</Button>
                                <Button variant="primary" className="flex-1 rounded-xl shadow-lg shadow-primary-200" onClick={handleShareExperience} disabled={!userReview}>Post Review</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {showMap && <MapView destination={itinerary.destination} itinerary={itinerary} onClose={() => setShowMap(false)} />}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent hover:text-primary-600 mb-2">
                        ← Back to Planning
                    </Button>
                    <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900">
                        {itinerary.destination} Adventure
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        {itinerary.days} Days • Estimated Cost: <span className="font-semibold text-slate-900">{itinerary.currency}{itinerary.totalCost.toLocaleString()}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-xl border-primary-100 text-primary-600 bg-primary-50/30 hover:bg-primary-50"
                        onClick={() => setShowExperienceModal(true)}
                    >
                        <Star className="h-4 w-4" /> Share Experience
                    </Button>
                    <Button
                        variant={isSaved ? "outline" : "primary"}
                        size="sm"
                        className={`gap-2 rounded-xl transition-all ${isSaved ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
                        onClick={handleSave}
                        disabled={isSaved || isSaving}
                        isLoading={isSaving}
                    >
                        {isSaved ? <Check className="h-4 w-4" /> : (isSaving ? null : <Download className="h-4 w-4" />)}
                        {isSaved ? 'Saved!' : (isSaving ? 'Saving...' : 'Save Trip')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Timeline */}
                <div className="lg:col-span-2 space-y-10">
                    {itinerary.plans.map((day, dayIndex) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: dayIndex * 0.1 }}
                            className="relative pl-8 border-l-2 border-slate-100"
                        >
                            {/* Day Marker */}
                            <div className="absolute -left-[14px] top-0 h-7 w-7 rounded-lg bg-primary-100 text-primary-600 border-4 border-white shadow-sm flex items-center justify-center font-bold text-xs">
                                {day.day}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Day {day.day}</h3>
                                <p className="text-primary-600 font-medium">{day.theme}</p>
                            </div>

                            <div className="space-y-4">
                                {day.places.map((place, placeIndex) => (
                                    <PlaceCard key={`${day.day}-${placeIndex}`} place={place} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right: Map & Interaction (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="overflow-hidden bg-slate-900 text-white border-none shadow-xl rounded-3xl">
                            <div className="h-48 bg-slate-800 flex items-center justify-center relative group cursor-pointer" onClick={() => setShowMap(true)}>
                                {/* Placeholder Map Image/Component */}
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000"
                                    alt="Map Preview"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Button
                                        className="gap-2 bg-white text-slate-900 hover:bg-white/90 rounded-xl"
                                    >
                                        <Map className="h-4 w-4" /> View Map
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="pt-6">
                                <h3 className="font-bold text-lg mb-4">Trip Summary</h3>
                                <div className="space-y-3 text-sm text-slate-300">
                                    <div className="flex justify-between border-b border-slate-700 pb-2">
                                        <span>Duration</span>
                                        <span className="text-white font-medium">{itinerary.days} Days</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-700 pb-2">
                                        <span>Total Cost</span>
                                        <span className="text-white font-medium">{itinerary.currency}{itinerary.totalCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Destinations</span>
                                        <span className="text-white font-medium">{itinerary.plans.reduce((acc, day) => acc + day.places.length, 0)} Places</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Tip Card */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-emerald-100 rounded-full opacity-50 blur-xl"></div>
                            <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                                <Star className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                                AI Insight
                            </h4>
                            <p className="text-sm text-emerald-700 leading-relaxed relative z-10">
                                {itinerary.aiTip || "We optimized your route to save travel time!"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Section */}
            <CommunityExperiences location={itinerary.destination} />
        </div>
    );
}

function PlaceCard({ place }: { place: Place }) {
    return (
        <Card className="flex flex-row overflow-hidden hover:shadow-lg transition-all duration-300 group border-slate-100 rounded-2xl bg-white">
            <div className="w-1/3 md:w-40 relative overflow-hidden">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {place.isHiddenGem && (
                    <div className="absolute top-2 left-2 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold px-2 py-1 rounded-lg shadow-lg">
                        Hidden Gem
                    </div>
                )}
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 text-lg">{place.name}</h4>
                        <div className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md border border-amber-100">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {place.rating}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {place.category}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{place.description}</p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">⏱️ {place.duration}h</span>
                    <div className="flex items-center gap-3">
                        {place.mapsUrl && (
                            <a
                                href={place.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
                            >
                                <Map className="h-3 w-3" /> Maps
                            </a>
                        )}
                        <span className="text-slate-600">
                            {place.cost > 0 ? `₹${place.cost}` : <span className="text-emerald-600">Free</span>}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
