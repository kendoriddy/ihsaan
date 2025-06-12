"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { usePost, useFetch } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utilFunctions";

const SubmissionsList = ({ assessmentId }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [comment, setComment] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [grades, setGrades] = useState([]);

  // Fetch submissions for the selected assessment
  const {
    isLoading: loadingSubmissions,
    data: submissionsData,
    refetch: refetchSubmissions,
  } = useFetch(
    "submissions",
    assessmentId
      ? `https://ihsaanlms.onrender.com/assessment/uploads/?assessment=${assessmentId}`
      : null
  );

  // Fetch grades for the assessment
  const { data: gradesData, refetch: refetchGrades } = useFetch(
    "grades",
    assessmentId
      ? `https://ihsaanlms.onrender.com/assessment/grades/?assessment=${assessmentId}`
      : null
  );

  // Fetch comments for a grade
  const { data: commentsData, refetch: refetchComments } = useFetch(
    "comments",
    selectedSubmission?.grade_id
      ? `https://ihsaanlms.onrender.com/assessment/grade-comments/?grade=${selectedSubmission.grade_id}`
      : null
  );

  const { mutate: submitGrade, isLoading: submittingGrade } = usePost(
    "https://ihsaanlms.onrender.com/assessment/grades/"
  );

  const { mutate: submitComment, isLoading: submittingComment } = usePost(
    "https://ihsaanlms.onrender.com/assessment/grade-comments/"
  );

  // Update grades when gradesData changes
  useEffect(() => {
    if (gradesData?.data?.results) {
      setGrades(gradesData.data.results);
    }
  }, [gradesData]);

  // Find grade for a submission
  const findGradeForSubmission = (submission) => {
    return grades.find((grade) => grade.student === submission.student);
  };

  const handleGradeSubmit = () => {
    const initialPayload = {
      assessment: assessmentId,
      student: selectedSubmission.student,
      score: grade,
      feedback: feedback,
      is_published: isPublished,
    };

    const payload = !selectedSubmission.group
      ? initialPayload
      : {
          ...initialPayload,
          group: selectedSubmission.group,
        };

    submitGrade(payload, {
      onSuccess: () => {
        toast.success("Grade submitted successfully");
        setOpenGradeDialog(false);
        refetchSubmissions();
        refetchGrades();
        setGrade("");
        setFeedback("");
        setIsPublished(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to submit grade");
      },
    });
  };

  const handleCommentSubmit = () => {
    const grade = findGradeForSubmission(selectedSubmission);
    if (!grade) {
      toast.error("No grade found for this submission");
      return;
    }

    const payload = {
      grade: grade.id,
      content: comment,
    };

    submitComment(payload, {
      onSuccess: () => {
        toast.success("Comment added successfully");
        setComment("");
        refetchComments();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to add comment");
      },
    });
  };

  const handleOpenCommentsDialog = (submission) => {
    const grade = findGradeForSubmission(submission);
    if (!grade) {
      toast.error("No grade found for this submission");
      return;
    }
    setSelectedSubmission({ ...submission, grade_id: grade.id });
    setOpenCommentsDialog(true);
  };

  const submissions = submissionsData?.data?.results || [];

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
            const grade = findGradeForSubmission(submission);
            return (
              <div
                key={submission.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center border border-gray-100"
              >
                <div>
                  <div className="text-lg font-semibold text-indigo-700">
                    {submission.student_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted: {formatDate(submission.submitted_at)}
                  </div>
                  {submission.submission_notes && (
                    <div className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Notes:</span>{" "}
                      {submission.submission_notes}
                    </div>
                  )}
                  {grade && (
                    <div className="text-sm text-green-700 mt-1">
                      <span className="font-medium">Grade:</span> {grade.score}{" "}
                      / {grade.assessment_max_score}
                      {grade.feedback && (
                        <span className="ml-2 text-gray-600 italic">
                          - {grade.feedback}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {submission.file_resources?.map((file) => (
                    <Button
                      key={file.id}
                      href={file.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mr: 1, bg: "white", color: "indigo.700" }}
                      variant="outlined"
                      size="small"
                    >
                      View {file.title}
                    </Button>
                  ))}
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setOpenGradeDialog(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    {grade ? "Update Grade" : "Grade"}
                  </Button> */}
                  <div className="mt-3">
                    <button
                      type="button"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold shadow transition"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setOpenGradeDialog(true);
                      }}
                    >
                      {grade ? "Update Grade" : "Grade"}
                    </button>
                    <button
                      onClick={() => handleOpenCommentsDialog(submission)}
                      disabled={!grade}
                      className={`px-4 py-2 rounded font-semibold border transition ml-2 ${
                        grade
                          ? "border-gray-400 text-gray-700 hover:bg-gray-100"
                          : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                      }`}
                    >
                      Comments
                    </button>
                  </div>
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
          Grade Submission
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
              disabled={submittingGrade}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow"
            >
              {submittingGrade ? "Submitting..." : "Submit Grade"}
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
          <h3 className="text-xl font-bold mb-4 text-indigo-700">Comments</h3>

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
              {commentsData?.data?.results?.map((comment) => (
                <React.Fragment key={comment.id}>
                  <div key={comment.id} className="mb-3">
                    <div className="text-gray-800">{comment.content}</div>
                    <div className="text-xs text-gray-500">
                      By {comment.author_name} on{" "}
                      {formatDate(comment.created_at)}
                    </div>
                    <hr className="my-2" />
                  </div>
                </React.Fragment>
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
