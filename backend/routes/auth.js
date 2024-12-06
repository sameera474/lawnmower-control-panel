const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Assuming you have a User model
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Admin credentials (you can move these to environment variables in production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Change this to a strong password

// Admin login route
router.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;

  // Check if provided credentials match the hardcoded admin credentials
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Create JWT token for the admin
  const token = jwt.sign(
    { username: ADMIN_USERNAME, role: "admin" },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ message: "Admin login successful", token });
});

// Sign Up route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login route with JWT generation
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token with the user's role
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "1h", // Expiry time of 1 hour
      }
    );

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Middleware to verify JWT and check if user is an admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Check if the role is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized" });
    }

    req.user = user; // Attach user info to the request
    next(); // Continue to the next route handler
  });
};

// Admin Dashboard (Protected Route)
router.get("/admin-dashboard", verifyAdmin, (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to the admin dashboard", user: req.user });
});

router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id); // Delete user by ID
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

module.exports = router;
