import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Grid,
  Button,
  Snackbar,
} from "@mui/material";
import { Line } from "react-chartjs-2";
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
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";

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
  const [isGenerating, setIsGenerating] = useState(true);
  const [isCharging, setIsCharging] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const intervalRef = useRef(null);
  const chargingIntervalRef = useRef(null);

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/realtime-data`);
      const data = response.data.RealTimeLawnMowerData;
      setLawnData(data);
      const latest = data[data.length - 1]?.Metrics || {};
      setLatestMetrics(latest);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }, []);

  const generateData = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/generate-fake-data`);
      await fetchData();
      alert("Fake data generated successfully!");
    } catch (error) {
      console.error("Error generating data:", error.message);
      alert("Failed to generate fake data!");
    }
  };

  const stopGenerating = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsGenerating(false);
    }
  };

  const startGenerating = () => {
    if (!intervalRef.current) {
      setIsGenerating(true);
      fetchData();
      intervalRef.current = setInterval(fetchData, 5000);
    }
  };

  const guideToChargingStation = () => {
    stopGenerating();
    setIsCharging(true);

    chargingIntervalRef.current = setInterval(() => {
      setLatestMetrics((prevMetrics) => {
        const newBatteryLevel = Math.min(prevMetrics.BatteryLevel + 5, 100);
        if (newBatteryLevel >= 100) {
          clearInterval(chargingIntervalRef.current);
          setIsCharging(false);
          setSnackbarOpen(true);
        }
        return { ...prevMetrics, BatteryLevel: newBatteryLevel };
      });
    }, 1000);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    startGenerating();
  };

  useEffect(() => {
    startGenerating();
    return () => {
      stopGenerating();
      if (chargingIntervalRef.current)
        clearInterval(chargingIntervalRef.current);
    };
  }, [fetchData]);

  const chartData = React.useMemo(
    () => ({
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
          label: "Current Power Usage (W)",
          data: lawnData.map((item) => item.Metrics.CurrentPowerUsage),
          borderColor: "rgba(54,162,235,1)",
          backgroundColor: "rgba(54,162,235,0.2)",
          fill: true,
        },
      ],
    }),
    [lawnData]
  );

  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#b0bec5" : "#000000",
      }}
    >
      <Typography variant="h4" gutterBottom>
        LawnMower Dashboard
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={toggleDarkMode}
        sx={{ marginBottom: 2 }}
      >
        Toggle Dark Mode
      </Button>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={generateData}
            sx={{ marginRight: 2 }}
            disabled={isCharging}
          >
            Generate Data
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/history")}
            sx={{ marginRight: 2 }}
            disabled={isCharging}
          >
            Go to History
          </Button>
          {isGenerating && !isCharging ? (
            <Button
              variant="contained"
              color="error"
              onClick={stopGenerating}
              disabled={isCharging}
            >
              Stop Machine
            </Button>
          ) : (
            !isCharging && (
              <Button
                variant="contained"
                color="success"
                onClick={startGenerating}
              >
                Start Machine
              </Button>
            )
          )}
          {latestMetrics.BatteryLevel < 20 && !isCharging && (
            <Button
              variant="contained"
              color="warning"
              sx={{ marginLeft: 2 }}
              onClick={guideToChargingStation}
            >
              Go to Charging Station
            </Button>
          )}
        </Grid>

        {/* Battery Level */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              color: isDarkMode ? "#b0bec5" : "#000000",
            }}
          >
            <CardContent>
              <Typography variant="h6">Battery Level</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  marginTop: 2,
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={latestMetrics.BatteryLevel || 0}
                  sx={{
                    flexGrow: 1,
                    height: 10,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        latestMetrics.BatteryLevel > 50
                          ? "green"
                          : latestMetrics.BatteryLevel > 20
                          ? "orange"
                          : "red",
                    },
                  }}
                />
                <Typography variant="body1">
                  {latestMetrics.BatteryLevel?.toFixed(1) || 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Speed */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              color: isDarkMode ? "#b0bec5" : "#000000",
            }}
          >
            <CardContent>
              <Typography variant="h6">Speed</Typography>
              <Typography variant="h3" align="center">
                {latestMetrics.Speed?.toFixed(2) || 0} m/s
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Area Covered */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              color: isDarkMode ? "#b0bec5" : "#000000",
            }}
          >
            <CardContent>
              <Typography variant="h6">Area Covered</Typography>
              <Typography variant="h3" align="center">
                {latestMetrics.AreaCovered?.toFixed(2) || 0} m²
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Card
            sx={{
              backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              color: isDarkMode ? "#b0bec5" : "#000000",
            }}
          >
            <CardContent>
              <Typography variant="h6">Performance Metrics</Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Now Ready to Use"
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </Box>
  );
};

export default Dashboard;
