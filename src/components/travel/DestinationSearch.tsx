import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DESTINATIONS } from '@/data/mockData';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface DestinationSearchProps {
    onSelect: (destination: any) => void;
}

export function DestinationSearch({ onSelect }: DestinationSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<any>(null);

    const filteredMockDestinations = DESTINATIONS.filter(dest =>
        dest.name.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/api/places/autocomplete?input=${query}`);
                setSuggestions(response.data.suggestions || []);
            } catch (error) {
                console.error('Autocomplete Error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectSuggestion = (suggestion: any) => {
        const name = suggestion.placePrediction.text.text;
        const newDest = {
            id: suggestion.placePrediction.placeId,
            name: name,
            image: `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000`, // Sample fallback
            flag: '📍',
            type: 'Top Destination'
        };
        setQuery(name);
        onSelect(newDest);
        setIsOpen(false);
    };

    const handleSelectMock = (dest: typeof DESTINATIONS[0]) => {
        setQuery(dest.name);
        onSelect(dest);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-lg mx-auto">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    className="w-full h-14 pl-12 pr-12 rounded-3xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg transition-all hover:shadow-md"
                    placeholder="Where do you want to go? (e.g., 'India')"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 text-primary-500 animate-spin" />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (query.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-80 overflow-y-auto"
                    >
                        {/* Mock Results */}
                        {filteredMockDestinations.length > 0 && query.length < 3 && (
                            <div className="p-2 border-b border-slate-50">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-3 py-1">Popular Right Now</p>
                                {filteredMockDestinations.map((dest) => (
                                    <button
                                        key={dest.id}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
                                        onClick={() => handleSelectMock(dest)}
                                    >
                                        <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                            <img src={dest.image} alt={dest.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                {dest.name} <span className="text-xl">{dest.flag}</span>
                                            </h4>
                                            <p className="text-xs text-slate-500">{dest.type}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Real Google Results */}
                        {suggestions.length > 0 ? (
                            <div className="p-2">
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-3 py-1">Search Results</p>
                                {suggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
                                        onClick={() => handleSelectSuggestion(s)}
                                    >
                                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-primary-50 text-primary-600">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">
                                                {s.placePrediction.text.text}
                                            </h4>
                                            <p className="text-xs text-slate-500">Google Location</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : query.length >= 3 && !isLoading && (
                            <div className="p-8 text-center text-slate-500">
                                No specific locations found. Try "India".
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
