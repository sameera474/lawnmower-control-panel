const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const LawnData = require("./models/LawnData");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "https://lawnmower-control-panel-frontend.vercel.app", // Frontend on Vercel
  "http://localhost:3000", // Frontend in local development
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Allow credentials if necessary
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Get latest 50 entries
app.get("/api/realtime-data", async (req, res) => {
  try {
    const data = await LawnData.find().sort({ Timestamp: -1 }).limit(50);
    res.json({ RealTimeLawnMowerData: data.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate fake data
app.post("/api/generate-fake-data", async (req, res) => {
  try {
    let batteryLevel = Math.random() * 100;
    let areaCovered = Math.random() * 50;

    // Generate fake metrics
    const fakeData = {
      Timestamp: new Date(),
      Metrics: {
        BatteryLevel: parseFloat(batteryLevel.toFixed(1)),
        CurrentPowerUsage: Math.random() * 10 + 50, // Random power usage (50-60W)
        CuttingBladeRPM: Math.floor(Math.random() * 500 + 3000), // RPM (3000-3500)
        Speed: parseFloat((Math.random() * 2).toFixed(2)), // Speed (0-2 m/s)
        GrassHeight: parseFloat((Math.random() * 2 + 5).toFixed(1)), // Grass height (5-7 cm)
        AreaCovered: parseFloat(areaCovered.toFixed(1)), // Area covered
        ProximityFrontSensor: parseFloat((Math.random() * 2).toFixed(2)),
        ProximityRearSensor: parseFloat((Math.random() * 2).toFixed(2)),
        ObstacleDetected: Math.random() > 0.8, // Random boolean
        ErrorState: null,
      },
    };

    // Save to database
    await LawnData.create(fakeData);

    res.status(200).json({ message: "Fake data generated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root endpoint for verification
app.get("/", (req, res) => {
  res.status(200).send("Backend is running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
