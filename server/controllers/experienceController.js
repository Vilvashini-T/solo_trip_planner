const Experience = require('../models/Experience');

// Fetch experiences for a location
exports.getExperiences = async (req, res) => {
    try {
        const { location } = req.query;
        const query = location ? { location: new RegExp(location, 'i') } : {};
        const experiences = await Experience.find(query).sort({ date: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
};

// Add a new experience
exports.addExperience = async (req, res) => {
    try {
        const { location, experience, rating, tripId } = req.body;
        const newExperience = new Experience({
            userId: req.user.id,
            user: req.user.name,
            location,
            experience,
            rating,
            tripId
        });
        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add experience' });
    }
};
