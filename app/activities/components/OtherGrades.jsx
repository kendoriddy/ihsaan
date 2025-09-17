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
} from "@mui/material";

const OtherGrades = ({ grades }) => {
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
            {grades.map((grade, index) => (
              <TableRow key={index}>
                <TableCell>{grade.course_code}</TableCell>
                <TableCell>{grade.course_title}</TableCell>
                <TableCell className="text-nowrap">{grade.score}</TableCell>
                <TableCell className="text-nowrap">
                  {grade.reason_name}
                </TableCell>
                <TableCell className="text-nowrap">{grade.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OtherGrades;
