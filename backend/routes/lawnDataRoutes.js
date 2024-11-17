const express = require("express");
const LawnData = require("../models/LawnmowerData");

const router = express.Router();

// Fetch all data
router.get("/", async (req, res) => {
  try {
    const data = await LawnData.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all data
router.delete("/", async (req, res) => {
  try {
    await LawnData.deleteMany({});
    res.status(200).json({ message: "All data cleared." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
