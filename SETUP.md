# 🚀 SoloTrip AI – Production Setup Guide

Welcome to SoloTrip AI! This guide will help you get the project up and running for local development and collaboration.

## 📋 Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas Account (or local MongoDB)

## 🛠️ Installation Steps

### 1. Clone & Install
```bash
git clone https://github.com/Vilvashini-T/solo_trip_planner.git
cd solo_trip_planner
```

### 2. Backend Setup
Navigate to the `server` folder:
```bash
cd server
npm install
```
Create a `.env` file based on `.env.example` and fill in your keys:
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `GROQ_API_KEY`: Get from [Groq Console](https://console.groq.com).
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com).
- `OPENROUTER_API_KEY`: (Recommended) for Phase 6 features.
- `JWT_SECRET`: A long random string for auth.

### 3. Frontend Setup
Navigate to the root `travel` folder:
```bash
cd ..
npm install
```
Create a `.env` file:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy... (Your Google Maps Key)
```

## 🚀 Running the App
1. **Start Backend**: `cd server && npm start` (Runs on port 4000)
2. **Start Frontend**: `npm run dev` (Runs on port 3000)

## 🏗️ Architecture Note
- **Frontend**: React + Vite + Tailwind + Framer Motion
- **Backend**: Node.js + Express + Socket.io (Real-time Comments)
- **Database**: MongoDB (Atlas)

## 🤝 Collaboration Rules
1. **Always** check `.env.example` when adding new variables.
2. **Do not** commit your `.env` file.
3. Use the `SETUP.md` checklist before pushing new features.
