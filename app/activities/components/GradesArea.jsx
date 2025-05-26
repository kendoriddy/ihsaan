import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const GradesArea = () => {
  return (
    <div>
      {" "}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Academic Year</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {isFetching && (
              <div className="flex pl-6 py-3 items-center justify-center gap-2">
                <Loader />
                <p className="animate-pulse">Loading...</p>
              </div>
            )} */}
            {/* {!isFetching && ( */}
            <>
              <TableRow key={year.id}>
                <TableCell>{year.year}</TableCell>
                <TableCell>{year.start_date}</TableCell>
                <TableCell>{year.end_date}</TableCell>
              </TableRow>
            </>
            {/* )} */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GradesArea;
