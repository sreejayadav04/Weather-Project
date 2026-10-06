const weatherService = require("../services/weatherService");
const SearchHistory = require("../models/SearchHistory");

const getWeather = async (req, res, next) => {
  try {
    const { city } = req.query;

    // Backend validation
    if (!city || !city.trim()) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const weather = await weatherService.getWeather(city.trim());

    // Save successful search to MongoDB
    await SearchHistory.create({
      city: weather.location.name,
      country: weather.location.country,
    });

    res.status(200).json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
};

const getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find()
      .sort({ searchedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeather,
  getSearchHistory,
};
