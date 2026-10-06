* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    min-height: 100vh;

    background: linear-gradient(
        135deg,
        #4facfe,
        #00f2fe
    );

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 30px;
}

.weather-app {
    width: 100%;
    max-width: 700px;
}

h1 {
    text-align: center;
    color: white;
    margin-bottom: 25px;
    font-size: 40px;
}

/* Search */

.search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.search-box input {
    flex: 1;

    padding: 15px 18px;

    border: none;
    outline: none;

    border-radius: 12px;

    font-size: 16px;
}

.search-box button {
    padding: 15px 25px;

    border: none;
    border-radius: 12px;

    background: #1d3557;
    color: white;

    font-size: 16px;
    font-weight: bold;

    cursor: pointer;

    transition: 0.3s;
}

.search-box button:hover {
    background: #102a43;
    transform: translateY(-2px);
}

/* Error */

#errorMessage {
    text-align: center;
    color: #b00020;
    background: white;
    border-radius: 8px;

    padding: 10px;

    margin-bottom: 15px;

    display: none;
}

/* Weather card */

.weather-card {
    background: rgba(255, 255, 255, 0.95);

    border-radius: 25px;

    padding: 30px;

    box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Location */

.location {
    text-align: center;
    margin-bottom: 25px;
}

.location h2 {
    font-size: 32px;
    color: #1d3557;
}

.location p {
    color: #666;
    margin-top: 5px;
}

/* Main weather */

.weather-main {
    display: flex;
    justify-content: center;
    align-items: center;

    gap: 25px;

    margin-bottom: 30px;
}

.weather-icon {
    font-size: 80px;
}

.temperature {
    font-size: 60px;
    font-weight: bold;
    color: #1d3557;
}

#weatherDescription {
    color: #555;
    font-size: 18px;
    text-transform: capitalize;
}

/* Details */

.weather-details {
    display: grid;

    grid-template-columns: repeat(4, 1fr);

    gap: 12px;

    margin-bottom: 30px;
}

.detail {
    background: #f1f7ff;

    border-radius: 15px;

    padding: 15px 8px;

    text-align: center;
}

.detail span {
    font-size: 25px;
}

.detail p {
    color: #666;
    font-size: 13px;
    margin: 7px 0;
}

.detail strong {
    color: #1d3557;
    font-size: 14px;
}

/* Forecast */

.forecast h3 {
    color: #1d3557;

    margin-bottom: 15px;

    font-size: 22px;
}

.forecast-container {
    display: grid;

    grid-template-columns: repeat(5, 1fr);

    gap: 10px;
}

.forecast-card {
    background: #f1f7ff;

    padding: 15px 5px;

    text-align: center;

    border-radius: 15px;
}

.forecast-card .day {
    font-weight: bold;
    color: #1d3557;
}

.forecast-card .icon {
    font-size: 30px;
    margin: 10px 0;
}

.forecast-card .temp {
    font-weight: bold;
    color: #333;
}

.forecast-card .description {
    font-size: 11px;
    color: #666;
    margin-top: 5px;
}

/* Responsive */

@media (max-width: 600px) {

    body {
        padding: 15px;
    }

    h1 {
        font-size: 32px;
    }

    .weather-card {
        padding: 20px;
    }

    .weather-main {
        gap: 10px;
    }

    .weather-icon {
        font-size: 60px;
    }

    .temperature {
        font-size: 45px;
    }

    .weather-details {
        grid-template-columns: repeat(2, 1fr);
    }

    .forecast-container {
        grid-template-columns: repeat(2, 1fr);
    }

    .forecast-card:last-child {
        grid-column: span 2;
    }

    .search-box {
        flex-direction: column;
    }

    .search-box button {
        width: 100%;
    }
}
