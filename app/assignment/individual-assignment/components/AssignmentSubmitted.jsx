import { usePatch, usePost } from "@/hooks/useHttp/useHttp";
import { formatDate } from "@/utils/utilFunctions";
import React from "react";
import { useState } from "react";

const AssignmentSubmitted = ({ submissionData }) => {
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

  const { mutate: updateAssignment, isLoading: isUpdating } = usePatch(
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

      updateAssignment(formData);

      resetForm();
    } catch (error) {
      toast.error(error.message || "Error during submission process.");
    }
  }

  function getFileType(mimeType) {
    if (mimeType.startsWith("video/")) return "VIDEO";
    if (mimeType.startsWith("image/")) return "IMAGE";
    if (mimeType === "application/pdf") return "DOCUMENT";
    if (
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "DOCUMENT";
    return "OTHERS";
  }

  console.log("submission data", submissionData);
  if (!submissionData) return null;

  const {
    marks,
    total_marks,
    user,
    student_name,
    submitted_at,
    submission_notes,
    file_url,
  } = submissionData[0];
  return (
    <div>
      {/* {submissionData?.marks && (
        <p className="text-blue-600 mb-4">
          You scored {submission.marks} out of {submissionData.total_marks}{" "}
          marks.
        </p>
      )} */}
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          {/* <img
            src={submissionData?.user?.avatar || "/default-avatar.png"}
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          /> */}
          <div>
            <p className="font-medium">{student_name || "Unknown User"}</p>
            <p className="text-sm text-gray-500">
              {formatDate(submitted_at) || "Unknown date"}
            </p>
            <p className="mt-2">{submission_notes || "No response text"}</p>
            {/* {submissionData?.file_url && (
              <div className="mt-2 flex space-x-2">
                <a
                  href={submissionData.file_url}
                  download
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Download
                </a>
                <a
                  href={submissionData.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Preview
                </a>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmitted;
