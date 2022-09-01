import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// move to Cal component...

export default function ResultTable({ onChange, tableData }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ fontSize: 22 }}>
              Return %
            </TableCell>
            <TableCell align="center" style={{ fontSize: 22 }}>
              APY %
            </TableCell>
            <TableCell align="center" style={{ fontSize: 22 }}>
              Sharpe Ratio
            </TableCell>
            <TableCell align="center" style={{ fontSize: 22 }}>
              Max Drawdown %
            </TableCell>
            <TableCell align="center" style={{ fontSize: 22 }}>
              Rebalance Frequency
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* // tableData.Return */}
          <TableCell
            align="center"
            onChange={onChange}
            style={{ fontSize: 22 }}
          >
            {tableData.Return}
          </TableCell>
          <TableCell
            align="center"
            onChange={onChange}
            style={{ fontSize: 22 }}
          >
            {tableData.APY}
          </TableCell>
          <TableCell
            align="center"
            onChange={onChange}
            style={{ fontSize: 22 }}
          >
            {tableData.Sharpe}
          </TableCell>
          <TableCell
            align="center"
            onChange={onChange}
            style={{ fontSize: 22 }}
          >
            {tableData.Drawdown}
          </TableCell>
          <TableCell
            align="center"
            onChange={onChange}
            style={{ fontSize: 22 }}
          >
            {tableData.frequency}
          </TableCell>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
