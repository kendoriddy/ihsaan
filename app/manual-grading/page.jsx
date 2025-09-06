"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CardContent,
  Typography,
  Card,
  Box,
} from "@mui/material";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useHttp/useHttp";
import SubmissionsList from "./components/SubmissionsList";

const ManualGrading = () => {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [fetchAll, setFetchAll] = useState(false);
  const [totalCourses, setTotalCourses] = useState(10);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  };

  const {
    isLoading,
    data: AssessmentsList,
    refetch,
  } = useFetch(
    "assessments",
    `https://ihsaanlms.onrender.com/assessment/base/?page_size=${
      fetchAll ? totalCourses : 10
    }`,
    (data) => {
      if (data?.total && !fetchAll) {
        setTotalCourses(data.total);
        setFetchAll(true);
        refetch();
      }
    }
  );

  const Assessments = AssessmentsList?.data?.results || [];

  const filteredAssessment = Assessments.filter(
    (assessment) => assessment.question_type !== "MCQ"
  );

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Assessment</InputLabel>
          <Select
            value={selectedAssessmentId}
            onChange={(e) => {
              const selectedAssessmentId = e.target.value;
              const selected = filteredAssessment.find(
                (a) => a.id === selectedAssessmentId
              );
              setSelectedAssessment(selected);
              setSelectedAssessmentId(selectedAssessmentId);
            }}
          >
            {filteredAssessment.length > 0 ? (
              filteredAssessment.map((assessment) => (
                <MenuItem key={assessment.id} value={assessment.id}>
                  <Box display="flex" flexDirection="column" width="100%">
                    <Typography variant="h6" fontWeight="bold">
                      {assessment.title}
                    </Typography>
                    <Card
                      variant="outlined"
                      sx={{
                        mt: 1,
                        p: 2,
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1" color="textSecondary">
                          <strong>Course:</strong> {assessment.course_title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Title:</strong> {assessment.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Type:</strong> {assessment.type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Description:</strong> {assessment.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Question Type:</strong>{" "}
                          {assessment.question_type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Max Score:</strong> {assessment.max_score}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Passing Score:</strong>{" "}
                          {assessment.passing_score}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Start Date:</strong>{" "}
                          {formatDate(assessment.start_date)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>End Date:</strong>{" "}
                          {formatDate(assessment.end_date)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No courses available</MenuItem>
            )}
          </Select>
        </FormControl>

        {selectedAssessmentId && (
          <SubmissionsList assessmentId={selectedAssessmentId} />
        )}
      </Box>
    </Layout>
  );
};

export default ManualGrading;
