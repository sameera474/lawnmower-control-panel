import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const History = () => {
  return (
    <div>
      <h1>History</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Battery Level</TableCell>
              <TableCell>Power Usage</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>2024-11-16 10:00</TableCell>
              <TableCell>80%</TableCell>
              <TableCell>55W</TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary">
                  Clear
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary">
        Clear All
      </Button>
    </div>
  );
};

export default History;
