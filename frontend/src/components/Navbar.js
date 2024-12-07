import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SAHKA
        </Typography>

        {/* For larger screens */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ textTransform: "uppercase" }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{ textTransform: "uppercase" }}
          >
            About
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/settings"
            sx={{ textTransform: "uppercase" }}
          >
            Settings
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/dashboard"
            sx={{ textTransform: "uppercase" }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/user-profile"
            sx={{ textTransform: "uppercase" }}
          >
            User Profile
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/history"
            sx={{ textTransform: "uppercase" }}
          >
            History
          </Button>
        </Box>

        {/* For smaller screens */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: "100%", // Make the dropdown full width
                left: 0, // Align it to the left edge of the screen
                top: "64px", // Position it just below the AppBar
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <MenuItem
                component={Link}
                to="/"
                onClick={handleMenuClose}
                sx={{
                  textTransform: "uppercase",
                  justifyContent: "center",
                  width: "100%", // Full width
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Add hover effect
                  },
                }}
              >
                Home
              </MenuItem>
              <MenuItem
                component={Link}
                to="/about"
                onClick={handleMenuClose}
                sx={{
                  textTransform: "uppercase",
                  justifyContent: "center",
                  width: "100%", // Full width
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Add hover effect
                  },
                }}
              >
                About
              </MenuItem>
              <MenuItem
                component={Link}
                to="/settings"
                onClick={handleMenuClose}
                sx={{
                  textTransform: "uppercase",
                  justifyContent: "center",
                  width: "100%", // Full width
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Add hover effect
                  },
                }}
              >
                Settings
              </MenuItem>
              <MenuItem
                component={Link}
                to="/dashboard"
                onClick={handleMenuClose}
                sx={{
                  textTransform: "uppercase",
                  justifyContent: "center",
                  width: "100%", // Full width
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Add hover effect
                  },
                }}
              >
                Dashboard
              </MenuItem>
              <MenuItem
                component={Link}
                to="/user-profile"
                onClick={handleMenuClose}
                sx={{
                  textTransform: "uppercase",
                  justifyContent: "center",
                  width: "100%", // Full width
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Add hover effect
                  },
                }}
              >
                User Profile
              </MenuItem>
              <MenuItem
                component={Link}
                to="/history"
                onClick={handleMenuClose}
                sx={{
                  textTransform: "uppercase",
                  justifyContent: "center",
                  width: "100%", // Full width
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // Add hover effect
                  },
                }}
              >
                History
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
