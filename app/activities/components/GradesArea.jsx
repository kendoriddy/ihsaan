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
    const course = grade.course_title;
    if (!grouped[course]) {
      grouped[course] = {
        quizScore: 0,
        quizMax: 0,
        assignmentScore: 0,
        assignmentMax: 0,
      };
    }

    if (grade.assessment_question_type === "MCQ") {
      grouped[course].quizScore += parseFloat(grade.score);
      grouped[course].quizMax += parseFloat(grade.assessment_max_score);
    }

    if (grade.assessment_question_type === "FILE_UPLOAD") {
      grouped[course].assignmentScore += parseFloat(grade.score);
      grouped[course].assignmentMax += parseFloat(grade.assessment_max_score);
    }
  });

  return grouped;
};

const GradesArea = ({ grades }) => {
  const groupedData = groupGradesByCourse(grades?.results);
  const groupedArray = Object.entries(groupedData);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-medium md:font-semibold text-lg">
                Course Name
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Quiz
              </TableCell>
              <TableCell className="font-medium md:font-semibold text-lg">
                Assignment
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedArray.map(([courseTitle, data], index) => (
              <TableRow key={index}>
                <TableCell>{courseTitle}</TableCell>
                <TableCell className="text-nowrap">
                  {data.quizScore.toFixed(2)} / {data.quizMax.toFixed(2)}
                </TableCell>
                <TableCell className="text-nowrap">
                  {data.assignmentScore.toFixed(2)} /{" "}
                  {data.assignmentMax.toFixed(2)}
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
