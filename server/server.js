require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Weather API is running successfully!",
  });
});

// Weather routes
app.use("/api/weather", weatherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("API Error:", error.message);

  if (error.response) {
    console.error("External API error:", error.response.data);

    return res.status(
      error.response.status || 500
    ).json({
      success: false,
      message:
        error.response.data?.reason ||
        error.response.data?.message ||
        "Weather API error",
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message:
      error.message || "Internal server error",
  });
});

// Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });
