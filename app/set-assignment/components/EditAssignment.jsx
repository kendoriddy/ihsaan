"use client";
import CustomModal from "@/components/CustomModal";
import React, { useState, useEffect } from "react";
import { usePatch, useFetch } from "@/hooks/useHttp/useHttp";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import DatePickers from "@/components/validation/DatePicker";
import { Form, Formik } from "formik";

const EditAssignmentQuestion = ({
  setOpenUpdateModal,
  openUpdateModal,
  selectedAssignment,
  refetchQuestions,
}) => {
  const [editedAssignment, setEditedAssignment] = useState({
    title: selectedAssignment?.title || "",
    description: selectedAssignment?.description || "",
    type: selectedAssignment?.type || "",
    question_type: selectedAssignment?.question_type || "",
    max_score: selectedAssignment?.max_score || "",
    course: selectedAssignment?.course || "",
    max_attempts: selectedAssignment?.max_attempts || "",
    passing_score: selectedAssignment?.passing_score || "",
    start_date: selectedAssignment?.start_date || "",
    end_date: selectedAssignment?.end_date || "",
    grade_release_date: selectedAssignment?.grade_release_date || "",
  });

  // Fetch courses dynamically
  const [fetchAll, setFetchAll] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);

  const {
    isLoading: isLoadingCourses,
    data: CoursesList,
    isFetching: isFetchingCourses,
    refetch: refetchCourses,
  } = useFetch(
    "courses",
    `https://ihsaanlms.onrender.com/course/courses/?page_size=${
      fetchAll ? totalCourses : 10
    }`,
    (data) => {
      if (data?.total && !fetchAll) {
        setTotalCourses(data.total);
        setFetchAll(true);
        refetchCourses();
      }
    }
  );

  const Courses = CoursesList?.data?.results || [];

  // Update function with body
  const { mutate: updateQuestion, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/assessment/base/${selectedAssignment?.id}/`,
    {
      onSuccess: () => {
        toast.success("Quiz question updated successfully");
        setOpenUpdateModal(false);
        refetchQuestions();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
      },
    }
  );

  // Update form state when selectedAssignment changes
  useEffect(() => {
    if (selectedAssignment) {
      setEditedAssignment({
        title: selectedAssignment.title || "",
        description: selectedAssignment.description || "",
        type: selectedAssignment.type || "",
        question_type: selectedAssignment.question_type || "",
        max_score: selectedAssignment.max_score || "",
        course: selectedAssignment.course || "",
        max_attempts: selectedAssignment.max_attempts || "",
        passing_score: selectedAssignment.passing_score || "",
        start_date: selectedAssignment.start_date || "",
        end_date: selectedAssignment.end_date || "",
        grade_release_date: selectedAssignment.grade_release_date || "",
      });
    }
  }, [selectedAssignment]);

  // Function to handle form submission
  const handleUpdateSubmit = () => {
    updateQuestion(editedAssignment);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAssignment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Options for dropdowns
  const questionTypeOptions = [
    { value: "FILE_UPLOAD", label: "File Upload" },
    { value: "MANUAL", label: "Manual Grading" },
  ];

  const typeOptions = [
    { value: "INDIVIDUAL", label: "Individual" },
    { value: "GROUP", label: "Group" },
  ];

  return (
    <div>
      <CustomModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        title="Update Question"
        onConfirm={handleUpdateSubmit}
        confirmText={isUpdating ? "Updating..." : "Update"}
        isLoading={isUpdating}
      >
        <Formik>
          <Form>
            <div className="space-y-4 mt-2">
              {/* Title */}
              <TextField
                label="Title"
                name="title"
                value={editedAssignment.title}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={isUpdating}
              />

              {/* Description */}
              <TextField
                label="Description"
                name="description"
                value={editedAssignment.description}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                disabled={isUpdating}
              />

              {/* Type Dropdown */}
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  name="type"
                  value={editedAssignment.type}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                >
                  {typeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Question Type Dropdown */}
              <FormControl fullWidth variant="outlined">
                <InputLabel>Question Type</InputLabel>
                <Select
                  label="Question Type"
                  name="question_type"
                  value={editedAssignment.question_type}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                >
                  {questionTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Max Score */}
              <TextField
                label="Max Score"
                name="max_score"
                type="number"
                value={editedAssignment.max_score}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={isUpdating}
              />

              {/* Course Dropdown */}
              <FormControl fullWidth variant="outlined">
                <InputLabel>Course</InputLabel>
                <Select
                  label="Course"
                  name="course"
                  value={editedAssignment.course}
                  onChange={handleInputChange}
                  disabled={isUpdating || isLoadingCourses || isFetchingCourses}
                >
                  <MenuItem value="">
                    <em>Select a course</em>
                  </MenuItem>
                  {Courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name || course.title}{" "}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Max Attempts */}
              <TextField
                label="Max Attempts"
                name="max_attempts"
                type="number"
                value={editedAssignment.max_attempts}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={isUpdating}
              />

              {/* Passing Score */}
              <TextField
                label="Passing Score"
                name="passing_score"
                type="number"
                value={editedAssignment.passing_score}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={isUpdating}
              />

              {/* Start Date */}
              <DatePickers
                name="start_date"
                placeholder="Start Date"
                value={editedAssignment.start_date}
                onChange={(newDate) =>
                  setEditedAssignment((prev) => ({
                    ...prev,
                    start_date: newDate,
                  }))
                }
              />

              {/* End Date */}
              <DatePickers
                name="end_date"
                placeholder="End Date"
                value={editedAssignment.end_date}
                onChange={(newDate) =>
                  setEditedAssignment((prev) => ({
                    ...prev,
                    end_date: newDate,
                  }))
                }
              />

              {/* Grade Release Date */}
              <DatePickers
                name="grade_release_date"
                placeholder="Grade Release Date"
                value={editedAssignment.grade_release_date}
                onChange={(newDate) =>
                  setEditedAssignment((prev) => ({
                    ...prev,
                    grade_release_date: newDate,
                  }))
                }
              />
            </div>
          </Form>
        </Formik>
      </CustomModal>
    </div>
  );
};

export default EditAssignmentQuestion;
