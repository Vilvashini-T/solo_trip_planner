# 🔐 SoloTrip AI: Collaborator Secret Template

Copy this file to `.env` in the `server` directory and fill in the values below.

## 👥 For My Friend
I've already set up the project structure. You just need to add these keys to make the AI and Maps features work on your machine:

```env
# 1. MongoDB Atlas (Our Production Database)
MONGODB_URI=mongodb+srv://samikshaprathip28_db_user:samiksha123@cluster0.jfjtnvo.mongodb.net/travel_planner?retryWrites=true&w=majority&appName=Cluster0

# 2. OpenRouter API (Our primary AI engine)
OPENROUTER_API_KEY=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

# 3. Google Maps Platform (For markers and autocomplete)
GOOGLE_PLACES_API_KEY=AIzaSyAZklvarjdMVmQj-cCRsKOnH56V9J-p_wA

# 4. Auth Secret
JWT_SECRET=solotrip_team_secret_2026

# 5. Fallback AI Keys (Optional)
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key

# Config
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

## 🛠️ How to use
1. Duplicate this file.
2. Rename the new file to `.env`.
3. Run `npm install` and `npm start` in the `server` folder.
