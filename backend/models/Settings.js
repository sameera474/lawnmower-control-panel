const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  darkMode: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  gpsLocation: { type: String, default: "" },
  fourGSettings: { type: String, default: "" },
  wifiSettings: { type: String, default: "" },
});

module.exports = mongoose.model("Settings", settingsSchema);
