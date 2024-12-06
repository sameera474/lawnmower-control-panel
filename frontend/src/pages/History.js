import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/realtime-data`);
      setHistoryData(response.data.RealTimeLawnMowerData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Delete all data
  const deleteAllHistory = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/delete-all-history`);
      setHistoryData([]);
      alert("All history deleted successfully!");
    } catch (err) {
      console.error("Error deleting all history:", err);
      alert("Failed to delete all history!");
    }
  };

  // Delete single row
  const deleteRow = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/delete-history/${id}`);
      setHistoryData(historyData.filter((item) => item._id !== id));
      alert("Entry deleted successfully!");
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Failed to delete entry!");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        History
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
        <Button variant="contained" color="error" onClick={deleteAllHistory}>
          Delete All History
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Battery Level</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Current Power Usage</TableCell>
              <TableCell>Grass Height</TableCell>
              <TableCell>Obstacle Detected</TableCell>
              <TableCell>Error State</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  {new Date(item.Timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>{item.Metrics.BatteryLevel.toFixed(1)}%</TableCell>
                <TableCell>{item.Metrics.Speed.toFixed(2)} m/s</TableCell>
                <TableCell>
                  {item.Metrics.CurrentPowerUsage.toFixed(1)} W
                </TableCell>
                <TableCell>{item.Metrics.GrassHeight.toFixed(1)} cm</TableCell>
                <TableCell>
                  {item.Metrics.ObstacleDetected ? "Yes" : "No"}
                </TableCell>
                <TableCell>{item.Metrics.ErrorState || "None"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteRow(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default History;
