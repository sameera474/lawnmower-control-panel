process.emitWarning = () => {}; // Suppresses all warnings

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt

const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Assuming you have a User model
const LawnData = require("./models/LawnData"); // Assuming you have LawnData model
const Settings = require("./models/Settings"); // Assuming you have Settings model
const authRoutes = require("./routes/auth"); // Import authentication routes
const dataRoutes = require("./routes/data"); // Import data routes
require("dotenv").config();

// Ensure critical environment variables are set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing in .env");
  process.exit(1);
}

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

const app = express();

// Dynamic CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*", // Allow multiple origins or "*" for all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Apply the CORS middleware

app.use(express.json());

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const mongooseConnection = await mongoose.connection;
    if (mongooseConnection.readyState === 1) {
      res.status(200).send("Database connected!");
    } else {
      res.status(500).send("Database not connected!");
    }
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

// Authentication Routes
app.use("/api/auth", authRoutes);

// Middleware for token verification
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

// User Authentication Routes
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password." });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful.", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
});

// User Routes
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile.", error });
  }
});

let lastBatteryLevel = 100;
let totalAreaCovered = 0;

// Function to generate fake data
const generateFakeData = async () => {
  const proximityFront = Math.random() * 2;
  const proximityRear = Math.random() * 2;
  const obstacleDetected = proximityFront < 0.5 || proximityRear < 0.5;
  const errorState = obstacleDetected ? "E01: Obstacle Detected" : null;

  lastBatteryLevel = Math.max(
    0,
    lastBatteryLevel - (Math.random() * 0.5 + 0.1)
  );
  if (lastBatteryLevel > 0) totalAreaCovered += Math.random();

  const fakeData = {
    Timestamp: new Date(),
    Metrics: {
      BatteryLevel: parseFloat(lastBatteryLevel.toFixed(1)),
      CurrentPowerUsage: Math.random() * 10 + 50,
      CuttingBladeRPM: Math.floor(Math.random() * 500 + 3000),
      Speed: parseFloat((Math.random() * 2).toFixed(2)),
      GrassHeight: parseFloat((Math.random() * 2 + 5).toFixed(1)),
      AreaCovered: parseFloat(totalAreaCovered.toFixed(1)),
      ProximityFrontSensor: parseFloat(proximityFront.toFixed(2)),
      ProximityRearSensor: parseFloat(proximityRear.toFixed(2)),
      ObstacleDetected: obstacleDetected,
      ErrorState: errorState,
    },
  };

  await LawnData.create(fakeData);

  if (lastBatteryLevel <= 0) {
    lastBatteryLevel = 100;
    totalAreaCovered = 0;
  }
};

let interval = setInterval(generateFakeData, 5000);

// API to manually generate fake data
app.post("/api/generate-fake-data", async (req, res) => {
  try {
    await generateFakeData();
    res.status(200).json({ message: "Fake data generated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop generating data
app.post("/api/stop-generating", (req, res) => {
  if (interval) {
    clearInterval(interval);
    interval = null;
    res.status(200).json({ message: "Data generation stopped." });
  } else {
    res.status(400).json({ message: "Data generation is not running." });
  }
});

// Start generating data
app.post("/api/start-generating", (req, res) => {
  if (!interval) {
    interval = setInterval(generateFakeData, 5000);
    res.status(200).json({ message: "Data generation started." });
  } else {
    res.status(400).json({ message: "Data generation is already running." });
  }
});

// API to fetch the latest 50 entries
app.get("/api/realtime-data", async (req, res) => {
  try {
    const data = await LawnData.find().sort({ Timestamp: -1 }).limit(50);
    res.json({ RealTimeLawnMowerData: data.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to fetch all history data
app.get("/api/history-data", async (req, res) => {
  try {
    const history = await LawnData.find().sort({ Timestamp: -1 });
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/delete-all-history", async (req, res) => {
  try {
    await LawnData.deleteMany({});
    res.status(200).json({ message: "All history deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/delete-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await LawnData.findByIdAndDelete(id);
    res.status(200).json({ message: "Entry deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get settings
app.get("/api/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        name: "Default User",
        email: "default@example.com",
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to update settings
app.put("/api/settings", async (req, res) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use routes
app.use("/api", dataRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
