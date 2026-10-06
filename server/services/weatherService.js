const axios = require("axios");

const getWeather = async (city) => {
  // Step 1: Find the city coordinates
  const geoResponse = await axios.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      params: {
        name: city,
        count: 1,
        language: "en",
        format: "json",
      },
    }
  );

  const location = geoResponse.data?.results?.[0];

  if (!location) {
    const error = new Error(
      `City "${city}" was not found.`
    );

    error.status = 404;

    throw error;
  }

  // Step 2: Get weather for those coordinates
  const weatherResponse = await axios.get(
    "https://api.open-meteo.com/v1/forecast",
    {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,

        current:
          "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,visibility",

        hourly:
          "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",

        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",

        timezone: "auto",

        forecast_days: 7,
      },
    }
  );

  return {
    location: {
      name: location.name,
      country: location.country,
      state: location.admin1,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
    },

    current: weatherResponse.data.current,

    hourly: weatherResponse.data.hourly,

    daily: weatherResponse.data.daily,
  };
};

module.exports = {
  getWeather,
};
