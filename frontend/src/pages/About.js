import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useDarkMode } from "../DarkModeContext";

const About = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: isDarkMode ? "#121212" : "#f0f2f5",
        color: isDarkMode ? "#b0bec5" : "#333",
      }}
    >
      <Card
        sx={{
          maxWidth: 700,
          backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
          color: isDarkMode ? "#b0bec5" : "#000000",
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
              color: isDarkMode ? "#90caf9" : "#007bff",
              marginBottom: "15px",
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
