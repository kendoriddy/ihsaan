"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import Button from "@/components/Button";
import { usePost, useFetch, usePatch } from "@/hooks/useHttp/useHttp";
import { manualGradeSchema } from "@/components/validationSchemas/ValidationSchema";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ManualGradeForm = ({
  grade = null,
  isEdit = false,
  onClose,
  onSuccess,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState(grade?.course || "");

  // 1. Fetch Courses
  const {
    isLoading: loadingCourses,
    data: coursesData,
  } = useFetch(
    ["courses"],
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/`
  );
  const courses = coursesData?.data?.results || [];

  // 2. Fetch Reasons
  const {
    isLoading: loadingReasons,
    data: reasonsData,
  } = useFetch(
    ["reasons"],
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/reason-options/`
  );
  const reasons = reasonsData?.data?.results || [];

  // 3. Fetch enrolled students
  // Simplified configuration to resolve the "success is not a function" type error
  const {
    data: studentsData,
    isFetching: isFetchingStudents,
    isError: studentFetchError,
  } = useFetch(
    ["course-students", selectedCourseId],
    selectedCourseId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/${selectedCourseId}/enrolled_students/`
      : null
  );

  const students = studentsData?.data?.students || [];

  // Mutations
  const { mutate: createManualGrade, isLoading: isCreating } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades/`
  );

  const { mutate: updateManualGrade, isLoading: isUpdating } = usePatch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades/${grade?.id}/`
  );

  const initialValues = {
    course: grade?.course || "",
    student: grade?.student || "",
    reason: grade?.reason || "",
    details: grade?.details || "",
    score: grade?.score || "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const submitData = {
      ...values,
      score: parseFloat(values.score),
    };

    const onSuccessCallback = () => {
      Swal.fire({
        title: `Manual grade ${isEdit ? "updated" : "created"} successfully`,
        icon: "success",
        customClass: { confirmButton: "my-confirm-btn" },
      });
      if (!isEdit) resetForm();
      onSuccess?.();
    };

    const onErrorCallback = (error) => {
      const errorData = error.response?.data;
      if (typeof errorData === "string") {
        Swal.fire({
          title: errorData,
          icon: "error",
          customClass: { confirmButton: "my-confirm-btn" },
        });
      } else if (errorData && typeof errorData === "object") {
        const messages = Object.values(errorData)
          .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
          .join(" ");
        toast.error(messages || "An error occurred");
      } else {
        toast.error(`Failed to ${isEdit ? "update" : "create"} manual grade`);
      }
    };

    if (isEdit) {
      updateManualGrade(submitData, { onSuccess: onSuccessCallback, onError: onErrorCallback });
    } else {
      createManualGrade(submitData, { onSuccess: onSuccessCallback, onError: onErrorCallback });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Box sx={{ pt: 2 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={manualGradeSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, setFieldValue }) => {
          // If no students are found after fetching, show "No students"
          const noStudentsFound = !isFetchingStudents && selectedCourseId && students.length === 0;

          return (
            <Form>
              {/* Course Selector */}
              <FormControl fullWidth margin="normal" error={touched.course && Boolean(errors.course)}>
                <InputLabel>Course</InputLabel>
                <Field
                  as={Select}
                  name="course"
                  disabled={isEdit}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue("course", val);
                    setFieldValue("student", ""); 
                    setSelectedCourseId(val); 
                  }}
                >
                  <MenuItem value="" disabled>
                    {loadingCourses ? "Fetching courses..." : "Select course"}
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Field>
                {touched.course && errors.course && (
                  <div className="text-red-500 text-sm mt-1">{errors.course}</div>
                )}
              </FormControl>

              {/* Student Selector */}
              <FormControl 
                fullWidth 
                margin="normal" 
                error={touched.student && (Boolean(errors.student) || noStudentsFound)}
              >
                <InputLabel>Student</InputLabel>
                <Field
                  as={Select}
                  name="student"
                  disabled={!selectedCourseId || isEdit} 
                >
                  {isFetchingStudents ? (
                    <MenuItem value="" disabled>Loading students...</MenuItem>
                  ) : students.length > 0 ? (
                    students.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.fullname}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      {selectedCourseId 
                        ? (studentFetchError ? "Error fetching students" : "No student assigned to this course") 
                        : "Select a course first"}
                    </MenuItem>
                  )}
                </Field>
                {(touched.student && errors.student) || noStudentsFound ? (
                  <div className="text-red-500 text-sm mt-1">
                    {noStudentsFound ? "Please select a course that has enrolled students." : errors.student}
                  </div>
                ) : null}
              </FormControl>

              {/* Reason Selector */}
              <FormControl fullWidth margin="normal" error={touched.reason && Boolean(errors.reason)}>
                <InputLabel>Reason</InputLabel>
                <Field as={Select} name="reason">
                  <MenuItem value="" disabled>Select reason</MenuItem>
                  {reasons.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.description}
                    </MenuItem>
                  ))}
                </Field>
                {touched.reason && errors.reason && (
                  <div className="text-red-500 text-sm mt-1">{errors.reason}</div>
                )}
              </FormControl>

              {/* Score Field */}
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                type="number"
                label="Score"
                name="score"
                error={touched.score && Boolean(errors.score)}
                helperText={touched.score && errors.score}
              />

              {/* Details Field */}
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                multiline
                rows={3}
                label="Details"
                name="details"
                error={touched.details && Boolean(errors.details)}
                helperText={touched.details && errors.details}
              />

              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" color="secondary" variant="outlined" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || noStudentsFound} 
                  color="primary"
                >
                  {isLoading ? "Processing..." : isEdit ? "Update Grade" : "Create Grade"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ManualGradeForm;