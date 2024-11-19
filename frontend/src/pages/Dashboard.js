import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
} from "@mui/material";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [lawnData, setLawnData] = useState([]);
  const [latestMetrics, setLatestMetrics] = useState({});
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/realtime-data`);
      const data = response.data.RealTimeLawnMowerData;
      setLawnData(data);
      setLatestMetrics(data[data.length - 1]?.Metrics || {});
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }, [API_BASE_URL]);

  // Generate new fake data
  const generateData = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/generate-fake-data`);
      alert("Fake data generated successfully!");
      fetchData(); // Refresh data after generating new data
    } catch (error) {
      console.error("Error generating data:", error.message);
      alert("Failed to generate fake data!");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [fetchData]); // Include fetchData as a dependency

  const chartData = {
    labels: lawnData.map((item) =>
      new Date(item.Timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Battery Level (%)",
        data: lawnData.map((item) => item.Metrics.BatteryLevel),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
      },
      {
        label: "Cutting Blade RPM",
        data: lawnData.map((item) => item.Metrics.CuttingBladeRPM),
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        fill: true,
      },
      {
        label: "Current Power Usage (W)",
        data: lawnData.map((item) => item.Metrics.CurrentPowerUsage),
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,0.2)",
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        LawnMower Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Battery Level */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Battery Level</Typography>
              <CircularProgress
                variant="determinate"
                value={latestMetrics.BatteryLevel || 0}
                size={100}
                thickness={5}
                sx={{
                  color:
                    latestMetrics.BatteryLevel > 50
                      ? "green"
                      : latestMetrics.BatteryLevel > 20
                      ? "orange"
                      : "red",
                }}
              />
              <Typography variant="h6">
                {latestMetrics.BatteryLevel?.toFixed(1) || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Speed */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Speed</Typography>
              <Typography variant="h3" color="primary">
                {latestMetrics.Speed?.toFixed(2) || 0} m/s
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Area Covered */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Area Covered</Typography>
              <Typography variant="h3" color="primary">
                {latestMetrics.AreaCovered?.toFixed(2) || 0} m²
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Generate Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={generateData}
            sx={{ marginBottom: 2 }}
          >
            Generate Data
          </Button>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Performance Metrics</Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Data Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Data</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Battery Level</TableCell>
                      <TableCell>Speed</TableCell>
                      <TableCell>Current Power Usage</TableCell>
                      <TableCell>Area Covered</TableCell>
                      <TableCell>Obstacle Detected</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lawnData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {new Date(item.Timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {item.Metrics.BatteryLevel.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          {item.Metrics.Speed.toFixed(2)} m/s
                        </TableCell>
                        <TableCell>
                          {item.Metrics.CurrentPowerUsage.toFixed(1)} W
                        </TableCell>
                        <TableCell>
                          {item.Metrics.AreaCovered.toFixed(2)} m²
                        </TableCell>
                        <TableCell>
                          {item.Metrics.ObstacleDetected ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
