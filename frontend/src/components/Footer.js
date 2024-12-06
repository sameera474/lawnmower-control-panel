import React from "react";
import { Box, Typography } from "@mui/material";
import { useDarkMode } from "../DarkModeContext";

const Footer = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <Box
      sx={{
        padding: 2,
        textAlign: "center",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5", // Dynamic background
        color: isDarkMode ? "#b0bec5" : "#000000", // Dynamic text color
        borderTop: isDarkMode ? "1px solid #444" : "1px solid #ccc", // Subtle border
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} LawnMower Dashboard. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
