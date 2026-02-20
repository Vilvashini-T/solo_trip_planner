export interface Place {
    id: string;
    name: string;
    category: 'Culture' | 'Food' | 'Adventure' | 'Nature' | 'Photography' | 'Nightlife';
    description: string;
    cost: number;
    duration: number; // in hours
    rating: number;
    reviews: number;
    image: string;
    coordinates: { lat: number; lng: number };
    mapsUrl?: string; // Link to Google Maps
    isHiddenGem?: boolean;
    destinationId: string; // Link to parent destination
}

export interface DayPlan {
    day: number;
    date?: string;
    theme: string;
    places: Place[];
    totalCost: number;
}

export interface Itinerary {
    destination: string;
    days: number;
    totalCost: number;
    currency: string;
    plans: DayPlan[];
    aiTip?: string; // New field for AI insights
}

// Mock data removed. Connections to backend API active.


interface GenerateOptions {
    destinationName: string;
    days: number;
    interests: string[];
    budget: number;
    safetyMode?: boolean;
}

const API_URL = 'http://localhost:4000/api';

export async function generateItinerary({ destinationName, days, interests, budget, safetyMode }: GenerateOptions): Promise<Itinerary> {
    try {
        const response = await fetch(`${API_URL}/itinerary/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination: destinationName,
                days,
                interests,
                budget,
                safetyMode
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate itinerary');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function saveTrip(itinerary: Itinerary): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/trips/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itinerary),
        });
        return await response.json();
    } catch (error) {
        console.error('Save API Error:', error);
        throw error;
    }
}

export async function getSavedTrips(): Promise<Itinerary[]> {
    try {
        const response = await fetch(`${API_URL}/trips`);
        return await response.json();
    } catch (error) {
        console.error('Fetch API Error:', error);
        throw error;
    }
}

export async function deleteTrip(id: string): Promise<any> {
    try {
        const response = await fetch(`${API_URL}/trips/${id}`, {
            method: 'DELETE',
        });
        return await response.json();
    } catch (error) {
        console.error('Delete API Error:', error);
        throw error;
    }
}

