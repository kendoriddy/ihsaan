"use client";

import { useState, useEffect } from "react";
import BlogPostForm from "./blog-post-form";
import BlogPostDisplay from "./blog-post-display";
import CommentSystem from "./comment-system";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  patchBlogPublishStatus,
  editBlogPost,
} from "@/utils/redux/slices/blogSlice";
import NewsletterModal from "./NewsletterModal";

export default function BlogApp() {
  const [currentView, setCurrentView] = useState("list");
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [replies, setReplies] = useState({}); // { [commentId]: [replies] }
  const [repliesLoading, setRepliesLoading] = useState({});
  const [repliesError, setRepliesError] = useState({});
  const [showNewsletter, setShowNewsletter] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  // Get current user and role from localStorage
  let currentUser = "";
  let currentUserRoles = [];
  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        currentUser = userObj.first_name + " " + userObj.last_name;
        currentUserRoles = userObj.roles || [];
      }
    } catch (e) {
      // fallback to default
    }
  }
  const isAdmin = currentUserRoles.includes("ADMIN");

  // Store fetchPosts in a ref so it can be called after post
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/blog/blogs/",
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const apiPosts = res.data.results.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        content: item.content,
        display_pic_id: item.display_pic?.id || 0,
        display_pic_url: item.display_pic?.media_url || null,
        is_published: item.is_published,
        created_at: item.created_at,
        author: item.author_name || item.author,
        preview: item.preview,
      }));
      setPosts(apiPosts);
    } catch (err) {
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Show newsletter modal only once per session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("newsletter_shown");
      if (!seen) {
        setTimeout(() => setShowNewsletter(true), 1200); // delay for effect
        sessionStorage.setItem("newsletter_shown", "1");
      }
    }
  }, []);

  // Fetch comments when viewing a post
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedPost || currentView !== "view") return;
      setCommentsLoading(true);
      setCommentsError(null);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_BASE_URL +
            `/blog/comments/?blog=${selectedPost.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setComments(res.data.results);
      } catch (err) {
        setCommentsError("Failed to load comments.");
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [selectedPost, currentView]);

  // Fetch replies for a comment
  const fetchReplies = async (commentId) => {
    setRepliesLoading((prev) => ({ ...prev, [commentId]: true }));
    setRepliesError((prev) => ({ ...prev, [commentId]: null }));
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_BASE_URL +
          `/blog/replies/?comment=${commentId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setReplies((prev) => ({ ...prev, [commentId]: res.data.results }));
    } catch (err) {
      setRepliesError((prev) => ({
        ...prev,
        [commentId]: "Failed to load replies.",
      }));
    } finally {
      setRepliesLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleCreatePost = async (postData) => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/blog/blogs/",
        {
          title: postData.title,
          slug: "", // always empty
          content: postData.content,
          display_pic_id: postData.display_pic_id,
          is_published: postData.is_published,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setCurrentView("list");
      await fetchPosts();
    } catch (err) {
      alert("Failed to create blog post.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postData) => {
    if (!selectedPost) return;

    const updatedPost = {
      ...selectedPost,
      ...postData,
    };
    try {
      const resultAction = await dispatch(editBlogPost(updatedPost));
      if (editBlogPost.fulfilled.match(resultAction)) {
        setPosts((prev) =>
          prev.map((post) => (post.id === selectedPost.id ? updatedPost : post))
        );
        setSelectedPost(updatedPost);
        setCurrentView("view");
      } else {
        alert("Failed to update blog post.");
      }
    } catch (err) {
      alert("Failed to update blog post.");
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    setPosts((prev) => prev.filter((post) => post.id !== selectedPost.id));
    setCurrentView("list");

    // Here you would make your API call
    console.log("Deleting post:", selectedPost.id);
  };

  const handleTogglePublish = async () => {
    if (!selectedPost) return;

    // Use Redux thunk to PATCH publish status
    const newStatus = !selectedPost.is_published;
    try {
      const resultAction = await dispatch(
        patchBlogPublishStatus({ post: selectedPost, is_published: newStatus })
      );
      if (patchBlogPublishStatus.fulfilled.match(resultAction)) {
        // Update local state with new publish status
        const updatedPost = { ...selectedPost, is_published: newStatus };
        setPosts((prev) =>
          prev.map((post) => (post.id === selectedPost.id ? updatedPost : post))
        );
        setSelectedPost(updatedPost);
      } else {
        alert("Failed to update publish status.");
      }
    } catch (err) {
      alert("Failed to update publish status.");
    }
  };

  // POST a new comment
  const handleAddComment = async (content, parentId) => {
    if (!selectedPost) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!parentId) {
      // New comment
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/blog/comments/",
          {
            blog: selectedPost.id,
            content,
            is_flagged: false,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setComments((prev) => [...prev, res.data]);
      } catch (err) {
        alert("Failed to post comment.");
      }
    } else {
      // New reply
      try {
        const res = await axios.post(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/blog/replies/",
          {
            comment: parentId,
            content,
            is_flagged: false,
          },
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        // Add reply to replies state
        setReplies((prev) => ({
          ...prev,
          [parentId]: prev[parentId]
            ? [...prev[parentId], res.data]
            : [res.data],
        }));
      } catch (err) {
        alert("Failed to post reply.");
      }
    }
  };

  const handleEditComment = async (commentId, content) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, content } : comment
      )
    );

    // Here you would make your API call
    console.log("Editing comment:", { commentId, content });
  };

  const handleDeleteComment = async (commentId) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));

    // Here you would make your API call
    console.log("Deleting comment:", commentId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NewsletterModal
        open={showNewsletter}
        onClose={() => setShowNewsletter(false)}
      />
      {/* Navigation */}
      <nav className="bg-[#7e1a0b] text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#ff6600]/20 transition-colors"
              title="Back to Home"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-2xl font-bold">Blog System</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentView("list")}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentView === "list" ? "bg-[#ff6600]" : "hover:bg-white/10"
              }`}
            >
              All Posts
            </button>
            <button
              onClick={() => setCurrentView("create")}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentView === "create" ? "bg-[#ff6600]" : "hover:bg-white/10"
              }`}
            >
              Create Post
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8">
        {loading && (
          <div className="text-center py-8 text-[#7e1a0b] font-semibold">
            Loading blog posts...
          </div>
        )}
        {error && (
          <div className="text-center py-8 text-red-500 font-semibold">
            {error}
          </div>
        )}
        {currentView === "list" && !loading && !error && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#7e1a0b] mb-2">
                Latest Blog Posts
              </h2>
              <p className="text-gray-600">
                Discover our latest articles and insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-gradient-to-br from-[#7e1a0b] to-[#ff6600] overflow-hidden">
                    {post.display_pic_id > 0 && post.display_pic_url ? (
                      <img
                        src={post.display_pic_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <p className="text-sm opacity-80">No Image</p>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {post.is_published ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Author Actions (if current user is author or admin) */}
                    {(post.author === currentUser || isAdmin) && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(post);
                              setCurrentView("edit");
                            }}
                            className="bg-white/90 hover:bg-white text-[#7e1a0b] p-1.5 rounded-full shadow-lg transition-colors"
                            title="Edit post"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          {/* Delete button for admin/author */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(post);
                              handleDeletePost();
                            }}
                            className="bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-full shadow-lg transition-colors"
                            title="Delete post"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                          {/* Publish/Unpublish button for admin/author */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(post);
                              handleTogglePublish();
                            }}
                            className={`bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-colors ${
                              post.is_published
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                            title={
                              post.is_published
                                ? "Unpublish post"
                                : "Publish post"
                            }
                          >
                            {post.is_published ? (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <div className="w-6 h-6 bg-[#7e1a0b] text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#7e1a0b] mb-3 line-clamp-2 group-hover:text-[#ff6600] transition-colors">
                      {post.title}
                    </h3>

                    <div
                      className="text-gray-600 text-sm line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          post.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 120) + "...",
                      }}
                    />

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setCurrentView("view");
                        }}
                        className="inline-flex items-center gap-2 text-[#ff6600] hover:text-[#e55a00] font-medium text-sm group-hover:gap-3 transition-all"
                      >
                        Read More
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {comments.filter((c) => c.id === post.id).length}
                        </span>
                        <span>#{post.display_pic_id || "no-img"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {posts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first blog post
                </p>
                <button
                  onClick={() => setCurrentView("create")}
                  className="px-6 py-3 bg-[#7e1a0b] text-white rounded-lg hover:bg-[#6d1609] font-medium"
                >
                  Create Your First Post
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === "create" && (
          <div className="max-w-4xl mx-auto mb-4">
            <button
              onClick={() => setCurrentView("list")}
              className="flex items-center gap-1 text-[#7e1a0b] hover:text-[#ff6600] font-medium mb-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Posts
            </button>
            <BlogPostForm
              onSubmit={handleCreatePost}
              onPostSuccess={fetchPosts}
            />
          </div>
        )}

        {currentView === "edit" && selectedPost && (
          <div className="max-w-4xl mx-auto mb-4">
            <button
              onClick={() => setCurrentView("list")}
              className="flex items-center gap-1 text-[#7e1a0b] hover:text-[#ff6600] font-medium mb-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Posts
            </button>
            <BlogPostForm
              initialData={selectedPost}
              onSubmit={handleUpdatePost}
              isEditing={true}
            />
          </div>
        )}

        {currentView === "view" && selectedPost && (
          <>
            <div className="max-w-4xl mx-auto mb-4">
              <button
                onClick={() => setCurrentView("list")}
                className="flex items-center gap-1 text-[#7e1a0b] hover:text-[#ff6600] font-medium mb-4"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Posts
              </button>
            </div>
            <BlogPostDisplay
              post={selectedPost}
              onEdit={() => setCurrentView("edit")}
              onDelete={handleDeletePost}
              onTogglePublish={handleTogglePublish}
              isAuthor={selectedPost.author === currentUser || isAdmin}
            />
            <CommentSystem
              postId={selectedPost.id}
              comments={comments}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              currentUser={currentUser}
              fetchReplies={fetchReplies}
              replies={replies}
              repliesLoading={repliesLoading}
              repliesError={repliesError}
            />
          </>
        )}
      </div>
    </div>
  );
}
