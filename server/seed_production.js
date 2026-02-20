const mongoose = require('mongoose');
const Comment = require('./models/Comment');
const Trip = require('./models/Trip');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedProduction() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // 1. Create a Production Ready Dummy User
        let user = await User.findOne({ email: "traveler@solotrip.ai" });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("solo12345", salt);
            user = new User({
                name: "Aarav Sharma",
                email: "traveler@solotrip.ai",
                password: hashedPassword
            });
            await user.save();
            console.log("👤 Dummy User created: traveler@solotrip.ai");
        }

        // 2. Create a Sample Grounded Trip for India
        let trip = await Trip.findOne({ city: "Varanasi" });
        if (!trip) {
            trip = new Trip({
                userId: user._id,
                city: "Varanasi",
                country: "India",
                destination: "Varanasi, Uttar Pradesh",
                days: 3,
                budget: 15000,
                estimatedCost: 12400,
                interests: ["Culture", "Photography"],
                safetyMode: true,
                plans: [
                    {
                        day: 1,
                        theme: "Ancient Traditions",
                        places: [
                            {
                                name: "Dashashwamedh Ghat",
                                category: "Culture",
                                description: "The heart of Varanasi, famous for its spectacular Evening Ganga Aarti ceremony.",
                                cost: 0,
                                duration: 2,
                                image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
                                mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dashashwamedh+Ghat",
                                coordinates: { lat: 25.3068, lng: 83.0101 }
                            }
                        ],
                        totalCost: 500
                    }
                ],
                aiTip: "Varanasi is best explored on foot. Wear comfortable shoes and keep change for the ghats."
            });
            await trip.save();
            console.log("✈️ Sample Trip created for Varanasi");
        }

        // 3. Seed 3 High-Quality Social Comments
        const dummyComments = [
            {
                tripId: trip._id,
                userId: user._id,
                userName: "Aarav Sharma",
                text: "The Ganga Aarti was absolutely surreal. Make sure to get there 45 mins early for a good seat on a boat!"
            },
            {
                tripId: trip._id,
                userId: user._id,
                userName: "Priya Singh",
                text: "Solo traveling in Varanasi felt very spiritual. The narrow lanes are full of hidden gems and great lassi shops."
            },
            {
                tripId: trip._id,
                userId: user._id,
                userName: "John Smith",
                text: "A truly grounded experience. The AI itinerary led me to some incredible local weavers in the backstreets."
            }
        ];

        await Comment.deleteMany({}); // Clear for clean production demo
        await Comment.insertMany(dummyComments);
        console.log("💬 Seeded 3 real-time social comments successfully.");

        console.log("\n✅ PRODUCTION ENVIRONMENT READY FOR GITHUB PUSH.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedProduction();
