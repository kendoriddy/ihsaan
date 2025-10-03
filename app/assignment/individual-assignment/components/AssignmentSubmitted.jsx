"use client";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import { usePatch, usePost } from "@/hooks/useHttp/useHttp";
import { formatDate, getFileType } from "@/utils/utilFunctions";
import { Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Comments from "./Comments";

const AssignmentSubmitted = ({
  submissionData,
  refetchSubmission,
  endDate,
  gradeData,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [gradeId, setGradeId] = useState(null);

  useEffect(() => {
    if (gradeData?.data?.results?.length > 0) {
      setGradeId(gradeData.data.results[0]);
    }
  }, [gradeData]);

  const { mutate: uploadFile, isLoading: isUploading } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/resource/assessment-resource/`,
    {
      onSuccess: () => {
        toast.success("File uploaded successfully");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Error uploading file");
      },
    }
  );

  const { mutate: updateAssignment, isLoading: isUpdating } = usePatch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/uploads/${submissionData?.[0]?.id}/`,
    {
      onSuccess: () => {
        toast.success("Assignment updated successfully");
        setOpenUpdateModal(false);
        refetchSubmission();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Error updating assignment"
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

  const handleSubmit = async (values, { resetForm }) => {
    if (!assignmentId) {
      toast.error("Assignment ID is missing. Cannot update assignment.");
      return;
    }

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

      updateAssignment(formData);
      resetForm();
    } catch (error) {
      toast.error(error.message || "Error during submission process.");
    }
  };

  if (!submissionData || !submissionData[0]) return null;

  const {
    score,
    total_marks,
    user,
    student_name,
    submitted_at,
    submission_notes,
    file_resources,
  } = submissionData[0];

  const isPastDeadline = new Date(endDate) <= new Date();
  const isGraded = !!gradeId?.score && gradeId?.score !== "0.00";

  const disableEdit = isPastDeadline || isGraded;
  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-center text-center items-start space-x-4">
          <div>
            <p className="font-medium">{student_name || "Unknown User"}</p>
            <p className="text-sm text-gray-500">
              {formatDate(submitted_at) || "Unknown date"}
            </p>
            <p className="mt-2">{submission_notes || "No response text"}</p>
            {file_resources[0]?.media_url && (
              <>
                {file_resources[0].media_url.endsWith(".pdf") ? (
                  <iframe
                    src={file_resources[0].media_url}
                    className="w-full h-96 border rounded"
                    title="PDF Preview"
                  />
                ) : (
                  <img
                    src={file_resources[0].media_url}
                    alt="Student submitted file"
                    className="max-w-full h-auto rounded"
                  />
                )}

                <div className="mt-2 flex justify-center space-x-2">
                  <a
                    href={file_resources[0].media_url}
                    download
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-gray-300"
                  >
                    Download
                  </a>
                  <a
                    href={file_resources[0].media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-300"
                  >
                    Preview
                  </a>
                </div>
              </>
            )}
            <p className="mt-2">
              Your score:{" "}
              {gradeId?.score && gradeId?.assessment_max_score
                ? `${gradeId?.score} / ${gradeId?.assessment_max_score}`
                : "Not graded"}
            </p>
            <Button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setOpenUpdateModal(true)}
              disabled={disableEdit}
            >
              Edit Assignment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {gradeId && <Comments gradeId={gradeId?.id} />}

      <CustomModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        title="Update Assignment"
        confirmText={isUpdating || isUploading ? "Updating..." : "Update"}
        isLoading={isUpdating || isUploading}
      >
        <Formik
          initialValues={{
            submission_notes: submission_notes || "",
            file: null,
          }}
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
                  className="w-full p-2 border border-gray-300 rounded-md resize-none outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Your response here"
                />
                {touched.submission_notes && errors.submission_notes && (
                  <p className="text-red-500 text-sm">
                    {errors.submission_notes}
                  </p>
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
                    dragActive
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <p className="text-gray-500">
                    {values.file
                      ? values.file.name
                      : "Drop files here or browse"}
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
                {touched.file && errors.file && (
                  <p className="text-red-500 text-sm">{errors.file}</p>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Assignment"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </div>
  );
};

export default AssignmentSubmitted;
