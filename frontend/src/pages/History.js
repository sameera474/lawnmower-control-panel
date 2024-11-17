import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../api";

const History = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/latest`)
      .then((response) => setData(response.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const clearRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setData([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>History</h1>
      <Button variant="contained" color="secondary" onClick={clearAll}>
        Clear All
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Battery Level</TableCell>
              <TableCell>Speed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>{item.batteryLevel.toFixed(1)}%</TableCell>
                <TableCell>{item.speed.toFixed(2)} m/s</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => clearRow(index)}
                  >
                    Clear
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default History;
