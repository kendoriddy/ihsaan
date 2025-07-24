import { useState } from "react";
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

export default function FeedbackForm({ isOpen, onClose, userRole, onSubmit }) {
  const [formData, setFormData] = useState({
    entityType: "",
    entityId: "",
    content: "",
    rating: 0,
    attachment: null,
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const entityOptions = {
    ordinary: [
      {
        value: "course",
        label: "Course",
        icon: <MenuBook className="w-4 h-4" />,
      },
      {
        value: "resource",
        label: "Purchased Resource",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
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
        value: "resource",
        label: "Purchased Resource",
        icon: <AttachFile className="w-4 h-4" />,
      },
      {
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
      },
    ],
    tutor: [
      {
        value: "student",
        label: "Student",
        icon: <Person className="w-4 h-4" />,
      },
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
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
      },
    ],
    admin: [
      {
        value: "platform",
        label: "Platform Experience",
        icon: <Public className="w-4 h-4" />,
      },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      entityType: "",
      entityId: "",
      content: "",
      rating: 0,
      attachment: null,
    });
    onClose();
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
                        entityType: option.value,
                      }))
                    }
                    className={`p-4 border rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      formData.entityType === option.value
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
            {formData.entityType && formData.entityType !== "platform" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.entityType === "course" && "Course Name or ID"}
                  {formData.entityType === "tutor" && "Tutor Name or ID"}
                  {formData.entityType === "student" && "Student Name or ID"}
                  {formData.entityType === "resource" && "Resource Name or ID"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.entityId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      entityId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                  placeholder={`Enter ${formData.entityType} identifier...`}
                />
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
            </div>

            {/* Feedback Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 resize-none"
                placeholder="Share your thoughts, suggestions, or experiences..."
              />
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

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.entityType || !formData.content.trim()}
                className="flex-1 bg-red-800 hover:bg-red-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
