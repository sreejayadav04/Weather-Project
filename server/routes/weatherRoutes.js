const express = require("express");
const router = express.Router();

const {
  getWeather,
} = require("../services/weatherService");

const SearchHistory = require("../models/SearchHistory");

// GET weather
router.get("/", async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const weather = await getWeather(city);

    // Save search history in MongoDB
    await SearchHistory.create({
      city: weather.location.name,
      country: weather.location.country,
    });

    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
});

// GET search history
router.get("/history", async (req, res, next) => {
  try {
    const history = await SearchHistory.find()
      .sort({ searchedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
