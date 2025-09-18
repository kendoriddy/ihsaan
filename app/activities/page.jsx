"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import Layout from "@/components/Layout";
import { useFetch } from "@/hooks/useHttp/useHttp";
import CoursesList from "./components/courses-list";
import GradesArea from "./components/GradesArea";
import Loader from "@/components/Loader";
import animation from "../../assets/no_data.json";
import Lottie from "lottie-react";
import OtherGrades from "./components/OtherGrades";

const StudentInfoPage = () => {
  const [coursesOrGrade, setCoursesOrGrade] = useState("courses");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [studentId, setStudentId] = useState("");
  const [gradePageSize, setGradePageSize] = useState(null);
  const [manualGradePageSize, setManualGradePageSize] = useState(null);

  const fetchStudentId = () => {
    const storedStudentId = localStorage.getItem("userId");
    console.log("tutorIdStored", storedStudentId);
    if (storedStudentId) {
      setStudentId(storedStudentId);
    }
  };

  useEffect(() => {
    fetchStudentId();
  });

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
      ? `https://ihsaanlms.onrender.com/terms/?session__year=${selectedSession}`
      : null,
    (data) => {
      if (data?.total) {
        // You can handle data.total here if needed
      }
    }
  );

  const {
    isLoading: loadingGrade,
    data: Grades,
    refetch: refetchGrade,
    isFetching: isFetchingGrades,
  } = useFetch(
    ["grades", selectedSession, gradePageSize], // include pageSize in key
    selectedSession && selectedTerm
      ? `https://ihsaanlms.onrender.com/assessment/grades/?student=${studentId}${
          gradePageSize ? `&page_size=${gradePageSize}` : ""
        }`
      : null,
    (data) => {
      if (data?.total && !gradePageSize) {
        setGradePageSize(data.total);
      }
    }
  );

  const {
    isLoading: loadingManualGrade,
    data: manualGrades,
    refetch: refetchManualGrade,
    isFetching: isFetchingManualGrades,
  } = useFetch(
    ["grades", selectedSession, manualGradePageSize], // include pageSize in key
    selectedSession && selectedTerm
      ? `https://ihsaanlms.onrender.com/assessment/manual-grades/?${
          manualGradePageSize ? `&page_size=${manualGradePageSize}` : ""
        }`
      : null,
    (data) => {
      if (data?.total && !gradePageSize) {
        setGradePageSize(data.total);
      }
    }
  );

  const {
    isLoading: loadingCourses,
    data: StudentCourses,
    refetch: refetchCourses,
    isFetching: isFetchingCourses,
  } = useFetch(
    ["terms", selectedSession],
    selectedSession && selectedTerm
      ? `https://ihsaanlms.onrender.com/course/course-enrollments/?user_id=${studentId}`
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
            <button
              className={`px-4 py-2 font-medium ${
                coursesOrGrade === "other_grades"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setCoursesOrGrade("other_grades")}
            >
              Other Grades
            </button>
          </div>
        </div>
        <div>
          {!selectedSession || !selectedTerm ? (
            <div>
              <Lottie
                animationData={animation}
                loop
                autoPlay
                className="size-28"
              />
              <p className="text-red-700 font-medium">No Data!</p>
              <p className="animate-pulse">
                Please select session and term to see your academic activities
                for a specific year
              </p>
            </div>
          ) : isFetchingCourses ||
            isFetchingGrades ||
            isFetchingManualGrades ? (
            <div className="flex gap-2">
              <Loader size={20} />
              <p className="animate-pulse">
                Fetching your academic details for the selected year
              </p>
            </div>
          ) : (
            <>
              {coursesOrGrade === "courses" &&
                (StudentCourses?.data?.results?.length > 0 ? (
                  <CoursesList courses={StudentCourses.data} />
                ) : (
                  <div className="text-center py-8">
                    <Lottie
                      animationData={animation}
                      loop={false}
                      autoPlay
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="mt-4 text-gray-600">
                      You are not enrolled in any courses for this session &
                      term.
                    </p>
                  </div>
                ))}

              {coursesOrGrade === "grades" &&
                (Grades?.data?.results?.length > 0 ? (
                  <GradesArea grades={Grades.data.results} />
                ) : (
                  <div className="text-center py-8">
                    <Lottie
                      animationData={animation}
                      loop={false}
                      autoPlay
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="mt-4 text-gray-600">
                      No grades available for this session & term.
                    </p>
                  </div>
                ))}

              {coursesOrGrade === "other_grades" &&
                (manualGrades?.data?.results?.length > 0 ? (
                  <OtherGrades grades={manualGrades.data.results} />
                ) : (
                  <div className="text-center py-8">
                    <Lottie
                      animationData={animation}
                      loop={false}
                      autoPlay
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="mt-4 text-gray-600">
                      No extra/other grades available for this session & term.
                    </p>
                  </div>
                ))}
            </>
          )}
        </div>
      </>
    </Layout>
  );
};

export default StudentInfoPage;
