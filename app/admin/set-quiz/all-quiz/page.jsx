"use client";
import React, { useState, useEffect } from "react";
import { useFetch, useDelete } from "@/hooks/useHttp/useHttp";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Button as MuiButton,
} from "@mui/material";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import EditQuizQuestion from "../components/EditQuiz";
import AdminLayout from "@/components/AdminLayout";
import parse from "html-react-parser";
import { Delete, Edit, Search, Clear } from "@mui/icons-material";
import Link from "next/link";

const AllQuiz = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    course: "",
    course_section: "",
  });
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [fetchAllCourses, setFetchAllCourses] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);

  // Fetch courses for filter
  const { data: coursesData, isLoading: coursesLoading } = useFetch(
    "courses",
    `https://ihsaanlms.onrender.com/course/courses/?page_size=${
      fetchAllCourses ? totalCourses : 10
    }`,
    (data) => {
      if (data?.total && !fetchAllCourses) {
        setTotalCourses(data.total);
        setFetchAllCourses(true);
      }
    }
  );

  // Fetch course sections for selected course
  const { data: courseSectionsData, isLoading: sectionsLoading } = useFetch(
    "courseSections",
    selectedCourseId
      ? `https://ihsaanlms.onrender.com/course/course-sections/?course=${selectedCourseId}`
      : null
  );

  const courses = coursesData?.data?.results || [];
  const courseSections = courseSectionsData?.data?.results || [];

  // Build API URL with filters
  const buildApiUrl = () => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcquestions/`;
    const params = new URLSearchParams();

    params.append("page_size", "15");
    params.append("page", page.toString());

    if (filters.search) params.append("search", filters.search);
    if (filters.course) params.append("course", filters.course);
    if (filters.course_section)
      params.append("course_section", filters.course_section);

    return `${baseUrl}?${params.toString()}`;
  };

  const { isLoading, data, refetch, isFetching } = useFetch(
    ["questions", page, filters],
    buildApiUrl(),
    (data) => {
      if (data?.total) {
        setTotalQuestions(data.total);
      }
    }
  );

  const questions = data?.data?.results || [];

  // DELETE QUESTION
  const { mutate: questionDelete, isLoading: isDeleting } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcquestions`,
    {
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries("questions");
        setOpenDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    }
  );

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDelete = () => {
    if (selectedQuestion?.id) {
      questionDelete(`${selectedQuestion.id}/`);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterName) => (event) => {
    const value = event.target.value;
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handleCourseChange = (event) => {
    const courseId = event.target.value;
    setSelectedCourseId(courseId);
    setFilters((prev) => ({
      ...prev,
      course: courseId,
      course_section: "", // Reset course section when course changes
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      course: "",
      course_section: "",
    });
    setSelectedCourseId("");
    setPage(1);
  };

  return (
    <AdminLayout>
      <div>
        <Link href="/admin/set-quiz" className="mb-6">
          <Button variant="outlined">Back</Button>
        </Link>

        {/* Filters Section */}
        <Box className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Questions"
                value={filters.search}
                onChange={handleFilterChange("search")}
                placeholder="Search by question text..."
                InputProps={{
                  endAdornment: <Search />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={filters.course}
                  onChange={handleCourseChange}
                  disabled={coursesLoading}
                  label="Course"
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Course Section</InputLabel>
                <Select
                  value={filters.course_section}
                  onChange={handleFilterChange("course_section")}
                  disabled={sectionsLoading || !selectedCourseId}
                  label="Course Section"
                >
                  <MenuItem value="">All Sections</MenuItem>
                  {courseSections.map((section) => (
                    <MenuItem key={section.id} value={section.id}>
                      {section.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <MuiButton
                variant="outlined"
                onClick={clearFilters}
                startIcon={<Clear />}
                fullWidth
              >
                Clear Filters
              </MuiButton>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Correct Answer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetching && (
                <div className="flex pl-6 py-3 items-center justify-center gap-2">
                  <Loader />
                  <p className="animate-pulse">Loading...</p>
                </div>
              )}
              {!isFetching && (
                <>
                  {questions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell>{parse(question.question_text)}</TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        {Object.entries(question.options).map(
                          ([key, value]) => (
                            <div key={key} className="text-nowrap">
                              <strong>{key}:</strong>
                              {parse(value)}
                            </div>
                          )
                        )}
                      </TableCell>
                      <TableCell>{question.correct_answer}</TableCell>
                      <TableCell className="flex flex-col md:flex-row items-center justify-center gap-3">
                        <Button
                          color="secondary"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setOpenUpdateModal(true);
                          }}
                        >
                          <Edit />
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedQuestion(question);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(totalQuestions / 15)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />

        {/* Delete Confirmation Modal */}
        <CustomModal
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          title="Confirm Delete"
          onConfirm={handleDelete}
          confirmText="Delete"
          isLoading={isDeleting}
        >
          <p>Are you sure you want to delete this question?</p>
        </CustomModal>

        {/* Update Question Modal */}
        <EditQuizQuestion
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          selectedQuestion={selectedQuestion}
          refetchQuestions={() => refetch()}
        />
      </div>
    </AdminLayout>
  );
};

export default AllQuiz;
