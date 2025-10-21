"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { usePost, useFetch, usePatch, usePut2 } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { formatDate, normalizeUrl } from "@/utils/utilFunctions";
import Swal from "sweetalert2";

const SubmissionsList = ({ assessmentId }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [comment, setComment] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [grades, setGrades] = useState([]);

  // Fetch submissions
  const {
    isLoading: loadingSubmissions,
    data: submissionsData,
    refetch: refetchSubmissions,
  } = useFetch(
    "submissions",
    assessmentId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/uploads/?assessment=${assessmentId}`
      : null
  );

  // Fetch grades
  const { data: gradesData, refetch: refetchGrades } = useFetch(
    "grades",
    assessmentId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades/?assessment=${assessmentId}`
      : null
  );

  // Fetch comments
  const { data: commentsData, refetch: refetchComments } = useFetch(
    "comments",
    selectedSubmission?.grade_id
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grade-comments/?grade=${selectedSubmission.grade_id}`
      : null
  );

  const { mutate: submitGrade, isLoading: submittingGrade } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades/`
  );

  const { mutate: updateGrade, isLoading: updatingGrade } = usePut2(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades/`
  );

  const { mutate: submitComment, isLoading: submittingComment } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grade-comments/`
  );

  // keep grades updated
  useEffect(() => {
    if (gradesData?.data?.results) {
      setGrades(gradesData.data.results);
    }
  }, [gradesData]);

  const submissions = submissionsData?.data?.results || [];

  const findGradeForSubmission = (submission) => {
    return grades.find((g) => g.student === submission?.student);
  };

  const handleOpenGradeDialog = (submission) => {
    setSelectedSubmission(submission);
    const existingGrade = findGradeForSubmission(submission);
    if (existingGrade) {
      setGrade(existingGrade.score);
      setFeedback(existingGrade.feedback || "");
      setIsPublished(existingGrade.is_published || false);
    } else {
      setGrade("");
      setFeedback("");
      setIsPublished(false);
    }
    setOpenGradeDialog(true);
  };

  const handleGradeSubmit = () => {
    const existingGrade = findGradeForSubmission(selectedSubmission);

    const basePayload = {
      assessment: assessmentId,
      student: selectedSubmission.student,
      score: grade,
      feedback,
      is_published: isPublished,
    };

    const payload = !selectedSubmission.group
      ? basePayload
      : { ...basePayload, group: selectedSubmission.group };

    if (existingGrade) {
      // PATCH existing grade
      updateGrade(
        {
          url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/grades/${existingGrade.id}/`,
          // id: existingGrade.id,
          data: payload,
        },
        {
          onSuccess: () => {
            toast.success("Grade updated successfully");
            setOpenGradeDialog(false);
            refetchSubmissions();
            refetchGrades();
          },
          onError: () => {
            // Swal.fire({
            //   title:
            //     "Failed to update grade, make sure score is not greate than assessment score and try again",
            //   icon: "error",
            //   target: document.body,
            //   customClass: {
            //     confirmButton: "my-confirm-btn",
            //   },
            // });
            toast.error(
              "Failed to update grade, make sure score is not greater than assessment score and try again"
            );
          },
        }
      );
    } else {
      // POST new grade
      submitGrade(payload, {
        onSuccess: () => {
          toast.success("Grade submitted successfully");
          setOpenGradeDialog(false);
          refetchSubmissions();
          refetchGrades();
        },
        onError: () => {
          toast.error("Failed to submit grade");
        },
      });
    }
  };

  const handleCommentSubmit = () => {
    const gradeObj = findGradeForSubmission(selectedSubmission);
    if (!gradeObj) {
      toast.error("No grade found for this submission");
      return;
    }

    const payload = { grade: gradeObj.id, content: comment };

    submitComment(payload, {
      onSuccess: () => {
        toast.success("Comment added successfully");
        setComment("");
        refetchComments();
      },
      onError: () => {
        toast.error("Failed to add comment");
      },
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Submissions</h2>

      {loadingSubmissions ? (
        <div className="text-gray-500">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="text-gray-500">No submissions found</div>
      ) : (
        <List>
          {submissions.map((submission) => {
            const gradeObj = findGradeForSubmission(submission);
            return (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center border border-gray-100 gap-3"
              >
                <div>
                  <div className="text-lg font-semibold text-indigo-700">
                    {submission.student_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted: {formatDate(submission.submitted_at)}
                  </div>
                  {gradeObj && (
                    <div className="text-sm text-green-700 mt-1">
                      <span className="font-medium">Grade:</span>{" "}
                      {gradeObj.score} / {gradeObj.assessment_max_score}
                      {gradeObj.feedback && (
                        <span className="ml-2 text-gray-600 italic">
                          - {gradeObj.feedback}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {submission.file_resources?.map((file) => (
                    <Button
                      key={file.id}
                      href={normalizeUrl(file.media_url) || file.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mr: 1, bg: "white", color: "indigo.700" }}
                      variant="outlined"
                      size="small"
                    >
                      View {file.title}
                    </Button>
                  ))}
                  <button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold shadow transition"
                    onClick={() => handleOpenGradeDialog(submission)}
                  >
                    {gradeObj ? "Update Grade" : "Grade"}
                  </button>
                  <button
                    onClick={() => {
                      const g = findGradeForSubmission(submission);
                      if (!g) {
                        toast.error("No grade found for this submission");
                        return;
                      }
                      setSelectedSubmission({
                        ...submission,
                        grade_id: g.id,
                      });
                      setOpenCommentsDialog(true);
                    }}
                    disabled={!gradeObj}
                    className={`px-4 py-2 rounded font-semibold border transition ml-2 ${
                      gradeObj
                        ? "border-gray-400 text-gray-700 hover:bg-gray-100"
                        : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                    }`}
                  >
                    Comments
                  </button>
                </div>
              </div>
            );
          })}
        </List>
      )}

      {/* Grade Dialog */}
      <Dialog
        open={openGradeDialog}
        onClose={() => setOpenGradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {findGradeForSubmission(selectedSubmission)
            ? "Update Grade"
            : "Grade Submission"}
          <IconButton
            onClick={() => setOpenGradeDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Score"
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Feedback"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mb: 2 }}
            />
            <button
              type="button"
              className={`mb-4 py-2 px-2 rounded-md font-medium transition ${
                isPublished
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
              onClick={() => setIsPublished(!isPublished)}
            >
              {isPublished ? "Publish result" : "Do Not Publish"}
            </button>
          </Box>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end gap-2 px-6 py-0">
            <button
              onClick={() => setOpenGradeDialog(false)}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleGradeSubmit}
              disabled={submittingGrade || updatingGrade}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow"
            >
              {submittingGrade || updatingGrade
                ? "Saving..."
                : findGradeForSubmission(selectedSubmission)
                ? "Update Grade"
                : "Submit Grade"}
            </button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog
        open={openCommentsDialog}
        onClose={() => setOpenCommentsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Comments
          <IconButton
            onClick={() => setOpenCommentsDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <List>
              {commentsData?.data?.results?.map((c) => (
                <div key={c.id} className="mb-3">
                  <div className="text-gray-800">{c.content}</div>
                  <div className="text-xs text-gray-500">
                    By {c.author_name} on {formatDate(c.created_at)}
                  </div>
                  <hr className="my-2" />
                </div>
              ))}
            </List>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenCommentsDialog(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
              >
                Close
              </button>
              <button
                onClick={handleCommentSubmit}
                disabled={submittingComment || !comment.trim()}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow"
              >
                {submittingComment ? "Adding..." : "Add Comment"}
              </button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SubmissionsList;
