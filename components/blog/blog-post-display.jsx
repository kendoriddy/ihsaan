"use client";

import { useState } from "react";

export default function BlogPostDisplay({
  post,
  onEdit,
  onDelete,
  onTogglePublish,
  isAdmin = false,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7e1a0b] to-[#ff6600] text-white p-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
              {post.category_name && (
                <>
                  <span>•</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                    {post.category_name}
                  </span>
                </>
              )}
              {post.word_count && (
                <>
                  <span>•</span>
                  <span>{post.word_count} words</span>
                </>
              )}
              {!post.is_published && (
                <>
                  <span>•</span>
                  <span className="bg-yellow-500 px-2 py-1 rounded text-xs font-medium">
                    DRAFT
                  </span>
                </>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onTogglePublish}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                {post.is_published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Delete Blog Post
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot
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
                onClick={() => {
                  onDelete?.();
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
    </article>
  );
}
