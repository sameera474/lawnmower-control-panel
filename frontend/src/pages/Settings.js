import React, { useState } from "react";
import { FormControlLabel, Switch, TextField, Button } from "@mui/material";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Settings</h1>
      <FormControlLabel
        control={
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        }
        label="Dark Mode"
      />
      <h3>Profile</h3>
      <TextField label="Name" fullWidth margin="normal" />
      <TextField label="Email" fullWidth margin="normal" disabled />
      <h3>Network Settings</h3>
      <TextField label="GPS Location" fullWidth margin="normal" />
      <TextField label="4G Settings" fullWidth margin="normal" />
      <TextField label="Wi-Fi Settings" fullWidth margin="normal" />
      <Button variant="contained" color="primary">
        Save Settings
      </Button>
    </div>
  );
};

export default Settings;
