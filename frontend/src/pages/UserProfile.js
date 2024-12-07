import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useDarkMode } from "../DarkModeContext"; // Import dark mode context
import axios from "axios";
import { API_BASE_URL } from "../config";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        formData
      );
      setMessage(response.data.message);
      // Handle the successful response (e.g., show a message or navigate)
      console.log("User registered:", response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
      console.error("Error during signup:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setIsLoggedIn(true);
      setMessage("Login successful");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    setMessage("Logged out successfully");
  };

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#b0bec5" : "#000000",
      }}
    >
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {message && (
        <Alert severity={isLoggedIn ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {isLoggedIn ? (
        <Card sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Welcome, {user.name}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 4 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ maxWidth: 600, margin: "0 auto", mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Sign Up or Login</Typography>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={formData.email && formData.password}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignup}
                disabled={
                  !formData.name || !formData.email || !formData.password
                }
              >
                Sign Up
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogin}
                disabled={!formData.email || !formData.password}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UserProfile;
