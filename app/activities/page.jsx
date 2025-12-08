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

  // Pagination states
  const [gradesPage, setGradesPage] = useState(1);
  const [manualGradesPage, setManualGradesPage] = useState(1);
  const [totalGrades, setTotalGrades] = useState(0);
  const [totalManualGrades, setTotalManualGrades] = useState(0);

  const studentId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  // Reset pagination when session or term changes
  useEffect(() => {
    setGradesPage(1);
    setManualGradesPage(1);
  }, [selectedSession, selectedTerm]);

  const {
    isLoading: loadingSession,
    data: SessionData,
    refetch: refetchSession,
    isFetching: isFetchingSession,
  } = useFetch(
    "academicSession",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/academic-sessions/`,
    (data) => {
      if (data?.total) {
        // Handle session data if needed
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
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms/?session__year=${selectedSession}`
      : null,
    (data) => {
      if (data?.total) {
        // Handle terms data if needed
      }
    }
  );

  const {
    isLoading: loadingGrade,
    data: Grades,
    refetch: refetchGrade,
    isFetching: isFetchingGrades,
  } = useFetch(
    ["grades", selectedSession, selectedTerm, gradesPage],
    selectedSession && selectedTerm
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades/?student=${studentId}&page=${gradesPage}&page_size=10`
      : null,
    (data) => {
      if (data?.total) {
        setTotalGrades(data.total);
      }
    }
  );

  const {
    isLoading: loadingManualGrade,
    data: manualGrades,
    refetch: refetchManualGrade,
    isFetching: isFetchingManualGrades,
  } = useFetch(
    ["manual-grades", selectedSession, selectedTerm, manualGradesPage],
    selectedSession && selectedTerm
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades/?student=${studentId}&page=${manualGradesPage}&page_size=10`
      : null,
    (data) => {
      if (data?.total) {
        setTotalManualGrades(data.total);
      }
    }
  );

  const {
    isLoading: loadingCourses,
    data: StudentCourses,
    refetch: refetchCourses,
    isFetching: isFetchingCourses,
  } = useFetch(
    ["courses", selectedSession, selectedTerm],
    selectedSession && selectedTerm
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-enrollments/?user_id=${studentId}`
      : null,
    (data) => {
      if (data?.total) {
        // Handle courses data if needed
      }
    }
  );

  // Handle page changes
  const handleGradesPageChange = (newPage) => {
    setGradesPage(newPage);
  };

  const handleManualGradesPageChange = (newPage) => {
    setManualGradesPage(newPage);
  };

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
          {/* If session or term is missing */}
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
          ) : (
            <>
              {coursesOrGrade === "courses" && (
                <>
                  {isFetchingCourses && !studentId ? (
                    <div className="flex gap-2">
                      <Loader size={20} />
                      <p className="animate-pulse">
                        Fetching enrolled courses...
                      </p>
                    </div>
                  ) : StudentCourses?.data?.results?.length > 0 ? (
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
                  )}
                </>
              )}

              {coursesOrGrade === "grades" && (
                <>
                  {isFetchingGrades && !studentId ? (
                    <div className="flex gap-2">
                      <Loader size={20} />
                      <p className="animate-pulse">Fetching grades...</p>
                    </div>
                  ) : (
                    <GradesArea
                      grades={Grades?.data?.results || []}
                      totalGrades={totalGrades}
                      onPageChange={handleGradesPageChange}
                      isLoading={isFetchingGrades}
                      currentPage={gradesPage}
                    />
                  )}
                </>
              )}

              {coursesOrGrade === "other_grades" && (
                <>
                  {isFetchingManualGrades && !studentId ? (
                    <div className="flex gap-2">
                      <Loader size={20} />
                      <p className="animate-pulse">Fetching other grades...</p>
                    </div>
                  ) : (
                    <OtherGrades
                      grades={manualGrades?.data?.results || []}
                      totalGrades={totalManualGrades}
                      onPageChange={handleManualGradesPageChange}
                      isLoading={isFetchingManualGrades}
                      currentPage={manualGradesPage}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </>
    </Layout>
  );
};

export default StudentInfoPage;
