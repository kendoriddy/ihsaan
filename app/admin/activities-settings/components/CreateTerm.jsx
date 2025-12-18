"use client";
import Button from "@/components/Button";
import DatePickers from "@/components/validation/DatePicker";
import { termSchema } from "@/components/validationSchemas/ValidationSchema";
import { useFetch, usePost } from "@/hooks/useHttp/useHttp";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Formik, Form, Field } from "formik";
import React from "react";
import Swal from "sweetalert2";

const CreateTerm = () => {
  const { mutate: createTerm, isLoading: isCreatingTerm } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms/`,
    {
      onSuccess: (response) => {
        if (response.status === 201) {
          Swal.fire({
            title: "Terms created successfully",
            icon: "success",
            customClass: { confirmButton: "my-confirm-btn" },
          });
        }
      },
      onError: (error) => {
        Swal.fire({
          title: error.response?.data?.message || "Failed to create term",
          icon: "error",
          customClass: { confirmButton: "my-confirm-btn" },
        });
      },
    }
  );

  // Initial form values
  const initialValues = {
    session_id: "",
    name: "",
    start_date: "",
    end_date: "",
  };

  // Formik form submission handler
  const handleSubmit = (values, { resetForm }) => {
    createTerm(values, {
      onSuccess: () => {
        resetForm();
      },
    });
  };
  const { isLoading, data, refetch, isFetching } = useFetch(
    "academicSession",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/academic-sessions/`,
    (data) => {}
  );
  const Sessions = data?.data?.results || [];

  return (
    <div>
      {" "}
      <Formik
        initialValues={initialValues}
        validationSchema={termSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, setFieldValue, isValid, touched }) => (
          <Form className="p-6 space-y-6">
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Academic Session</InputLabel>
              <Field as={Select} name="session_id">
                {Sessions.length > 0 ? (
                  Sessions.map((session) => (
                    <MenuItem key={session.id} value={session.id}>
                      {session.year}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No sessions available</MenuItem>
                )}
              </Field>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Term Name</InputLabel>
              <Field as={Select} name="name">
                <MenuItem value="">Select an option</MenuItem>
                <MenuItem value="FIRST">First Term</MenuItem>
                <MenuItem value="SECOND">Second Term</MenuItem>
                <MenuItem value="THIRD">Third Term</MenuItem>
              </Field>
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              className="grid grid-cols-1 gap-3 md:grid-cols-2"
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
                disabled={isCreatingTerm || !isValid}
                className={`w-full px-6 py-2 rounded-md font-medium text-white ${
                  isCreatingTerm || !isValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : ""
                } transition-colors duration-300`}
              >
                {isCreatingTerm ? "Creating..." : "Create Term"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateTerm;
