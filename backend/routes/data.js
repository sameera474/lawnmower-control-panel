const express = require("express");
const LawnData = require("../models/LawnData"); // Assuming LawnData is the model

const router = express.Router();

// GET route to fetch the latest 50 lawn data entries
router.get("/realtime-data", async (req, res) => {
  try {
    const data = await LawnData.find().sort({ Timestamp: -1 }).limit(50); // Get the latest 50 entries
    res.json({ RealTimeLawnMowerData: data.reverse() }); // Return data
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});

module.exports = router;
