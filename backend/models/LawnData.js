const mongoose = require("mongoose");

const LawnDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  batteryLevel: Number,
  powerUsage: Number,
  bladeRPM: Number,
  speed: Number,
  grassHeight: Number,
  areaCovered: Number,
  gpsCoordinates: {
    type: { type: String, default: "Polygon" },
    coordinates: [[Number]],
  },
});

module.exports = mongoose.model("LawnData", LawnDataSchema);
