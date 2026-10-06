import { useMemo, useState, useEffect } from "react";
import "./App.css";

import {
  Search,
  MapPin,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudSun,
  CloudRain,
  Cloud,
  Sun,
} from "lucide-react";

/* =========================
   WEATHER ICON
========================= */

function WeatherIcon({ code, size = 70 }) {
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(
      Number(code)
    )
  ) {
    return <CloudRain size={size} />;
  }

  if ([1, 2].includes(Number(code))) {
    return <CloudSun size={size} />;
  }

  if ([3, 45, 48].includes(Number(code))) {
    return <Cloud size={size} />;
  }

  if ([95, 96, 99].includes(Number(code))) {
    return <CloudRain size={size} />;
  }

  return <Sun size={size} />;
}

/* =========================
   WEATHER DESCRIPTION
========================= */

function weatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  return descriptions[Number(code)] || "Unknown weather";
}

/* =========================
   TEMPERATURE CONVERSION
========================= */

function convertTemperature(value, unit) {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(Number(value))
  ) {
    return "--";
  }

  const number = Number(value);

  if (unit === "F") {
    return Math.round((number * 9) / 5 + 32);
  }

  return Math.round(number);
}

/* =========================
   WIND CONVERSION
========================= */

function convertWind(value, unit) {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(Number(value))
  ) {
    return "--";
  }

  const number = Number(value);

  if (unit === "mph") {
    return Math.round(number * 0.621371);
  }

  return Math.round(number);
}

/* =========================
   PRECIPITATION CONVERSION
========================= */

function convertPrecipitation(value, unit) {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(Number(value))
  ) {
    return "--";
  }

  const number = Number(value);

  if (unit === "in") {
    return (number * 0.0393701).toFixed(2);
  }

  return number.toFixed(1);
}

/* =========================
   FORMAT TIME
========================= */

