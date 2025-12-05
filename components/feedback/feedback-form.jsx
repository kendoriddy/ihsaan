import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Close,
  Feedback as FeedbackIcon,
  Star,
  StarBorder,
  Person,
  School,
  MenuBook,
  Public,
  AttachFile,
  Send,
} from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  createFeedback,
  uploadFeedbackResource,
  resetCreateStatus,
  resetUploadResourceStatus,
} from "@/utils/redux/slices/feedbackSlice";
import { fetchCourses } from "@/utils/redux/slices/courseSlice";
import { fetchTutors } from "@/utils/redux/slices/tutorSlice";
import { BOOKS } from "@/constants/books";

export default function FeedbackForm({ isOpen, onClose, userRole, onSubmit }) {
  const [formData, setFormData] = useState({
    subject: "",
    subject_id: "",
    message: "",
    rating: 0,
    country: "",
    attachment: null,
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    courses: [],
    tutors: [],
    books: BOOKS,
  });

  const dispatch = useDispatch();
  const {
    createStatus,
    createError,
    uploadResourceStatus,
    uploadResourceError,
  } = useSelector((state) => state.feedback);
  const { courses = [], status: coursesStatus = "idle" } = useSelector(
    (state) => state.course || {}
  );
  const { tutors = [], status: tutorsStatus = "idle" } = useSelector(
    (state) => state.tutor || {}
  );

  // Reset status when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      dispatch(resetCreateStatus());
      dispatch(resetUploadResourceStatus());

      // Fetch data for dropdowns
      try {
        dispatch(fetchCourses({ page: 1, coursesPerPage: 100 }));
        dispatch(
          fetchTutors({
            page: 1,
            pageSize: 100,
            endpoint: "/student-get-my-tutors/",
          })
        );
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    }
  }, [isOpen, dispatch]);

  // Handle successful submission
  useEffect(() => {
    if (createStatus === "succeeded") {
      setIsSubmitting(false);
      setFormData({
        subject: "",
        subject_id: "",
        message: "",
        rating: 0,
        country: "",
        attachment: null,
      });
      onClose();
    }
  }, [createStatus, onClose]);

  // Update dropdown data when Redux state changes
  useEffect(() => {
    if (courses && Array.isArray(courses) && courses.length > 0) {
      setDropdownData((prev) => ({ ...prev, courses }));
    }
  }, [courses, coursesStatus]);

  useEffect(() => {
    if (tutors && Array.isArray(tutors) && tutors.length > 0) {
      setDropdownData((prev) => ({ ...prev, tutors }));
    }
  }, [tutors, tutorsStatus]);

  if (!isOpen) return null;

  const entityOptions = {
    ordinary: [
      {
        value: "course",
        label: "Course",
        icon: <MenuBook className="w-4 h-4" />,
      },
      {
        value: "book",
        label: "Book",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
      },
      {
        value: "payment",
        label: "Payment",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "other",
        label: "Other",
        icon: <AttachFile className="w-4 h-4" />,
      },
    ],
    student: [
      {
        value: "course",
        label: "Course",
        icon: <MenuBook className="w-4 h-4" />,
      },
      { value: "tutor", label: "Tutor", icon: <Person className="w-4 h-4" /> },
      {
        value: "book",
        label: "Book",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
      },
      {
        value: "payment",
        label: "Payment",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "other",
        label: "Other",
        icon: <AttachFile className="w-4 h-4" />,
      },
    ],
    tutor: [
      {
        value: "course",
        label: "Course",
        icon: <MenuBook className="w-4 h-4" />,
      },
      {
        value: "tutor",
        label: "Other Tutor",
        icon: <School className="w-4 h-4" />,
      },
      {
        value: "book",
        label: "Book",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
      },
      {
        value: "payment",
        label: "Payment",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "other",
        label: "Other",
        icon: <AttachFile className="w-4 h-4" />,
      },
    ],
    admin: [
      {
        value: "course",
        label: "Course",
        icon: <MenuBook className="w-4 h-4" />,
      },
      {
        value: "book",
        label: "Book",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "tutor",
        label: "Tutor",
        icon: <Person className="w-4 h-4" />,
      },
      {
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
      },
      {
        value: "payment",
        label: "Payment",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "other",
        label: "Other",
        icon: <AttachFile className="w-4 h-4" />,
      },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: At least one of rating or content must be provided
    if (formData.rating === 0 && !formData.message.trim()) {
      setValidationError(
        "Please provide either a rating or feedback content (or both) before submitting."
      );
      return;
    }

    setValidationError(""); // Clear any previous errors
    setIsSubmitting(true);

    try {
      // Get user information from the API
      let userId, userEmail;

      try {
        const userResponse = await fetch(
          "https://api.ihsaanacademia.com/api/auth/logged-in-user/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user information");
        }

        const userData = await userResponse.json();
        userId = userData.id;
        userEmail = userData.email;
      } catch (userError) {
        console.error("Error fetching user info:", userError);
        setValidationError(
          "Failed to get user information. Please log in again."
        );
        setIsSubmitting(false);
        return;
      }

      if (!userId) {
        setValidationError("User ID not found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      let resourceId = null;

      // Upload file if attached
      if (formData.attachment) {
        const formDataFile = new FormData();
        formDataFile.append("file", formData.attachment);
        formDataFile.append("title", formData.attachment.name);
        formDataFile.append("type", getFileType(formData.attachment.type));
        formDataFile.append("sender", userId);

        const uploadResult = await dispatch(
          uploadFeedbackResource(formDataFile)
        ).unwrap();
        resourceId = uploadResult.id;
      }

      // Prepare feedback data according to API specification
      const feedbackData = {
        user: userId,
        email: userEmail,
        subject: formData.subject,
        subject_id: formData.subject_id || "",
        country: formData.country || "",
        message: formData.message,
        rating: formData.rating > 0 ? formData.rating : null,
        ...(resourceId && { resource: resourceId }),
      };

      // Submit feedback
      await dispatch(createFeedback(feedbackData)).unwrap();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setValidationError(
        error.message || "Failed to submit feedback. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith("audio/")) return "AUDIO";
    if (mimeType.startsWith("video/")) return "VIDEO";
    if (mimeType.startsWith("image/")) return "IMAGE";
    if (mimeType.includes("pdf") || mimeType.includes("document"))
      return "DOCUMENT";
    return "OTHERS";
  };

  // Helper function to get subject detail for display
  const getSubjectDetail = (subject, subjectId) => {
    if (!subjectId) return subject;

    switch (subject) {
      case "course":
        return `Course ID: ${subjectId}`;
      case "tutor":
        return `Tutor ID: ${subjectId}`;
      case "book":
        return `Book ID: ${subjectId}`;
      default:
        return subjectId;
    }
  };

  // Helper function to get dropdown options for each subject type
  const getSubjectOptions = (subjectType) => {
    switch (subjectType) {
      case "course":
        return (dropdownData.courses || []).map((course) => ({
          value: course.id,
          label: course.title || course.name || `Course ${course.id}`,
        }));
      case "tutor":
        return (dropdownData.tutors || []).map((tutor) => ({
          value: tutor.id,
          label:
            tutor.first_name && tutor.last_name
              ? `${tutor.first_name} ${tutor.last_name}`
              : tutor.name || `Tutor ${tutor.id}`,
        }));
      case "book":
        return (dropdownData.books || []).map((book) => ({
          value: book.id,
          label: book.title || `Book ${book.id}`,
        }));
      default:
        return [];
    }
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoveredRating || formData.rating);

      return (
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-colors hover:scale-110 transform duration-200"
        >
          {isFilled ? (
            <Star className="w-8 h-8 text-yellow-400" />
          ) : (
            <StarBorder className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
          )}
        </button>
      );
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="feedback-modal-title"
      aria-describedby="feedback-modal-description"
    >
      <Box className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FeedbackIcon className="w-6 h-6 text-red-800" />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold text-gray-800"
                    id="feedback-modal-title"
                  >
                    Share Your Feedback
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Help us improve your experience
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Close className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6"
            id="feedback-modal-description"
          >
            {/* Entity Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What would you like to give feedback on? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entityOptions[userRole].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: option.value,
                        subject_id: "", // Reset subject_id when subject type changes
                      }))
                    }
                    className={`p-4 border rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      formData.subject === option.value
                        ? "border-red-800 bg-red-50 text-red-800 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Entity ID Input */}
            {formData.subject &&
              formData.subject !== "platform" &&
              formData.subject !== "payment" &&
              formData.subject !== "other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.subject === "course" && "Select Course"}
                    {formData.subject === "tutor" && "Select Tutor"}
                    {formData.subject === "book" && "Select Book"}
                  </label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subject_id: e.target.value,
                      }))
                    }
                    disabled={
                      (formData.subject === "course" &&
                        coursesStatus === "loading") ||
                      (formData.subject === "tutor" &&
                        tutorsStatus === "loading")
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {(formData.subject === "course" &&
                        coursesStatus === "loading") ||
                      (formData.subject === "tutor" &&
                        tutorsStatus === "loading")
                        ? `Loading ${formData.subject}s...`
                        : `Select a ${formData.subject}...`}
                    </option>
                    {getSubjectOptions(formData.subject).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formData.subject_id && (
                    <p className="text-sm text-gray-600 mt-1">
                      {getSubjectDetail(formData.subject, formData.subject_id)}
                    </p>
                  )}

                  {/* Loading indicator and status messages */}
                  {(formData.subject === "course" &&
                    coursesStatus === "loading") ||
                  (formData.subject === "tutor" &&
                    tutorsStatus === "loading") ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-800"></div>
                      <p className="text-xs text-gray-500">
                        Loading {formData.subject}s...
                      </p>
                    </div>
                  ) : getSubjectOptions(formData.subject).length === 0 ? (
                    <div className="mt-1">
                      <p className="text-xs text-red-500">
                        ⚠️ No {formData.subject}s available. Please try again
                        later.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        This might be due to network issues or no{" "}
                        {formData.subject}s being available.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.subject === "course") {
                            dispatch(
                              fetchCourses({ page: 1, coursesPerPage: 100 })
                            );
                          } else if (formData.subject === "tutor") {
                            dispatch(
                              fetchTutors({
                                page: 1,
                                pageSize: 100,
                                endpoint: "/student-get-my-tutors/",
                              })
                            );
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                      >
                        Retry loading {formData.subject}s
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      * Required for {formData.subject} feedback
                    </p>
                  )}
                </div>
              )}

            {/* Country Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country (Optional)
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                placeholder="Enter your country..."
              />
            </div>

            {/* Info for subjects that don't need ID */}
            {formData.subject &&
              (formData.subject === "platform" ||
                formData.subject === "payment" ||
                formData.subject === "other") && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-700 text-sm">
                    💡{" "}
                    {formData.subject === "platform" &&
                      "Platform feedback doesn't require a specific ID."}
                    {formData.subject === "payment" &&
                      "Payment feedback doesn't require a specific ID."}
                    {formData.subject === "other" &&
                      "Other feedback doesn't require a specific ID."}
                  </p>
                </div>
              )}

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rating (Optional)
              </label>
              <div className="flex items-center gap-1">{renderStars()}</div>
              {formData.rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Good"}
                  {formData.rating === 4 && "Very Good"}
                  {formData.rating === 5 && "Excellent"}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: You must provide either a rating or feedback content (or
                both)
              </p>
            </div>

            {/* Feedback Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                rows={6}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 resize-none"
                placeholder="Share your thoughts, suggestions, or experiences..."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: You must provide either a rating or feedback content (or
                both)
              </p>
            </div>

            {/* File Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachment (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 transition-colors">
                <input
                  type="file"
                  id="attachment"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="attachment" className="cursor-pointer">
                  <AttachFile className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.attachment
                      ? formData.attachment.name
                      : "Click to upload a file"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Images, PDF, or Word documents
                  </p>
                </label>
              </div>
            </div>

            {/* Error Messages */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{validationError}</p>
              </div>
            )}

            {createError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{createError}</p>
              </div>
            )}

            {uploadResourceError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">
                  File upload error: {uploadResourceError}
                </p>
              </div>
            )}

            {/* Success Message */}
            {createStatus === "succeeded" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm">
                  ✅ Feedback submitted successfully! Thank you for your input.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={
                  isSubmitting ||
                  createStatus === "loading" ||
                  uploadResourceStatus === "loading"
                }
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !formData.subject ||
                  (formData.rating === 0 && !formData.message.trim()) ||
                  (formData.subject !== "platform" &&
                    formData.subject !== "payment" &&
                    formData.subject !== "other" &&
                    !formData.subject_id.trim()) ||
                  isSubmitting ||
                  createStatus === "loading" ||
                  uploadResourceStatus === "loading"
                }
                className="flex-1 bg-red-800 hover:bg-red-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ||
                createStatus === "loading" ||
                uploadResourceStatus === "loading" ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
