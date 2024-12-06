// src/components/Login.js
import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      const { token } = response.data;
      localStorage.setItem("token", token); // Store the token in localStorage

      // Redirect to the admin dashboard or protected page
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error logging in", error);
      alert("Invalid email or password");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password); // Call the login function on form submit
  };

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: 400,
        margin: "auto",
        backgroundColor: "#fff",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