function formatTime(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* =========================
   FORMAT DATE
========================= */

function formatDate(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* =========================
   FORMAT DAY
========================= */

function formatDay(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString([], {
    weekday: "short",
  });
}

/* =========================
   FULL APP
========================= */

function App() {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("C");
  const [windUnit, setWindUnit] = useState("km/h");
  const [precipUnit, setPrecipUnit] = useState("mm");

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedDay, setSelectedDay] = useState("");

  /* =========================
     SEARCH HISTORY STATE
  ========================= */

  const [searchHistory, setSearchHistory] = useState([]);

  /* =========================
     LOAD SEARCH HISTORY
  ========================= */

  const loadSearchHistory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/weather/history"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load search history."
        );
      }

      setSearchHistory(result.data);
    } catch (err) {
      console.error("Search history failed:", err);
    }
  };

  /* =========================
     LOAD HISTORY ON START
  ========================= */

  useEffect(() => {
    loadSearchHistory();
  }, []);

  /* =========================
     SEARCH CITY
  ========================= */

  const searchCity = async (event) => {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(
          trimmedCity
        )}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to get weather data."
        );
      }

      console.log("Weather data:", result.data);

      setWeather(result.data);

      /* Refresh search history */
      await loadSearchHistory();

      /* Select first available day */
      if (
        result.data?.daily?.time &&
        Array.isArray(result.data.daily.time) &&
        result.data.daily.time.length > 0
      ) {
        setSelectedDay(result.data.daily.time[0]);
      }
    } catch (err) {
      console.error("Weather request failed:", err);

      setWeather(null);

      setError(
        err.message || "Unable to connect to the weather server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEARCH HISTORY CITY
  ========================= */

  const searchHistoryCity = async (selectedCity) => {
    setCity(selectedCity);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?city=${encodeURIComponent(
          selectedCity
        )}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to get weather data."
        );
      }

      setWeather(result.data);

      await loadSearchHistory();

      if (
        result.data?.daily?.time &&
        result.data.daily.time.length > 0
      ) {
        setSelectedDay(result.data.daily.time[0]);
      }
    } catch (err) {
      console.error("Weather request failed:", err);

      setWeather(null);

      setError(
        err.message || "Unable to connect to the weather server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     WEATHER DATA
  ========================= */

  const current = weather?.current;
  const location = weather?.location;
  const daily = weather?.daily;
  const hourly = weather?.hourly;

  /* =========================
     CURRENT VALUES
  ========================= */

  const temperature = convertTemperature(
    current?.temperature_2m,
    unit
  );

  const feelsLike = convertTemperature(
    current?.apparent_temperature,
    unit
  );

  const wind = convertWind(
    current?.wind_speed_10m,
    windUnit
  );

  const precipitation = convertPrecipitation(
    current?.precipitation,
    precipUnit
  );

  /* =========================
     DAILY FORECAST DAYS
  ========================= */

  const dailyDays = useMemo(() => {
    if (!daily || !Array.isArray(daily.time)) {
      return [];
    }

    return daily.time;
  }, [daily]);

  /* =========================
     HOURLY DATA
  ========================= */

  const selectedHourlyData = useMemo(() => {
    if (
      !hourly ||
      !Array.isArray(hourly.time) ||
      !selectedDay
    ) {
      return [];
    }

    const result = [];

    hourly.time.forEach((time, index) => {
      const dateString = time.split("T")[0];

      if (dateString === selectedDay) {
        result.push({
          time,
          temperature: hourly.temperature_2m?.[index],
          weatherCode: hourly.weather_code?.[index],
          humidity: hourly.relative_humidity_2m?.[index],
          windSpeed: hourly.wind_speed_10m?.[index],
          precipitation: hourly.precipitation?.[index],
        });
      }
    });

    return result;
  }, [hourly, selectedDay]);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div className="brand">

          <div className="logo">
            <CloudSun size={30} />
          </div>

          <div>
            <h1>WeatherNow</h1>
            <p>Weather dashboard</p>
          </div>

        </div>

        <div className="unit-controls">

          <button
            type="button"
            className={unit === "C" ? "active" : ""}
            onClick={() => setUnit("C")}
          >
            °C
          </button>

          <button
            type="button"
            className={unit === "F" ? "active" : ""}
            onClick={() => setUnit("F")}
          >
            °F
          </button>

        </div>

      </header>

      <main className="container">

        {/* =========================
            SEARCH
        ========================= */}

        <form
          className="search-form"
          onSubmit={searchCity}
        >

          <div className="search-box">

            <Search size={22} />

            <label
              htmlFor="city-search"
              className="sr-only"
            >
              Search for a city
            </label>

            <input
              id="city-search"
              type="text"
              placeholder="Search for a city..."
              value={city}
              onChange={(event) => {
                setCity(event.target.value);

                if (error) {
                  setError("");
                }
              }}
            />

          </div>

          <button
            type="submit"
            className="search-button"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </form>

        {/* =========================
            SEARCH HISTORY
        ========================= */}

        {searchHistory.length > 0 && (
          <div className="history">

            <h3>Recent Searches</h3>

            <div className="history-list">

              {searchHistory.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  onClick={() =>
                    searchHistoryCity(item.city)
                  }
                >
                  <MapPin size={16} />

                  <span>
                    {item.city}, {item.country}
                  </span>
                </button>
              ))}

            </div>

          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="loading">
            Loading weather...
          </div>
        )}

        {/* =========================
            WEATHER
        ========================= */}

        {weather && current && location && !loading ? (
          <>

            {/* =========================
                CURRENT WEATHER
            ========================= */}

            <section className="weather-card">

              <div className="location">

                <div>

                  <h2>{location.name}</h2>

                  <p>

                    <MapPin size={16} />

                    {location.state
                      ? `${location.state}, `
                      : ""}

                    {location.country}

                  </p>

                </div>

                <p className="date">
                  {formatDate(current.time)}
                </p>

              </div>

              <div className="main-weather">

                <div className="weather-icon">

                  <WeatherIcon
                    code={current.weather_code}
                    size={80}
                  />

                </div>

                <div>

                  <div className="temperature">

                    {temperature}

                    <span>°{unit}</span>

                  </div>

                  <p className="description">
                    {weatherDescription(
                      current.weather_code
                    )}
                  </p>

                  <p className="feels">
                    Feels like {feelsLike}°{unit}
                  </p>

                </div>

              </div>

              {/* =========================
                  WEATHER DETAILS
              ========================= */}

              <div className="details">

                <div className="detail">

                  <Droplets />

                  <div>

                    <span>Humidity</span>

                    <strong>
                      {current.relative_humidity_2m ??
                        "--"}
                      %
                    </strong>

                  </div>

                </div>

                <div className="detail">

                  <Wind />

                  <div>

                    <span>Wind</span>

                    <strong>
                      {wind} {windUnit}
                    </strong>

                  </div>

                </div>

                <div className="detail">

                  <CloudRain />

                  <div>

                    <span>Precipitation</span>

                    <strong>
                      {precipitation} {precipUnit}
                    </strong>

                  </div>

                </div>

                <div className="detail">

                  <Eye />

                  <div>

                    <span>Visibility</span>

                    <strong>

                      {current.visibility
                        ? (
                            Number(
                              current.visibility
                            ) / 1000
                          ).toFixed(1)
                        : "--"}{" "}
                      km

                    </strong>

                  </div>

                </div>

                <div className="detail">

                  <Gauge />

                  <div>

                    <span>Pressure</span>

                    <strong>

                      {current.surface_pressure !==
                      undefined
                        ? Math.round(
                            current.surface_pressure
                          )
                        : "--"}{" "}
                      hPa

                    </strong>

                  </div>

                </div>

                <div className="detail">

                  <Sunrise />

                  <div>

                    <span>Sunrise</span>

                    <strong>

                      {daily?.sunrise?.[0]
                        ? formatTime(
                            daily.sunrise[0]
                          )
                        : "--"}

                    </strong>

                  </div>

                </div>

                <div className="detail">

                  <Sunset />

                  <div>

                    <span>Sunset</span>

                    <strong>

                      {daily?.sunset?.[0]
                        ? formatTime(
                            daily.sunset[0]
                          )
                        : "--"}

                    </strong>

                  </div>

                </div>

              </div>

            </section>

            {/* =========================
                7 DAY FORECAST
            ========================= */}

            <section className="forecast-section">

              <div className="section-header">

                <h2>7-Day Forecast</h2>

                <div className="forecast-units">

                  <button
                    type="button"
                    className={
                      windUnit === "km/h"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setWindUnit("km/h")
                    }
                  >
                    km/h
                  </button>

                  <button
                    type="button"
                    className={
                      windUnit === "mph"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setWindUnit("mph")
                    }
                  >
                    mph
                  </button>

                  <button
                    type="button"
                    className={
                      precipUnit === "mm"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPrecipUnit("mm")
                    }
                  >
                    mm
                  </button>

                  <button
                    type="button"
                    className={
                      precipUnit === "in"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPrecipUnit("in")
                    }
                  >
                    in
                  </button>

                </div>

              </div>

              <div className="forecast">

                {dailyDays.map((date, index) => {

                  const code =
                    daily?.weather_code?.[index];

                  const max =
                    daily?.temperature_2m_max?.[index];

                  const min =
                    daily?.temperature_2m_min?.[index];

                  const isSelected =
                    selectedDay === date;

                  return (
                    <button
                      type="button"
                      className={`forecast-card ${
                        isSelected ? "selected" : ""
                      }`}
                      key={date}
                      onClick={() =>
                        setSelectedDay(date)
                      }
                    >

                      <h3>
                        {formatDay(date)}
                      </h3>

                      <WeatherIcon
                        code={code}
                        size={55}
                      />

                      <strong>
                        {convertTemperature(
                          max,
                          unit
                        )}
                        °{unit}
                      </strong>

                      <span>
                        {convertTemperature(
                          min,
                          unit
                        )}
                        °{unit}
                      </span>

                      <p>
                        {weatherDescription(code)}
                      </p>

                    </button>
                  );
                })}

              </div>

            </section>

            {/* =========================
                HOURLY FORECAST
            ========================= */}

            <section className="hourly-section">

              <div className="hourly-header">

                <h2>Hourly Forecast</h2>

                <div className="hourly-selected-day">

                  {selectedDay
                    ? formatDate(selectedDay)
                    : ""}

                </div>

              </div>

              <div className="day-selector">

                {dailyDays.map((date) => (

                  <button
                    type="button"
                    key={date}
                    className={
                      selectedDay === date
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedDay(date)
                    }
                  >
                    {formatDay(date)}
                  </button>

                ))}

              </div>

              {selectedHourlyData.length > 0 ? (

                <div className="hourly">

                  {selectedHourlyData.map(
                    (hour) => (

                      <div
                        className="hourly-card"
                        key={hour.time}
                      >

                        <span>
                          {formatTime(hour.time)}
                        </span>

                        <WeatherIcon
                          code={hour.weatherCode}
                          size={35}
                        />

                        <strong>

                          {convertTemperature(
                            hour.temperature,
                            unit
                          )}
                          °{unit}

                        </strong>

                        <small>

                          {weatherDescription(
                            hour.weatherCode
                          )}

                        </small>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="no-hourly">

                  No hourly forecast available for
                  this day.

                </div>

              )}

            </section>

          </>

        ) : (

          !loading && (

            <section className="weather-card empty">

              <CloudSun
                size={80}
                color="#ffd45a"
              />

              <h2>
                Search for a city
              </h2>

              <p>
                Enter a city name above to see
                current weather and forecasts.
              </p>

            </section>

          )

        )}

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer>

        WeatherNow • Weather data powered by
        OpenWeather & Open-Meteo

      </footer>

    </div>
  );
}

export default App;
