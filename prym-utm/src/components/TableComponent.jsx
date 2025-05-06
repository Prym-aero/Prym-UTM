import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";

const TableComponent = ({ tableData }) => {
  const [loading, setLoading] = useState(true);
  console.log("Table data", tableData);
  // console.log("Table data", data);
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Drone</TableCell>
              <TableCell align="right">Serial Number</TableCell>
              <TableCell align="right">application</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((data, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {data.droneName}
                </TableCell>
                <TableCell align="right">{data.droneSerialNumber}</TableCell>
                <TableCell align="right">{data.application}</TableCell>
                <TableCell align="right">{data.location}</TableCell>
                <TableCell align="right">{data.droneStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableComponent;
