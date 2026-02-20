import { useState, useEffect } from 'react';
import { Itinerary, getSavedTrips, deleteTrip as deleteTripApi } from '@/lib/ai-engine';
import { Card, CardContent } from '@/components/core/Card';
import { ItineraryView } from '@/components/travel/ItineraryView';
import { Button } from '@/components/core/Button';
import { Trash2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function MyTrips() {
    const [savedTrips, setSavedTrips] = useState<(Itinerary & { _id: string, createdAt: string })[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Itinerary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const trips = await getSavedTrips();
            setSavedTrips(trips as any);
        } catch (error) {
            console.error('Failed to fetch trips', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await deleteTripApi(id);
            setSavedTrips(savedTrips.filter(t => t._id !== id));
        } catch (error) {
            console.error('Failed to delete trip', error);
        }
    };

    if (selectedTrip) {
        return <ItineraryView itinerary={selectedTrip} onBack={() => setSelectedTrip(null)} />;
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-32 max-w-5xl min-h-screen">
            <div className="mb-8 animate-fade-in pt-10">
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-slate-900">
                    My Trips
                </h1>
                <p className="text-slate-500 mt-2">
                    Your collection of dream adventures.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : savedTrips.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 animate-slide-up">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No trips saved yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Start planning your next solo adventure on the home page and save it here!
                    </p>
                    <Button onClick={() => window.location.href = '/'}>
                        Plan a Trip
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                    {savedTrips.map((trip) => (
                        <motion.div
                            key={trip._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card
                                className="cursor-pointer hover:shadow-xl transition-all border-slate-100 overflow-hidden group h-full flex flex-col"
                                onClick={() => setSelectedTrip(trip)}
                            >
                                <div className="h-40 bg-slate-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <div className="absolute bottom-4 left-4 z-20 text-white">
                                        <h3 className="font-bold text-2xl font-heading">{trip.destination}</h3>
                                        <div className="flex items-center gap-2 text-xs opacity-90">
                                            <span>{trip.days} Days</span>
                                            <span>•</span>
                                            <span>{trip.currency}{trip?.totalCost?.toLocaleString() || '0'}</span>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            <span>Created: {new Date(trip.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-sm text-slate-500 line-clamp-2">
                                            {trip.aiTip || "Ready for adventure!"}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary-600 pl-0">
                                            View Details <ArrowRight className="h-4 w-4 ml-1" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={(e) => handleDelete(e, trip._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
