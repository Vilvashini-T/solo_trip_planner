# 🛠️ SoloTrip AI: Google Maps Setup Guide

If you see a message saying **"Google Maps Platform rejected your request. This API is not activated..."**, follow these 3 simple steps to fix it.

---

## 1. Enable the Maps APIs 🌍
Go to your [Google Cloud Console Library](https://console.cloud.google.com/apis/library) and enable these **three** specific APIs:

1.  **Maps Embed API**: (This powers the interactive map in the "View Map" popup).
2.  **Maps JavaScript API**: (Required for dynamic map interactions).
3.  **Places API**: (This is already working, but ensure it's on the same project).

> [!TIP]
> Just type "Maps Embed" in the search bar of the Library page, click the result, and then click the blue **ENABLE** button.

---

## 2. Check your API Key 🔑
Ensure your `.env` file in the `server` folder has the correct key:
```env
GOOGLE_PLACES_API_KEY=YOUR_KEY_HERE
```
And if you are running the frontend locally, check `src/components/travel/MapView.tsx` or your root `.env` for:
```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
```

---

## 3. Restart the App 🔄
After enabling the APIs in the Google Console, it can take **2-3 minutes** for Google to update. 
- Stop your terminal.
- Run `npm run dev` again.

---

### Still seeing errors?
- **Billing**: Ensure you have a billing account linked (Google gives a free tier that covers thousands of map loads for free).
- **Restrictions**: If you added "IP Restrictions" to your key, make sure your current IP is allowed.
