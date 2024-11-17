const express = require("express");
const LawnData = require("../models/LawnData");

const router = express.Router(); // Initialize the router

// Fetch the latest data
router.get("/latest", async (req, res) => {
  try {
    const latestData = await LawnData.find().sort({ timestamp: -1 }).limit(10); // Fetch the 10 most recent entries
    res.status(200).json(latestData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Export the router to be used in server.js
