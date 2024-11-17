import React from "react";
import { Switch, FormControlLabel, TextField } from "@mui/material";

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
      <FormControlLabel control={<Switch />} label="Dark Mode" />
      <TextField
        label="Change GPS Settings"
        variant="outlined"
        margin="normal"
        fullWidth
      />
      <TextField
        label="Wi-Fi Settings"
        variant="outlined"
        margin="normal"
        fullWidth
      />
    </div>
  );
};

export default Settings;
