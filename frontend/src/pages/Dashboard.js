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
  FormControlLabel,
  Switch,
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
import ReactSpeedometer from "react-d3-speedometer";
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
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" }, // Responsive alignment
              alignItems: { xs: "center", sm: "flex-start" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  color="secondary"
                />
              }
              label="Dark Mode"
              labelPlacement="start"
              sx={{
                marginLeft: 0,
                textAlign: "center",
                justifyContent: "center",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={generateData}
              disabled={isCharging}
            >
              Generate Data
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/history")}
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
                onClick={guideToChargingStation}
              >
                Go to Charging Station
              </Button>
            )}
          </Box>
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

        {/* Speedometer */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              color: isDarkMode ? "#b0bec5" : "#000000",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Speed
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <ReactSpeedometer
                  maxValue={10}
                  value={latestMetrics.Speed || 0}
                  needleColor="red"
                  startColor="green"
                  endColor="red"
                  segments={5}
                  width={200}
                  height={150}
                />
              </Box>
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
