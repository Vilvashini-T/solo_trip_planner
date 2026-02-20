# SoloTrip AI ✈️

SoloTrip AI is a professional, startup-level travel planner designed for solo travelers. It combines advanced AI generation, real-time social feedback, and interactive mapping to create safer, more personalized adventures.

## ✨ Features
- **AI-Optimized Itineraries**: Grounded in real-world Google Places data (No Hallucinations).
- **Cultural Deep Dive**: High-fidelity insights into traditions, landmarks, and festivals (Powered by OpenRouter).
- **Real-time Social Hub**: Connect with other travelers in live trip rooms (Socket.io).
- **Interactive Maps**: Custom markers and popups for every attraction.
- **Enterprise Security**: JWT Authentication, Route Protection, and Rate Limiting.
- **Smart Budgeting**: Daily breakdowns and personalized spending estimates.

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, TypeScript |
| **Backend** | Express 5, Node.js, Socket.io |
| **Database** | MongoDB Atlas, Mongoose |
| **AI** | OpenRouter (Primary), Groq, Gemini |
| **Maps** | Google Maps Platform (New Places API, Embed) |
| **Auth** | JWT (JSON Web Tokens), Bcrypt.js |

## 🚀 Getting Started
Refer to the [SETUP.md](./SETUP.md) for detailed instructions on running the project locally.

```bash
git clone https://github.com/Vilvashini-T/solo_trip_planner.git
cd solo_trip_planner
```

## 📦 Production Hardening
This project has undergone a full technical audit to ensure it is GitHub-ready:
- ✅ **Clean Code**: No hardcoded keys or excessive logs.
- ✅ **Security**: Helmet, CORS, and Rate Limiting enabled.
- ✅ **Real-time**: Socket connections per trip room.
- ✅ **Grounding**: AI prompts verified against real Google Maps data.

## 📄 License
ISC License - Feel free to use and contribute!
