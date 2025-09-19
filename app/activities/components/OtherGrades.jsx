"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";

const OtherGrades = ({
  grades,
  totalGrades = 0,
  onPageChange,
  isLoading = false,
  currentPage = 1,
}) => {
  const pageSize = 10;

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-medium md:font-semibold text-lg">
                Course Code
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Course Title
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Score
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Reason
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Feedback
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex items-center justify-center gap-2 py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="animate-pulse">Loading...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && grades.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No other grades found
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              grades.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>{grade.course_code}</TableCell>
                  <TableCell>{grade.course_title}</TableCell>
                  <TableCell className="text-nowrap">{grade.score}</TableCell>
                  <TableCell className="text-nowrap capitalize">
                    {grade.reason_name.toLowerCase()}
                  </TableCell>
                  <TableCell className="text-nowrap">{grade.details}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalGrades > pageSize && (
        <Pagination
          count={Math.ceil(totalGrades / pageSize)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      )}
    </div>
  );
};

export default OtherGrades;
