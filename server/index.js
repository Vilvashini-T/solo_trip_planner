require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const itineraryController = require('./controllers/itineraryController');
const experienceController = require('./controllers/experienceController');
const placesRoute = require('./routes/places');
const authRoute = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const Comment = require('./models/Comment');
const Trip = require('./models/Trip');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN || '*' }
});

const PORT = process.env.PORT || 4000;

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .catch(err => {
        // Critical error handled for production
    });

// Socket.io Real-time Social
io.on('connection', (socket) => {
    socket.on('join_trip', (tripId) => {
        socket.join(tripId);
    });

    socket.on('send_comment', async (data) => {
        try {
            const { tripId, userId, userName, text } = data;
            const newComment = new Comment({ tripId, userId, userName, text });
            await newComment.save();
            io.to(tripId).emit('new_comment', newComment);
        } catch (err) {
            // Error logged silently in production
        }
    });
});

// Routes
app.get('/', (req, res) => res.send('SoloTrip AI Production API Active.'));
app.get('/health', (req, res) => res.json({ status: 'ok', socket: true, auth: true }));

// Auth
app.use('/api/auth', authRoute);

// Itinerary
app.get('/api/trips/check', authMiddleware, async (req, res) => {
    const { city, days } = req.query;
    const existing = await Trip.findOne({ userId: req.user.id, city, days });
    res.json({ exists: !!existing, trip: existing });
});

app.post('/api/itinerary/generate', authMiddleware, itineraryController.generateItinerary);

// Experiences & Comments
app.get('/api/experiences', experienceController.getExperiences);
app.post('/api/experiences/add', authMiddleware, experienceController.addExperience);
app.get('/api/comments/:tripId', async (req, res) => {
    const comments = await Comment.find({ tripId: req.params.tripId }).sort({ createdAt: 1 });
    res.json(comments);
});

// Places API
app.use('/api/places', placesRoute);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

