import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
} from "@mui/material";
import { useDarkMode } from "../DarkModeContext"; // Import Dark Mode Context
import product1 from "../images/product1.jpg";
import product2 from "../images/product2.jpg";
import product3 from "../images/product3.jpg";
import backgroundImage from "../images/HomePage.jpg"; // Ensure this file exists

const Home = () => {
  const { isDarkMode } = useDarkMode(); // Access Dark Mode state

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: isDarkMode ? "#e0e0e0" : "#000", // Text color based on dark mode
      }}
    >
      {/* Welcome Section */}
      <Box
        sx={{
          flex: 1,
          textAlign: "center",
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)", // Adjust background color
          padding: "40px 20px",
          borderRadius: "10px",
          margin: "40px",
        }}
      >
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Welcome to SAHKA
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: 2, fontSize: "1.2rem" }}
        >
          At Sahka, we redefine modern living with advanced home robotics.
          Explore our cutting-edge innovations designed to make everyday life
          more convenient, efficient, and connected.
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: 4, fontSize: "1.2rem" }}
        >
          Get started by learning more about us or creating an account to
          experience our robotic solutions firsthand.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#007bff",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Learn More About Our Products
        </Button>
      </Box>

      {/* Products Section */}
      <Box
        sx={{
          textAlign: "center",
          padding: "40px 20px",
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(255, 255, 255, 0.8)", // Adjust background color
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 4 }}>
          Our Products
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { src: product1, name: "Smart Vacuum" },
            { src: product2, name: "AI Lawn Mower" },
            { src: product3, name: "Home Security Bot" },
          ].map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  maxWidth: 300,
                  margin: "auto",
                  backgroundColor: isDarkMode ? "#333" : "#f8f9fa",
                  "&:hover": { transform: "scale(1.05)", transition: "0.4s" },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.src}
                  alt={product.name}
                />
                <CardContent>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: isDarkMode ? "#e0e0e0" : "#000", // Dynamic color for dark mode
                    }}
                  >
                    {product.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact Section */}
      <Box
        sx={{
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
          color: isDarkMode ? "#e0e0e0" : "#000",
          textAlign: "center",
          padding: "20px",
          marginTop: "auto",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Contact Us
        </Typography>
        <Container>
          <Typography>Email: info@sahka.com</Typography>
          <Typography>Phone: +123 456 7890</Typography>
          <Typography>Address: 123 Robotics Street, Tech City</Typography>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.9)" : "#f5f5f5",
          color: isDarkMode ? "#e0e0e0" : "#000",
          textAlign: "center",
          padding: "10px",
        }}
      >
        <Typography variant="body2">
          © 2024 LawnMower Dashboard. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
