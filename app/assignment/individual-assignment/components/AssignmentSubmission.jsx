"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const AssignmentSubmission = ({ assignmentId, refetchSubmission }) => {
  const [dragActive, setDragActive] = useState(false);

  const { mutate: submitAssignment, isLoading: isSubmitting } = usePost(
    `https://ihsaanlms.onrender.com/assessment/submissions/`,
    {
      onSuccess: () => {
        toast.success("Assignment submitted successfully");
        refetchSubmission(); // Refetch submission data to update the UI
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Error submitting assignment"
        );
      },
    }
  );

  // Yup Validation Schema
  const validationSchema = Yup.object().shape({
    response_text: Yup.string().test(
      "response-or-file",
      "Please provide a response or upload a file",
      function (value) {
        return value || this.parent.file; // At least one must be provided
      }
    ),
    file: Yup.mixed().test(
      "fileType",
      "Invalid file type (only mp4, jpeg, jpg, doc, docx, pdf allowed)",
      (file) => {
        if (!file) return true; // File is optional
        return [
          "video/mp4",
          "image/jpeg",
          "image/jpg",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type);
      }
    ),
  });

  return (
    <Formik
      initialValues={{ response_text: "", file: null }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        const formData = new FormData();
        formData.append("assignment_id", assignmentId);
        formData.append("response_text", values.response_text);
        if (values.file) {
          formData.append("file", values.file);
        }

        submitAssignment(formData);
        resetForm(); // Reset form on success
      }}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form className="space-y-4">
          {/* Response Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type your response here:
            </label>
            <Field
              as="textarea"
              name="response_text"
              className="w-full p-2 border border-gray-300 rounded-md outline-none"
              rows={5}
              placeholder="Your response here"
            />
            {touched.response_text && errors.response_text && (
              <p className="text-red-500 text-sm">{errors.response_text}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload a file (mp4, jpeg, jpg, doc, docx, pdf)
            </label>
            <div
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const droppedFile = e.dataTransfer.files[0];
                setFieldValue("file", droppedFile);
              }}
              className={`border-2 border-dashed rounded-md p-6 text-center ${
                dragActive ? "border-blue-300 bg-blue-50" : "border-gray-300"
              }`}
            >
              <p className="text-gray-500">
                {values.file ? values.file.name : "Drop files here or browse"}
              </p>
              <input
                type="file"
                onChange={(e) => setFieldValue("file", e.target.files[0])}
                className="hidden"
                id="file-upload"
                accept=".mp4,.jpeg,.jpg,.doc,.docx,.pdf"
              />
              <label
                htmlFor="file-upload"
                className="mt-2 inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Browse
              </label>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm">{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" disabled={isSubmitting} color="secondary">
              {isSubmitting ? "Submitting..." : "Submit Assignment"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AssignmentSubmission;
