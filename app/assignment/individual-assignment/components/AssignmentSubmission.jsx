"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getFileType } from "@/utils/utilFunctions";

const AssignmentSubmission = ({ assignmentId, refetchSubmission }) => {
  const [dragActive, setDragActive] = useState(false);

  const { mutate: uploadFile, isLoading: isUploading } = usePost(
    `https://ihsaanlms.onrender.com/resource/assessment-resource/`,
    {
      onSuccess: () => {
        // Success handler for file upload
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Error uploading file");
      },
    }
  );

  const { mutate: submitAssignment, isLoading: isSubmitting } = usePost(
    `https://ihsaanlms.onrender.com/assessment/uploads/`,
    {
      onSuccess: () => {
        toast.success("Assignment submitted successfully");
        refetchSubmission();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Error submitting assignment"
        );
      },
    }
  );

  const validationSchema = Yup.object().shape({
    submission_notes: Yup.string().test(
      "response-or-file",
      "Please provide a response or upload a file",
      function (value) {
        return value?.trim() || this.parent.file;
      }
    ),
    file: Yup.mixed()
      .nullable()
      .test(
        "fileType",
        "Invalid file type (only mp4, jpeg, jpg, doc, docx, pdf allowed)",
        (file) => {
          if (!file) return true;
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

  async function handleSubmit(values, { resetForm }) {
    const formData = new FormData();

    try {
      let fileResourceId = null;

      if (values.file) {
        const resourceData = new FormData();
        resourceData.append("file", values.file);
        resourceData.append("title", values.file.name);
        resourceData.append("type", getFileType(values.file.type));

        const resourceResponse = await new Promise((resolve, reject) => {
          uploadFile(resourceData, {
            onSuccess: resolve,
            onError: reject,
          });
        });

        fileResourceId = resourceResponse?.data?.id;

        if (!fileResourceId) {
          throw new Error("Failed to upload file.");
        }
      }

      formData.append("assessment", assignmentId);
      formData.append("submission_notes", values.submission_notes);

      if (fileResourceId) {
        formData.append("file_resource_ids", [fileResourceId]);
      }

      submitAssignment(formData);

      resetForm();
    } catch (error) {
      toast.error(error.message || "Error during submission process.");
    }
  }

  return (
    <Formik
      initialValues={{ submission_notes: "", file: null }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched, isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type your response here
            </label>
            <Field
              as="textarea"
              name="submission_notes"
              className="w-full p-2 border border-gray-300 rounded-md resize-none outline-none"
              rows={5}
              placeholder="Your response here"
            />
            {touched.submission_notes && errors.submission_notes && (
              <p className="text-red-500 text-sm">{errors.submission_notes}</p>
            )}
          </div>

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

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              color="secondary"
            >
              {isSubmitting || isUploading
                ? "Submitting..."
                : "Submit Assignment"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AssignmentSubmission;
