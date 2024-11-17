import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [battery, setBattery] = useState(100);
  const [speed, setSpeed] = useState(0);
  const [chartData, setChartData] = useState([]);

  const fetchData = () => {
    axios
      .get(`${API_BASE_URL}/latest`)
      .then((response) => {
        const lawnData = response.data;

        // Update states
        setData(lawnData);
        setBattery(lawnData[0]?.batteryLevel || 0);
        setSpeed(lawnData[0]?.speed || 0);

        // Prepare data for charts
        const chartValues = lawnData.map((item) => ({
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
          powerUsage: item.powerUsage,
          bladeRPM: item.bladeRPM,
        }));

        setChartData(chartValues);
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const lineChartData = {
    labels: chartData.map((item) => item.timestamp),
    datasets: [
      {
        label: "Power Usage (W)",
        data: chartData.map((item) => item.powerUsage),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Blade RPM",
        data: chartData.map((item) => item.bladeRPM),
        fill: false,
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        LawnMower Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Battery Indicator */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Battery Level</Typography>
              <CircularProgress
                variant="determinate"
                value={battery}
                size={100}
                thickness={5}
                sx={{
                  color:
                    battery > 50 ? "green" : battery > 20 ? "orange" : "red",
                  margin: "20px auto",
                }}
              />
              <Typography variant="h6">{battery.toFixed(1)}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Speedometer */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Speed</Typography>
              <Typography variant="h3" color="primary">
                {speed.toFixed(2)} m/s
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Performance Metrics</Typography>
              <Line data={lineChartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
