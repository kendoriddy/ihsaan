"use client";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import { academicYearSchema } from "@/components/validationSchemas/ValidationSchema";
import { FormControl, TextField } from "@mui/material";
import DatePickers from "@/components/validation/DatePicker";
import CreateTerm from "../components/CreateTerm";
import AdminLayout from "@/components/AdminLayout";

const CreateSession = () => {
  const [sessionOrTerm, setSessionOrTerm] = useState("session");
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
    <AdminLayout>
      <div className="">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Academic Year or Term
        </h2>

        <div className="flex justify-center mb-6">
          <div className="flex gap-4 border-b border-gray-300">
            <button
              className={`px-4 py-2 font-medium ${
                sessionOrTerm === "session"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSessionOrTerm("session")}
            >
              Academic Session
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                sessionOrTerm === "term"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSessionOrTerm("term")}
            >
              Academic Term
            </button>
          </div>
        </div>

        {sessionOrTerm === "session" && (
          <Formik
            initialValues={initialValues}
            validationSchema={academicYearSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ values, setFieldValue, isValid, touched, errors }) => (
              <Form className="p-6 space-y-6">
                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  label="Year"
                  name="year"
                  error={touched.year && Boolean(errors.year)}
                  helperText={touched.year && errors.year}
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
                    disabled={isCreatingAcademicSession || !isValid}
                    className={`w-full px-6 py-2 rounded-md font-medium text-white ${
                      isCreatingAcademicSession || !isValid
                        ? "bg-gray-400 cursor-not-allowed"
                        : ""
                    } transition-colors duration-300`}
                  >
                    {isCreatingAcademicSession
                      ? "Creating..."
                      : "Create Session"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
        {sessionOrTerm === "term" && <CreateTerm />}
      </div>
    </AdminLayout>
  );
};

export default CreateSession;
