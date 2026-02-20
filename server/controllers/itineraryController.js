const Trip = require('../models/Trip');
const { Groq } = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { validateGenerateRequest } = require('../utils/validator');
const axios = require('axios');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ITINERARY_JSON_STRUCTURE = (destination, days) => `
{
    "destination": "${destination}",
    "days": ${days},
    "totalCost": number (estimated total in ₹),
    "currency": "₹",
    "aiTip": "A short piece of AI travel advice",
    "plans": [
        {
            "day": number,
            "theme": "string",
            "places": [
                {
                    "name": "string",
                    "category": "Culture/Food/Adventure/Nature/Photography/Nightlife",
                    "description": "string",
                    "cost": number (in ₹),
                    "duration": number (hours),
                    "image_query": "short_search_query_for_image",
                    "coordinates": { "lat": number, "lng": number }
                }
            ],
            "totalCost": number (daily total in ₹)
        }
    ]
}
`;

const fetchRealPlaces = async (destination) => {
    try {
        const response = await axios.post(
            `https://places.googleapis.com/v1/places:searchText?key=${process.env.GOOGLE_PLACES_API_KEY}`,
            {
                textQuery: `top tourist attractions and restaurants in ${destination}`,
                maxResultCount: 20
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.rating,places.photos'
                }
            }
        );
        return response.data.places || [];
    } catch (error) {
        console.error('Error fetching real places:', error.response?.data || error.message);
        return [];
    }
};

const generateWithOpenRouter = async (prompt) => {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "meta-llama/llama-3.1-70b-instruct",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("OpenRouter Error:", error.message);
        throw error;
    }
};

exports.generateItinerary = async (req, res) => {
    const validation = validateGenerateRequest(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    const { destination, days, interests, budget, safetyMode } = req.body;
    const userId = req.user?.id;

    try {
        // STEP 1: Fetch Real Points of Interest
        const realPlaces = await fetchRealPlaces(destination);
        const groundingContext = realPlaces.map(p => `${p.displayName.text} (${p.formattedAddress})`).join(', ');

        const prompt = `
            Create a detailed ${days}-day solo travel itinerary for ${destination}.
            
            CRITICAL SOURCE OF TRUTH:
            You MUST prioritize these real-world locations: ${groundingContext || 'Use only real, verified landmarks'}.
            DO NOT hallucinate or make up place names.
            Interests: ${interests.join(', ')}.
            Budget: ₹${budget}.
            Safety Mode: ${safetyMode ? 'ENABLED' : 'Standard'}.
            
            Return ONLY valid JSON following this structure:
            ${ITINERARY_JSON_STRUCTURE(destination, days)}
        `;

        console.log(`Starting generation for ${destination} (Grounded via OpenRouter)`);
        let itinerary;
        try {
            const rawContent = await generateWithOpenRouter(prompt);
            itinerary = JSON.parse(rawContent);
        } catch (err) {
            console.log("Falling back to Groq/Gemini...");
            try {
                itinerary = await generateWithGroq(prompt);
            } catch (groqErr) {
                itinerary = await generateWithGemini(prompt);
            }
        }

        // Post-processing logic for photos (remains similar but optimized)
        const processedPlans = await Promise.all(itinerary.plans.map(async (day) => {
            const processedPlaces = await Promise.all(day.places.map(async (place) => {
                const query = encodeURIComponent(place.name);
                let matchedPlace = realPlaces.find(p => p.displayName.text.toLowerCase().includes(place.name.toLowerCase()));

                if (matchedPlace && matchedPlace.photos && matchedPlace.photos.length > 0) {
                    const photoName = matchedPlace.photos[0].name;
                    place.image = `https://places.googleapis.com/v1/${photoName}/media?key=${process.env.GOOGLE_PLACES_API_KEY}&maxHeightPx=1000`;
                } else {
                    place.image = `https://loremflickr.com/1200/800/${query.replace(/%20/g, ',')},travel/all`;
                }

                place.mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
                return place;
            }));
            return { ...day, places: processedPlaces };
        }));

        itinerary.plans = processedPlans;

        // Save to Database
        const newTrip = new Trip({
            userId,
            city: destination,
            country: "Verified",
            destination,
            days,
            budget,
            estimatedCost: itinerary.totalCost,
            interests,
            safetyMode,
            plans: itinerary.plans,
            aiTip: itinerary.aiTip
        });
        const savedTrip = await newTrip.save();

        res.json(savedTrip);
    } catch (error) {
        console.error('AI Generation Detailed Error:', error);
        res.status(500).json({ error: 'Failed to generate itinerary', details: error.message });
    }
};

exports.getCulturalDeepDive = async (req, res) => {
    const { country, interest } = req.query;

    if (!country || !interest) return res.status(400).json({ error: "Country and Interest required" });

    const prompt = `
        Provide a professional, structured cultural deep dive for ${country} with focus on ${interest}.
        JSON Structure:
        {
            "title": "strings",
            "historicalDescription": "detailed string",
            "festivals": ["string"],
            "traditions": ["string"],
            "landmarks": [{"name": "string", "significance": "string"}],
            "attractions": ["string"]
        }
    `;

    try {
        const result = await generateWithOpenRouter(prompt);
        res.json(JSON.parse(result));
    } catch (err) {
        res.status(500).json({ error: "Failed to generate deep dive" });
    }
};

exports.saveTrip = async (req, res) => {
    try {
        const tripData = { ...req.body, userId: req.user.id };
        const newTrip = new Trip(tripData);
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save trip' });
    }
};

exports.getSavedTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch saved trips' });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete trip' });
    }
};

