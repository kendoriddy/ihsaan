"use client";

import Layout from "@/components/Layout";
import React from "react";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Button from "@/components/Button";
import { usePost, useFetch } from "@/hooks/useHttp/useHttp";
import { manualGradeSchema } from "@/components/validationSchemas/ValidationSchema";
import Swal from "sweetalert2";

const ManualGrading = () => {
  const {
    isLoading: loadingCourses,
    data: coursesData,
    refetch: refetchCourses,
    isFetching: isFetchingCourses,
  } = useFetch(
    ["courses"],
    `https://ihsaanlms.onrender.com/course/courses/`,
    (data) => {
      if (data?.total) {
        // You can handle data.total here if needed
      }
    }
  );
  const courses = coursesData?.data?.results || [];

  const {
    isLoading: loadingReasons,
    data: reasonsData,
    refetch: refetchReasons,
    isFetching: isFetchingReasons,
  } = useFetch(
    ["courses"],
    `https://ihsaanlms.onrender.com/assessment/reason-options/`,
    (data) => {
      if (data?.total) {
        // You can handle data.total here if needed
      }
    }
  );
  const reasons = reasonsData?.data?.results || [];

  const { mutate: submitManualGrade, isLoading } = usePost(
    "https://ihsaanlms.onrender.com/assessment/manual-grades/"
  );

  const initialValues = {
    course: "",
    student: "",
    reason: "",
    details: "",
    score: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    submitManualGrade(values, {
      onSuccess: () => {
        Swal.fire({
          title: "Manual grade submitted successfully",
          icon: "success",
          customClass: {
            confirmButton: "my-confirm-btn",
          },
        });
        resetForm();
      },
      onError: (error) => {
        const errorData = error.response?.data;
        if (typeof errorData === "string") {
          Swal.fire({
            title: errorData,
            icon: "error",
            customClass: {
              confirmButton: "my-confirm-btn",
            },
          });
        } else if (errorData && typeof errorData === "object") {
          const messages = Object.values(errorData)
            .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
            .join(" ");
          Swal.fire({
            title: messages,
            icon: "error",
            customClass: {
              confirmButton: "my-confirm-btn",
            },
          });
        } else {
          Swal.fire({
            title: "Failed to submit manual grade",
            icon: "error",
            customClass: {
              confirmButton: "my-confirm-btn",
            },
          });
        }
      },
    });
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Manual Grading</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={manualGradeSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched }) => {
          const selectedCourse = courses.find((c) => c.id === values.course);
          return (
            <Form>
              {/* Course */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Course</InputLabel>
                <Field as={Select} name="course">
                  {courses.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>

              {/* Student */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Field as={Select} name="student">
                  {selectedCourse?.enrolled_users?.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.first_name} {s.last_name}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>

              {/* Reason */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Reason</InputLabel>
                <Field as={Select} name="reason">
                  {reasons?.map((reason) => (
                    <MenuItem key={reason.id} value={reason.id}>
                      {reason.description}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>

              {/* Details */}
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

              {/* Score */}
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

              {/* Submit */}
              <div className="flex justify-center mt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit Grade"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default ManualGrading;
