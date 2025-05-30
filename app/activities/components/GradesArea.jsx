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

const groupGradesByCourse = (grades) => {
  const grouped = {};

  grades.forEach((grade) => {
    const courseTitle = grade?.course_title;
    const courseCode = grade?.course_code;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = {
        courseCode,
        quizScore: 0,
        quizMax: 0,
        individualAssignmentScore: 0,
        individualAssignmentMax: 0,
        groupAssignmentScore: 0,
        groupAssignmentMax: 0,
      };
    }

    if (grade.assessment_question_type === "MCQ") {
      grouped[courseTitle].quizScore += parseFloat(grade.score);
      grouped[courseTitle].quizMax += parseFloat(grade.assessment_max_score);
    }

    if (grade.assessment_question_type === "FILE_UPLOAD") {
      if (grade.assessment_type === "INDIVIDUAL") {
        grouped[courseTitle].individualAssignmentScore += parseFloat(
          grade.score
        );
        grouped[courseTitle].individualAssignmentMax += parseFloat(
          grade.assessment_max_score
        );
      } else if (grade.assessment_type === "GROUP") {
        grouped[courseTitle].groupAssignmentScore += parseFloat(grade.score);
        grouped[courseTitle].groupAssignmentMax += parseFloat(
          grade.assessment_max_score
        );
      }
    }
  });

  return grouped;
};

const GradesArea = ({ grades }) => {
  const groupedData = groupGradesByCourse(grades?.results || []);
  const groupedArray = Object.entries(groupedData);

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
                Quiz
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Individual Assignment
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Group Assignment
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedArray.map(([courseTitle, data], index) => (
              <TableRow key={index}>
                <TableCell>{data.courseCode}</TableCell>
                <TableCell>{courseTitle}</TableCell>
                <TableCell className="text-nowrap">
                  {data.quizScore.toFixed(2)} / {data.quizMax.toFixed(2)}
                </TableCell>
                <TableCell className="text-nowrap">
                  {data.individualAssignmentScore.toFixed(2)} /{" "}
                  {data.individualAssignmentMax.toFixed(2)}
                </TableCell>
                <TableCell className="text-nowrap">
                  {data.groupAssignmentScore.toFixed(2)} /{" "}
                  {data.groupAssignmentMax.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GradesArea;
