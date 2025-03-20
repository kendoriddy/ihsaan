"use client";

import { Formik, Form, Field } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { addAssignmentSchema } from "@/components/validationSchemas/ValidationSchema";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import DatePickers from "@/components/validation/DatePicker";
import { useState, useEffect } from "react";
import { usePost, useFetch } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";

const CreateAssignment = () => {
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
  const { mutate: submitAssignment, isLoading: submittingAssignment } = usePost(
    "https://ihsaanlms.onrender.com/assessment/base/"
  );

  const initialValues = {
    title: "",
    description: "",
    type: "INDIVIDUAL",
    question_type: "Select a Type",
    max_score: "",
    passing_score: "",
    tutor: tutorId,
    course: "",
    term: "",
    max_attempts: "",
    start_date: "",
    end_date: "",
    grade_release_date: "",
  };

  // Submit function
  const handleSubmit = (values, { resetForm }) => {
    console.log("tutorId", tutorId);
    submitAssignment(values, {
      onSuccess: () => {
        toast.success("Assignment created successfully");
        resetForm(); // Reset the form only when successful
        fetchTutorId();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to submit quiz");
      },
    });
  };

  return (
    <Layout>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={addAssignmentSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            {/* Title */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
            />

            {/* Description */}
            <Field
              as={TextField}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              label="Description"
              name="description"
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            {/* Type */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Field as={Select} name="type">
                <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                <MenuItem value="GROUP">Group</MenuItem>
              </Field>
            </FormControl>

            {/* Question Type */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Question Type</InputLabel>
              <Field as={Select} name="question_type">
                {/* <MenuItem value="MCQ">MCQ</MenuItem> */}
                <MenuItem value="FILE_UPLOAD">File Upload</MenuItem>
                {/* <MenuItem value="DIRECT_TYPING">Essay</MenuItem> */}
              </Field>
            </FormControl>

            {/* Max Score */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Max Score"
              name="max_score"
              type="number"
              error={touched.max_score && Boolean(errors.max_score)}
              helperText={touched.max_score && errors.max_score}
            />

            {/* Passing Score */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Passing Score"
              name="passing_score"
              type="number"
              error={touched.passing_score && Boolean(errors.passing_score)}
              helperText={touched.passing_score && errors.passing_score}
            />

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

            {/* Term */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Term"
              name="term"
              type="number"
              error={touched.term && Boolean(errors.term)}
              helperText={touched.term && errors.term}
            />

            {/* Max Attempts */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Max Attempts"
              name="max_attempts"
              type="number"
              error={touched.max_attempts && Boolean(errors.max_attempts)}
              helperText={touched.max_attempts && errors.max_attempts}
            />

            {/* Date Pickers */}
            <FormControl
              fullWidth
              margin="normal"
              className="grid grid-cols-1 gap-3 md:grid-cols-3"
            >
              <DatePickers name="start_date" placeholder="Start Date" />
              <DatePickers name="end_date" placeholder="End Date" />
              <DatePickers
                name="grade_release_date"
                placeholder="Grade Release Date"
              />
            </FormControl>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                color="secondary"
                disabled={submittingAssignment}
                size="large"
              >
                {submittingAssignment ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreateAssignment;
