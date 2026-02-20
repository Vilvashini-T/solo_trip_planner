const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/autocomplete", async (req, res) => {
    const input = req.query.input;

    if (!input || input.length < 3) {
        return res.json({ suggestions: [] });
    }

    try {
        const response = await axios.post(
            `https://places.googleapis.com/v1/places:autocomplete?key=${process.env.GOOGLE_PLACES_API_KEY}`,
            { input },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.placeId'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Autocomplete Error Details:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch suggestions", details: error.response?.data });
    }
});

module.exports = router;
