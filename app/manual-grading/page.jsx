"use client";

import { Formik, Form, Field } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { usePost, useFetch } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { manualGradingSchema } from "@/components/validationSchemas/ValidationSchema";

const ManualGrading = () => {
  const [tutorId, setTutorId] = useState("");
  const [fetchAll, setFetchAll] = useState(false);
  const [totalCourses, setTotalCourses] = useState(10);

  const fetchTutorId = () => {
    const storedTutorId = localStorage.getItem("userId");
    console.log("tutorIdStored", storedTutorId);
    if (storedTutorId) {
      setTutorId(storedTutorId);
    }
  };

  useEffect(() => {
    fetchTutorId();
  });
  // Fetch courses
  const {
    isLoading,
    data: CoursesList,
    refetch,
  } = useFetch(
    "courses",
    `https://ihsaanlms.onrender.com/course/courses/?page_size=${
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

  const Courses = CoursesList?.data?.results || [];

  // usePost for form submission
  const { mutate: submitGrade, isLoading: submittingGrade } = usePost(
    "https://ihsaanlms.onrender.com/assessment/grades/"
  );

  const initialValues = {
    tutor: tutorId,
    level: "",
    course: "",
    student_name: "",
    feedback: "",
  };

  // Submit function
  const handleSubmit = (values, { resetForm }) => {
    console.log("tutorId", tutorId);
    submitGrade(values, {
      onSuccess: () => {
        toast.success("Assignment graded successfully");
        resetForm(); // Reset the form only when successful
        fetchTutorId();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to submit grading"
        );
      },
    });
  };

  return (
    <Layout>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={manualGradingSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            {/* level */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Level</InputLabel>
              <Field as={Select} name="type">
                <MenuItem value="Pry1">Primary One</MenuItem>
                <MenuItem value="GROUP">Group</MenuItem>
              </Field>
            </FormControl>

            {/* Course Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Course</InputLabel>
              <Field as={Select} name="course">
                {Courses.length > 0 ? (
                  Courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No courses available</MenuItem>
                )}
              </Field>
            </FormControl>

            {/* student */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Student Name"
              name="student_name"
              error={touched.student_name && Boolean(errors.student_name)}
              helperText={touched.student_name && errors.student_name}
            />

            {/* Reason */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Reason for Grading"
              name="feedback"
              type="number"
              error={touched.feedback && Boolean(errors.feedback)}
              helperText={touched.feedback && errors.feedback}
            />

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                color="secondary"
                disabled={submittingGrade}
                size="large"
              >
                {submittingGrade ? "Grading..." : "Grade"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default ManualGrading;
