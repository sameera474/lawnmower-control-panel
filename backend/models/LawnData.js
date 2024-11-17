const mongoose = require("mongoose");

const lawnDataSchema = new mongoose.Schema({
  Timestamp: { type: Date, default: Date.now },
  Metrics: {
    BatteryLevel: { type: Number, required: true },
    CurrentPowerUsage: { type: Number, required: true },
    CuttingBladeRPM: { type: Number, required: true },
    Speed: { type: Number, required: true },
    GrassHeight: { type: Number, required: true },
    AreaCovered: { type: Number, required: true },
    ProximityFrontSensor: { type: Number, required: true },
    ProximityRearSensor: { type: Number, required: true },
    ObstacleDetected: { type: Boolean, required: true },
    ErrorState: { type: String, default: null },
  },
});

module.exports = mongoose.model("LawnData", lawnDataSchema);
