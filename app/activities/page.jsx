"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Layout from "@/components/Layout";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { Field } from "formik";
import CoursesList from "./components/courses-list";
import GradesArea from "./components/GradesArea";

const StudentInfoPage = () => {
  const [coursesOrGrade, setCoursesOrGrade] = useState("courses");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  const {
    isLoading: loadingSession,
    data: SessionData,
    refetch: refetchSession,
    isFetching: isFetchingSession,
  } = useFetch(
    "academicSession",
    `https://ihsaanlms.onrender.com/academic-sessions/`,
    (data) => {
      if (data?.total) {
        // setTotalSession(data.total);
      }
    }
  );

  const {
    isLoading: loadingTerm,
    data: TermData,
    refetch: refetchTerm,
    isFetching: isFetchingTerm,
  } = useFetch(
    ["terms", selectedSession],
    selectedSession
      ? `https://ihsaanlms.onrender.com/terms/?session_year=${selectedSession}`
      : null,
    (data) => {
      if (data?.total) {
        // You can handle data.total here if needed
      }
    }
  );

  const Terms = TermData?.data?.results || [];

  const Sessions = SessionData?.data?.results || [];

  return (
    <Layout>
      <div className="mb-8">
        <Typography variant="h5" className="my-4">
          Select session and term to get your Information
        </Typography>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          <FormControl fullWidth>
            <InputLabel>Session</InputLabel>
            <Select
              value={selectedSession}
              onChange={(e) => {
                setSelectedSession(e.target.value);
                setSelectedTerm("");
              }}
            >
              {Sessions.length > 0 ? (
                Sessions.map((session) => (
                  <MenuItem key={session.id} value={session.year}>
                    {session.year}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No sessions available</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Term</InputLabel>
            <Select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              disabled={!selectedSession}
            >
              {Terms.length > 0 ? (
                Terms.map((term) => (
                  <MenuItem
                    className="capitalize"
                    key={term.id}
                    value={term.id}
                  >
                    {term.name.toLowerCase()}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No terms available</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </div>
      <>
        <div className="flex justify- mb-6">
          <div className="flex gap-4 border-b border-gray-300">
            <button
              className={`px-4 py-2 font-medium ${
                coursesOrGrade === "courses"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setCoursesOrGrade("courses")}
            >
              Courses
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                coursesOrGrade === "grades"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setCoursesOrGrade("grades")}
            >
              Grades
            </button>
          </div>
        </div>
        {coursesOrGrade === "courses" && <CoursesList />}
        {coursesOrGrade === "grades" && <GradesArea />}
      </>
    </Layout>
  );
};

export default StudentInfoPage;
