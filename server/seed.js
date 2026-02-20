require('dotenv').config();
const mongoose = require('mongoose');
const Experience = require('./models/Experience');

const dummyExperiences = [
    {
        user: "Ayesha S.",
        content: "India is absolutely vibrant! The food in Delhi and the history of Agra are unmatched. Make sure to visit the Lotus Temple at sunset.",
        location: "India",
        rating: 5
    },
    {
        user: "Liam K.",
        content: "Spent 3 days in Jaipur. The 'Pink City' really lives up to its name. The local markets are great but be ready to haggle!",
        location: "India",
        rating: 4
    },
    {
        user: "Sophia M.",
        content: "Kerala's backwaters were the highlight of my solo trip. The houseboats are a must-try for some peace and quiet.",
        location: "India",
        rating: 5
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Seeding DB...");

        // Only seed if empty to avoid duplicates on every run
        const count = await Experience.countDocuments();
        if (count === 0) {
            await Experience.insertMany(dummyExperiences);
            console.log("Seeded 3 dummy experiences!");
        } else {
            console.log("Found existing experiences, skipping seed.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
