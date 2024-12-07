import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import backgroundImage from "../images/HomePage.jpg"; // Use the same background image

const About = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundImage: `url(${backgroundImage})`, // Background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#333", // Fixed text color
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent background for readability
          color: "#000000",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "#007bff", // Title color
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            About Sahka
          </Typography>
          <Typography variant="body1" paragraph>
            Sahka is a pioneering Finnish technology company focused on
            transforming everyday living through innovation in home robotics.
            Our goal is to bring convenience, efficiency, and enhanced
            connectivity to households worldwide.
          </Typography>
          <Typography variant="body1" paragraph>
            With expertise in both hardware and software, we create seamless
            interactions between home robots and a full-stack software platform,
            integrating artificial intelligence and machine learning to deliver
            personalized and intuitive experiences.
          </Typography>
          <Typography variant="body1" paragraph>
            Sahka remains committed to quality, ethical responsibility, and
            sustainable practices, aiming to lead the global market in home
            robotics and shape the future of technology in households around the
            world.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default About;
