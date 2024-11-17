const mongoose = require("mongoose");
const dotenv = require("dotenv");
const LawnData = require("./models/LawnData");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let batteryLevel = 100; // Start with a full battery

const generateFakeData = async () => {
  try {
    // Decrement the battery level
    batteryLevel = Math.max(0, batteryLevel - Math.random() * 2); // Reduce battery by 0-2% per cycle

    // Generate other dynamic variables
    const fakeData = {
      batteryLevel,
      powerUsage: Math.random() * 100, // Random power usage (0-100W)
      bladeRPM: Math.random() * 3000, // Random RPM (0-3000)
      speed: Math.random() * 2, // Random speed (0-2 m/s)
      grassHeight: Math.random() * 10, // Grass height variation (0-10 cm)
      areaCovered: Math.random() * 50, // Random area covered (0-50 sq.m.)
      gpsCoordinates: {
        coordinates: [[Math.random() * 100, Math.random() * 100]], // Random GPS location
      },
    };

    // Add data to the database
    await LawnData.create(fakeData);

    console.log("Generated Fake Data:", fakeData);

    // Reset the battery level if it reaches 0
    if (batteryLevel <= 0) {
      console.log("Battery drained! Resetting to 100%.");
      batteryLevel = 100;
    }
  } catch (error) {
    console.error("Error generating data:", error.message);
  }
};

// Run the generator every 10 seconds
setInterval(generateFakeData, 10000);
