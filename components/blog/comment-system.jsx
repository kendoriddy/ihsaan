"use client";

import { useState, useEffect } from "react";

function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUser,
  depth = 0,
  fetchReplies,
  replies,
  repliesLoading,
  repliesError,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [repliesFetched, setRepliesFetched] = useState(false);

  // Fetch replies for top-level comments on mount
  useEffect(() => {
    if (depth === 0 && fetchReplies && !repliesFetched) {
      fetchReplies(comment.id);
      setRepliesFetched(true);
    }
  }, [depth, fetchReplies, comment.id, repliesFetched]);

  const handleReply = async () => {
    if (replyContent.trim()) {
      await onReply(replyContent, comment.id);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== comment.content) {
      await onEdit(editContent);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAuthor = currentUser === comment.author;
  const maxDepth = 3;

  return (
    <div
      className={`${depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7e1a0b] text-white rounded-full flex items-center justify-center text-sm font-medium">
              {comment.author && comment.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-medium text-gray-900">
                {comment.author}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {formatDate(comment.created_at)}
              </span>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#ff6600] hover:text-[#e55a00] text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent outline-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-[#7e1a0b] text-white rounded-lg hover:bg-[#6d1609] text-sm font-medium"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 mb-3">{comment.content}</p>
            {depth === 0 && (
              <button
                onClick={() => setIsReplying(true)}
                className="text-[#ff6600] hover:text-[#e55a00] text-sm font-medium"
              >
                Reply
              </button>
            )}
          </>
        )}

        {isReplying && (
          <div className="mt-4 space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent outline-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleReply}
                className="px-4 py-2 bg-[#7e1a0b] text-white rounded-lg hover:bg-[#6d1609] text-sm font-medium"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Delete Comment
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render replies for top-level comments */}
      {depth === 0 && (
        <div className="ml-4">
          {repliesLoading && repliesLoading[comment.id] && (
            <div className="text-xs text-gray-400 py-2">Loading replies...</div>
          )}
          {repliesError && repliesError[comment.id] && (
            <div className="text-xs text-red-400 py-2">
              {repliesError[comment.id]}
            </div>
          )}
          {replies && replies[comment.id] && replies[comment.id].length > 0 && (
            <div className="space-y-2">
              {replies[comment.id].map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={(content) => onReply(content, comment.id)}
                  onEdit={(content) => onEdit(reply.id, content)}
                  onDelete={() => onDelete(reply.id)}
                  currentUser={currentUser}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CommentSystem({
  postId,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  currentUser,
  fetchReplies,
  replies,
  repliesLoading,
  repliesError,
}) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildCommentTree = (comments) => {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree structure
    comments.forEach((comment) => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#7e1a0b] mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add new comment */}
        <div className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent outline-none"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-2 bg-[#7e1a0b] text-white rounded-lg hover:bg-[#6d1609] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div className="space-y-4">
          {commentTree.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            commentTree.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={(content, parentId) => onAddComment(content, parentId)}
                onEdit={(commentId, content) =>
                  onEditComment(commentId, content)
                }
                onDelete={(commentId) => onDeleteComment(commentId)}
                currentUser={currentUser}
                fetchReplies={fetchReplies}
                replies={replies}
                repliesLoading={repliesLoading}
                repliesError={repliesError}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
