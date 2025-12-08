"use client";

import React from "react";
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
  const {
    isLoading: loadingCourses,
    data: coursesData,
    refetch: refetchCourses,
    isFetching: isFetchingCourses,
  } = useFetch(
    ["courses"],
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/`,
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
    ["reasons"],
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/reason-options/`,
    (data) => {
      if (data?.total) {
        // You can handle data.total here if needed
      }
    }
  );
  const reasons = reasonsData?.data?.results || [];

  // Create mutation
  const { mutate: createManualGrade, isLoading: isCreating } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades/`
  );

  // Update mutation
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
      score: parseFloat(values.score), // Ensure score is a number
    };

    const onSuccessCallback = () => {
      Swal.fire({
        title: `Manual grade ${isEdit ? "updated" : "created"} successfully`,
        icon: "success",
        customClass: {
          confirmButton: "my-confirm-btn",
        },
      });
      if (!isEdit) {
        resetForm();
      }
      onSuccess?.();
    };

    const onErrorCallback = (error) => {
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
        toast.success(messages);
      } else {
        toast.error(`Failed to ${isEdit ? "update" : "create"} manual grade`);
      }
    };

    if (isEdit) {
      updateManualGrade(submitData, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    } else {
      createManualGrade(submitData, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
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
          const selectedCourse = courses.find((c) => c.id === values.course);

          return (
            <Form>
              {/* Course */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Course</InputLabel>
                <Field
                  as={Select}
                  name="course"
                  disabled={isEdit}
                  onChange={(e) => {
                    setFieldValue("course", e.target.value);
                    setFieldValue("student", ""); // Reset student when course changes
                  }}
                  error={touched.course && Boolean(errors.course)}
                >
                  {courses.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.title}
                    </MenuItem>
                  ))}
                </Field>
                {touched.course && errors.course && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.course}
                  </div>
                )}
              </FormControl>

              {/* Student */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Student</InputLabel>
                <Field
                  as={Select}
                  name="student"
                  disabled={!selectedCourse || isEdit}
                  error={touched.student && Boolean(errors.student)}
                >
                  {selectedCourse?.enrolled_users?.length > 0 ? (
                    selectedCourse?.enrolled_users?.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.first_name} {s.last_name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      There is no student assigned to this course.
                    </MenuItem>
                  )}
                </Field>
                {touched.student && errors.student && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.student}
                  </div>
                )}
              </FormControl>

              {/* Reason */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Reason</InputLabel>
                <Field
                  as={Select}
                  name="reason"
                  error={touched.reason && Boolean(errors.reason)}
                >
                  {reasons?.map((reason) => (
                    <MenuItem key={reason.id} value={reason.id}>
                      {reason.description}
                    </MenuItem>
                  ))}
                </Field>
                {touched.reason && errors.reason && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.reason}
                  </div>
                )}
              </FormControl>

              {/* Score */}
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                type="number"
                label="Score"
                name="score"
                inputProps={{ min: 0, max: 100, step: 0.1 }}
                error={touched.score && Boolean(errors.score)}
                helperText={touched.score && errors.score}
              />

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

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  color="secondary"
                  variant="outlined"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} color="primary">
                  {isLoading
                    ? isEdit
                      ? "Updating..."
                      : "Creating..."
                    : isEdit
                    ? "Update Grade"
                    : "Create Grade"}
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
