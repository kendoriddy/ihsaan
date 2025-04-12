import React from "react";

const AssignmentSubmitted = ({ submissionData }) => {
  return (
    <div>
      {submissionData?.marks && (
        <p className="text-blue-600 mb-4">
          You scored {submissionData.marks} out of {submissionData.total_marks}{" "}
          marks.
        </p>
      )}
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <img
            src={submissionData?.user?.avatar || "/default-avatar.png"}
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">
              {submissionData?.user?.name || "Unknown User"}
            </p>
            <p className="text-sm text-gray-500">
              {submissionData?.submission_date || "Unknown date"}
            </p>
            <p className="mt-2">
              {submissionData?.response_text || "No response text"}
            </p>
            {submissionData?.file_url && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmitted;
