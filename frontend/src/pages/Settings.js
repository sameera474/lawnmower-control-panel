import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    gpsLocation: "",
    fourGSettings: "",
    wifiSettings: "",
  });
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/settings`);
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error.message);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const updatedSettings = { ...settings, darkMode: isDarkMode };
      await axios.put(`${API_BASE_URL}/api/settings`, updatedSettings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error.message);
      alert("Failed to save settings!");
    }
  };

  const handleChange = (field, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <FormControlLabel
        control={<Switch checked={isDarkMode} onChange={toggleDarkMode} />}
        label="Dark Mode"
        sx={{ marginBottom: 2 }}
      />
      <Typography variant="h6" gutterBottom>
        Profile
      </Typography>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={settings.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={settings.email}
        disabled
      />
      <Typography variant="h6" gutterBottom>
        Network Settings
      </Typography>
      <TextField
        label="GPS Location"
        fullWidth
        margin="normal"
        value={settings.gpsLocation}
        onChange={(e) => handleChange("gpsLocation", e.target.value)}
      />
      <TextField
        label="4G Settings"
        fullWidth
        margin="normal"
        value={settings.fourGSettings}
        onChange={(e) => handleChange("fourGSettings", e.target.value)}
      />
      <TextField
        label="Wi-Fi Settings"
        fullWidth
        margin="normal"
        value={settings.wifiSettings}
        onChange={(e) => handleChange("wifiSettings", e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginTop: 2 }}
      >
        Save Settings
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/dashboard")}
        sx={{ marginTop: 2, marginLeft: 2 }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default Settings;
