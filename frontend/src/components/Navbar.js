import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Check if the admin is logged in by verifying the presence of the token
  const isAdminLoggedIn = localStorage.getItem("adminToken");

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SAHKA
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        <Button color="inherit" component={Link} to="/settings">
          Settings
        </Button>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/user-profile">
          User Profile
        </Button>
        <Button color="inherit" component={Link} to="/history">
          History
        </Button>

        {/* Conditionally render the Admin Login button */}
        {!isAdminLoggedIn && (
          <Button color="inherit" component={Link} to="/admin-login">
            Admin Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
