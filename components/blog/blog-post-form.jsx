"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "./rich-text-editor";
import axios from "axios";

export default function BlogPostForm({
  initialData,
  onSubmit,
  isEditing = false,
  onPostSuccess,
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    display_pic_id: initialData?.display_pic_id || 0,
    category: initialData?.category || "",
    is_published: initialData?.is_published || false,
    display_pic_file: null,
  });
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rolesStr = localStorage.getItem("roles");
        if (rolesStr) {
          const roles = JSON.parse(rolesStr);
          setIsAdmin(roles.includes("ADMIN"));
        }
      } catch (e) {
        // fallback to default
      }
    }
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/blog/blog-category/",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setCategories(response.data.results || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/blog/blog-category/",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setCategories(response.data.results || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Redirect non-admins
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to create or edit blog posts.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[#7e1a0b] text-white rounded-lg hover:bg-[#6d1609] font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const generateSlug = (title) => {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return randomString;
  };

  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, display_pic_file: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.display_pic_file && !formData.display_pic_id) {
      newErrors.display_pic_file = "Blog image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    let displayPicId = formData.display_pic_id;
    if (formData.display_pic_file) {
      setImageUploading(true);
      setImageUploadError(null);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const imgFormData = new FormData();
        imgFormData.append("file", formData.display_pic_file);
        imgFormData.append("title", formData.display_pic_file.name);
        imgFormData.append("type", "IMAGE");
        const response = await axios.post(
          process.env.NEXT_PUBLIC_API_BASE_URL +
            "/resource/display-pic-resource/",
          imgFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        displayPicId = response.data.id;
      } catch (error) {
        setImageUploadError("Failed to upload image");
        setIsSubmitting(false);
        setImageUploading(false);
        return;
      } finally {
        setImageUploading(false);
      }
    }
    try {
      await onSubmit({
        ...formData,
        slug: generateSlug(formData.title),
        display_pic_id: displayPicId,
      });
      if (onPostSuccess) onPostSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#7e1a0b] mb-8">
          {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your blog post title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent outline-none ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
              disabled={categoriesLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categoriesLoading && (
              <p className="text-[#ff6600] text-sm mt-1">
                Loading categories...
              </p>
            )}
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="display_pic_file"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Blog Image *
            </label>
            <input
              type="file"
              id="display_pic_file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent outline-none"
            />
            {errors.display_pic_file && (
              <p className="text-red-500 text-sm mt-1">
                {errors.display_pic_file}
              </p>
            )}
            {imageUploading && (
              <p className="text-[#ff6600] text-sm mt-1">Uploading image...</p>
            )}
            {imageUploadError && (
              <p className="text-red-500 text-sm mt-1">{imageUploadError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
              placeholder="Write your blog post content here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_published: e.target.checked,
                }))
              }
              className="w-4 h-4 text-[#ff6600] border-gray-300 rounded focus:ring-[#ff6600]"
            />
            <label
              htmlFor="is_published"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#7e1a0b] text-white rounded-lg hover:bg-[#6d1609] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Post"
                : "Create Post"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    is_published: !prev.is_published,
                  }))
                }
                className={`px-8 py-3 rounded-lg font-medium ${
                  formData.is_published
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-[#ff6600] text-white hover:bg-[#e55a00]"
                }`}
              >
                {formData.is_published ? "Unpublish" : "Publish"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
