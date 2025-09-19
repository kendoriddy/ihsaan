"use client";

import React, { useState } from "react";
import { useFetch, usePost } from "@/hooks/useHttp/useHttp";
import { formatDate } from "@/utils/utilFunctions";
import { toast } from "react-toastify";

const Comments = ({ gradeId }) => {
  const [comment, setComment] = useState("");
  console.log("gradeId:::", gradeId);
  // Fetch comments for the grade
  const { data: commentsData, refetch: refetchComments } = useFetch(
    "comments",
    gradeId
      ? `https://ihsaanlms.onrender.com/assessment/grade-comments/?grade_id=${gradeId}`
      : null
  );

  const { mutate: submitComment, isLoading: submittingComment } = usePost(
    "https://ihsaanlms.onrender.com/assessment/grade-comments/"
  );

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    const payload = {
      grade: gradeId,
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

  const comments = commentsData?.data?.results || [];

  return (
    <div className="mt-6 border-t pt-4 max-h-[400px] overflow-y-scroll">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Comments</h3>

      {/* Comments List */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="text-gray-800">{comment.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              By {comment.author_name} on {formatDate(comment.created_at)}
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your comment here..."
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCommentSubmit}
            disabled={submittingComment || !comment.trim()}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submittingComment ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
