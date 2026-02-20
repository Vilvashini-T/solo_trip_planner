const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    user: { type: String, default: 'Traveler' },
    experience: { type: String, required: true }, // Renamed from content for audit spec
    location: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Experience', ExperienceSchema);

