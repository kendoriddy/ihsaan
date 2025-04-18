"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import { academicYearSchema } from "@/components/validationSchemas/ValidationSchema";
import { FormControl } from "@mui/material";
import DatePickers from "@/components/validation/DatePicker";

const CreateSession = () => {
  const {
    mutate: createAcademicSession,
    isLoading: isCreatingAcademicSession,
  } = usePost("https://ihsaanlms.onrender.com/academic-sessions/", {
    onSuccess: (response) => {
      toast.success("Academic session created successfully");
      resetForm();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create academic session"
      );
    },
  });

  // Initial form values
  const initialValues = {
    year: "",
    start_date: "",
    end_date: "",
  };

  // Formik form submission handler
  const handleSubmit = (values, { resetForm }) => {
    createAcademicSession(values);
    resetForm();
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Create Academic Year
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={academicYearSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, setFieldValue, isValid }) => (
          <Form className="bg-white p-6 rounded-md shadow-md space-y-6">
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
            />
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
            </FormControl>{" "}
            {/* Add New Question and Submit Button */}
            <div className="flex justify-center gap-4 items-center">
              <Button
                type="submit"
                color="secondary"
                disabled={
                  isCreatingAcademicSession ||
                  !isValid ||
                  isLoading ||
                  isFetching
                }
                className={`w-full px-6 py-2 rounded-md font-medium text-white ${
                  isCreatingAcademicSession ||
                  !isValid ||
                  isLoading ||
                  isFetching
                    ? "bg-gray-400 cursor-not-allowed"
                    : ""
                } transition-colors duration-300`}
              >
                {isCreatingAcademicSession ? "Creating..." : "Create Session"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateSession;
