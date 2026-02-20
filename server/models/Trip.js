const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    destination: { type: String }, // Keeps compatibility with legacy code
    days: { type: Number, required: true },
    budget: Number,
    estimatedCost: Number, // Normalized from totalCost
    currency: { type: String, default: '₹' },
    interests: [String],
    safetyMode: { type: Boolean, default: false },
    plans: [{
        day: Number,
        theme: String,
        places: [{
            name: String,
            category: String,
            description: String,
            cost: Number,
            duration: Number,
            image: String,
            mapsUrl: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        }],
        totalCost: Number
    }],
    aiTip: String,
    createdAt: { type: Date, default: Date.now }
});

// Index for city/country searches
TripSchema.index({ city: 'text', country: 'text' });

module.exports = mongoose.model('Trip', TripSchema);

