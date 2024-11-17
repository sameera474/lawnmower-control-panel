const mongoose = require("mongoose");
const dotenv = require("dotenv");
const LawnData = require("./models/LawnData");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let batteryLevel = 100; // Start with a full battery
let areaCovered = 0; // Start with 0 area covered

const generateFakeData = async () => {
  try {
    // Generate proximity values and detect obstacles
    const proximityFront = Math.random() * 2;
    const proximityRear = Math.random() * 2;
    const obstacleDetected = proximityFront < 0.5 || proximityRear < 0.5;
    const errorState = obstacleDetected ? "E01: Obstacle Detected" : null;

    // Decrease battery and calculate area covered
    batteryLevel = Math.max(0, batteryLevel - Math.random() * 0.5); // Decrease 0-0.5% battery
    if (!obstacleDetected) areaCovered += Math.random() * 0.5;

    // Create fake data
    const fakeData = {
      Timestamp: new Date(),
      Metrics: {
        BatteryLevel: parseFloat(batteryLevel.toFixed(1)),
        CurrentPowerUsage: Math.random() * 10 + 50, // Random power usage (50-60W)
        CuttingBladeRPM: Math.floor(Math.random() * 500 + 3000), // RPM (3000-3500)
        Speed: parseFloat((Math.random() * 2).toFixed(2)), // Speed (0-2 m/s)
        GrassHeight: parseFloat((Math.random() * 2 + 5).toFixed(1)), // Grass height (5-7 cm)
        AreaCovered: parseFloat(areaCovered.toFixed(1)), // Area covered
        ProximityFrontSensor: parseFloat(proximityFront.toFixed(2)),
        ProximityRearSensor: parseFloat(proximityRear.toFixed(2)),
        ObstacleDetected: obstacleDetected,
        ErrorState: errorState,
      },
    };

    // Save to database
    await LawnData.create(fakeData);

    console.log("Generated Fake Data:", fakeData);

    // Reset battery when drained
    if (batteryLevel <= 0) {
      console.log("Battery drained. Resetting to 100%.");
      batteryLevel = 100;
    }
  } catch (error) {
    console.error("Error generating data:", error.message);
  }
};

// Generate new data every 10 seconds
setInterval(generateFakeData, 10000);
