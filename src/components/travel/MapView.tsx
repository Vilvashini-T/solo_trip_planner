import { X, Navigation } from 'lucide-react';
import { Button } from '@/components/core/Button';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Itinerary, Place } from '@/lib/ai-engine';

interface MapViewProps {
    destination: string;
    itinerary?: Itinerary;
    onClose: () => void;
}

const containerStyle = {
    width: '100%',
    height: '100%'
};

export function MapView({ destination, itinerary, onClose }: MapViewProps) {
    const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAZklvarjdMVmQj-cCRsKOnH56V9J-p_wA';
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    // Collect all places from all days
    const allPlaces = itinerary?.plans.flatMap(day => day.places) || [];

    // Calculate center based on first place or destination name
    const center = allPlaces.length > 0 && allPlaces[0].coordinates
        ? { lat: allPlaces[0].coordinates.lat, lng: allPlaces[0].coordinates.lng }
        : { lat: 20.5937, lng: 78.9629 }; // Fallback to India center

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 md:p-8 animate-fade-in">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-slide-up border border-white/20">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/95 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-200">
                            <Navigation className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
                                {destination} Routes
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">Interactive Map • {allPlaces.length} Locations</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-12 w-12 hover:bg-slate-100 transition-all hover:rotate-90">
                        <X className="h-6 w-6 text-slate-600" />
                    </Button>
                </div>

                <div className="flex-1 bg-slate-100 relative">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={12}
                            options={{
                                styles: mapStyles, // Minimalist grayscale style
                                disableDefaultUI: false,
                                zoomControl: true,
                            }}
                        >
                            {allPlaces.map((place, idx) => (
                                place.coordinates && (
                                    <Marker
                                        key={`${place.name}-${idx}`}
                                        position={{ lat: place.coordinates.lat, lng: place.coordinates.lng }}
                                        onClick={() => setSelectedPlace(place)}
                                        icon={{
                                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                            scaledSize: new window.google.maps.Size(40, 40)
                                        }}
                                    />
                                )
                            ))}

                            {selectedPlace && selectedPlace.coordinates && (
                                <InfoWindow
                                    position={{ lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng }}
                                    onCloseClick={() => setSelectedPlace(null)}
                                >
                                    <div className="p-2 max-w-[200px]">
                                        <h4 className="font-bold text-slate-900 text-sm">{selectedPlace.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{selectedPlace.description}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{selectedPlace.category}</span>
                                            <span className="text-[10px] text-slate-400">⏱️ {selectedPlace.duration}h</span>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                            Loading Interactive Map...
                        </div>
                    )}

                    {/* API Diagnostic Placeholder */}
                    {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/10">
                            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 text-center">
                                <h4 className="font-bold text-slate-900">Map Service Initializing...</h4>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-8 py-4 bg-white border-t border-slate-100 flex justify-center items-center gap-4 text-slate-400">
                    <p className="text-xs font-medium uppercase tracking-widest">Powered by Google Cloud Platform & Solotrip Engine</p>
                </div>
            </div>
        </div>
    );
}

const mapStyles = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [{ "saturation": "-100" }]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{ "saturation": "-100" }]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{ "color": "#e9e9e9" }]
    }
];

