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
import Link from "next/link";

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
    type: "",
    question_type: "",
    max_score: "",
    passing_score: "",
    course: "",
    term: "",
    max_attempts: "",
    start_date: "",
    end_date: "",
    grade_release_date: "",
    mcq_question_count: "",
  };

  // Submit function
  const handleSubmit = (values, { resetForm }) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== "")
    );

    const payload = {
      ...cleanedValues,
      tutor: tutorId,
    };
    console.log("tutorId", tutorId);
    submitAssignment(payload, {
      onSuccess: () => {
        toast.success("Assessment created successfully");
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
      <Link href="/set-assignment" className="my-4">
        <Button variant="outlined">Back</Button>
      </Link>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={addAssignmentSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
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
                <MenuItem value="">Select an option</MenuItem>
                <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                <MenuItem value="GROUP">Group</MenuItem>{" "}
                <MenuItem value="TEST">Test</MenuItem>{" "}
                <MenuItem value="EXAMINATION">Examination</MenuItem>
              </Field>
            </FormControl>

            {/* Question Type */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Question Type</InputLabel>
              <Field as={Select} name="question_type">
                <MenuItem value="">Select an option</MenuItem>
                <MenuItem value="MCQ">Quiz</MenuItem>
                <MenuItem value="MANUAL">Manual Grading</MenuItem>
                <MenuItem value="FILE_UPLOAD">File Upload</MenuItem>
              </Field>
            </FormControl>

            {values.question_type === "MCQ" && (
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Number of Questions"
                name="mcq_question_count"
                type="number"
                error={
                  touched.mcq_question_count &&
                  Boolean(errors.mcq_question_count)
                }
                helperText={
                  touched.mcq_question_count && errors.mcq_question_count
                }
              />
            )}

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

            <FormControl fullWidth margin="normal">
              <InputLabel>Term</InputLabel>
              <Field as={Select} name="term">
                <MenuItem value="">Select term</MenuItem>
                <MenuItem value="1">First Term</MenuItem>
                <MenuItem value="2">Second Term</MenuItem>
              </Field>
            </FormControl>

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
              <DatePickers
                name="start_date"
                placeholder="Start Date"
                value={values.start_date}
                onChange={(value) => setFieldValue("start_date", value)}
              />
              <DatePickers
                name="end_date"
                placeholder="End Date"
                value={values.end_date}
                onChange={(value) => setFieldValue("end_date", value)}
              />
              <DatePickers
                name="grade_release_date"
                placeholder="Grade Release Date"
                value={values.grade_release_date}
                onChange={(value) => setFieldValue("grade_release_date", value)}
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
