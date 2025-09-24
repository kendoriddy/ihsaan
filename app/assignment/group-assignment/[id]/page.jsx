"use client";
import Layout from "@/components/Layout";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/utilFunctions";
import AssignmentSubmission from "../components/AssignmentSubmission";
import AssignmentSubmitted from "../components/AssignmentSubmitted";
import AssignmentClosed from "../components/AssignmentClosed";
import Link from "next/link";
import Button from "@/components/Button";
import { getAuthToken } from "@/hooks/axios/axios";
import axios from "axios";

const GroupAssignmentPage = () => {
  const { id } = useParams();
  const assignmentId = id ? String(id) : null;

  const {
    isLoading: isLoadingAssignment,
    data: AssignmentData,
    refetch: refetchAssignment,
    isFetching: isFetchingAssignment,
    error: assignmentError,
  } = useFetch(
    `assignment-${assignmentId}`,
    assignmentId
      ? `https://ihsaanlms.onrender.com/assessment/base/${assignmentId}/`
      : null,
    (data) => {
      toast.success("Assignment fetched successfully");
    },
    (error) => {
      toast.error(error.response?.data?.message || "Error fetching assignment");
    }
  );

  const {
    isLoading: isLoadingGroups,
    data: GroupData,
    refetch: refetchGropus,
    isFetching: isFetchingGroups,
    error,
  } = useFetch(
    "groups",
    assignmentId
      ? `https://ihsaanlms.onrender.com/assessment/groups/?assessment=${assignmentId}`
      : null,
    (data) => {
      toast.success("Assignment fetched successfully");
    },
    (error) => {
      toast.error(
        error.response?.data?.message || "Error fetching assignment groups"
      );
    }
  );

  console.log("groups", GroupData);

  const {
    isLoading: isLoadingSubmission,
    data: SubmissionData,
    refetch: refetchSubmission,
    isFetching: isFetchingSubmission,
    error: submissionError,
  } = useFetch(
    `submission-${assignmentId}`,
    assignmentId
      ? `https://ihsaanlms.onrender.com/assessment/base/${assignmentId}/student_submissions/`
      : null,
    (data) => {
      toast.success("Submission fetched successfully");
    },
    (error) => {
      // toast.error(error.response?.data?.message || "No submission found");
    }
  );

  const studentId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  const leaderGroup = GroupData?.data?.results.find(
    (group) =>
      group.leader === studentId && String(group.assessment) === assignmentId
  );

  const groupId = leaderGroup?.id || null;
  const isGroupLeader = !!leaderGroup;

  const dueDate = AssignmentData?.data?.end_date
    ? new Date(AssignmentData.data.end_date)
    : null;
  const isAssignmentClosed = dueDate ? new Date() > dueDate : false;
  // const hasSubmitted = SubmissionData?.data?.file_submissions.some(
  //   (submission) =>
  //     submission.assessment === assignmentId && submission.student === studentId
  // );
  const hasSubmitted = SubmissionData?.data?.file_submissions.some(
    (submission) =>
      submission.group === groupId &&
      submission.assessment === assignmentId &&
      submission.student === studentId
  );

  const showSubmissionForm =
    isGroupLeader && !hasSubmitted && !isAssignmentClosed;
  const showSubmittedView =
    isGroupLeader && hasSubmitted && !isAssignmentClosed;
  const showClosedView = isGroupLeader && isAssignmentClosed;

  // Render based on loading, error, or data
  if (
    isLoadingAssignment ||
    isFetchingAssignment ||
    isLoadingSubmission ||
    isFetchingSubmission ||
    !studentId
  ) {
    return (
      <Layout>
        <div className="text-center py-10">Loading assignment...</div>
      </Layout>
    );
  }

  if (assignmentError) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">
          Error: {assignmentError?.message}
        </div>
      </Layout>
    );
  }

  if (!AssignmentData || !assignmentId) {
    return (
      <Layout>
        <div className="text-center py-10 text-gray-500">
          No assignment data available.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link href="/assignment" className="my-4 p-6">
        <Button variant="outlined">Back</Button>
      </Link>
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Left Section: Assignment Details */}
        <div className="md:w-1/3 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {AssignmentData.data?.title || "No title available"}
          </h2>
          <p className="text-gray-600 mb-4">
            {AssignmentData.data?.description || "No description available"}
          </p>
          <div className="text-sm text-gray-500">
            <p>
              <strong>Start:</strong>
              {formatDate(AssignmentData.data?.start_date) ||
                "No start date available"}
            </p>
            <p>
              <strong>End:</strong>
              {formatDate(AssignmentData.data?.end_date) ||
                "No end date available"}
            </p>
            <p>
              <strong>Mark Obtainable:</strong>
              {AssignmentData.data?.marks || "N/A"}
            </p>
          </div>
        </div>

        {/* Right Section: Submission Area */}
        {!isGroupLeader && (
          <div className="md:w-2/3 bg-white p-4 rounded-md shadow-md">
            <p>You are not allowed to perform this action</p>
            <p>Contact your group leader to submit the assignment</p>
          </div>
        )}
        {isGroupLeader && (
          <div className="md:w-2/3 bg-white p-4 rounded-md shadow-md">
            <div className="flex justify-between items-center">
              {showSubmissionForm && !showClosedView ? (
                <h3 className="text-lg font-medium mb-4">
                  Assignment Submission
                </h3>
              ) : (
                <h3 className="text-lg font-medium mb-4">
                  Submission & Comments
                </h3>
              )}
            </div>
            {showSubmissionForm && (
              <AssignmentSubmission
                assignmentId={assignmentId}
                groupId={groupId}
                refetchSubmission={refetchSubmission}
              />
            )}
            {showSubmittedView && (
              <AssignmentSubmitted
                submissionData={SubmissionData?.data?.file_submissions}
                refetchSubmission={refetchSubmission}
              />
            )}

            {showClosedView && <AssignmentClosed />}
          </div>
        )}
        <div className="md:w-2/3 bg-white p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            {showSubmissionForm && showClosedView ? (
              <h3 className="text-lg font-medium mb-4">
                Assignment Submission
              </h3>
            ) : (
              <h3 className="text-lg font-medium mb-4">
                Submission & Comments
              </h3>
            )}
          </div>
          <AssignmentSubmission
            assignmentId={assignmentId}
            groupId={groupId}
            refetchSubmission={refetchSubmission}
          />
          <AssignmentSubmitted
            submissionData={SubmissionData?.data?.file_submissions}
            refetchSubmission={refetchSubmission}
          />

          {showClosedView && <AssignmentClosed />}
        </div>
      </div>
    </Layout>
  );
};

export default GroupAssignmentPage;
