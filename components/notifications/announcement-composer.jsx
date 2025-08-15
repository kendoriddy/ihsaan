"use client";

import { useState } from "react";
import {
  Close,
  Campaign,
  People,
  School,
  Person,
  Public,
  CalendarToday,
  AttachFile,
  Send,
  Email,
  Notifications,
  Delete,
} from "@mui/icons-material";

export default function AnnouncementComposer({
  isOpen,
  onClose,
  userRole,
  userCourses,
  onSubmit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    announcement_type: "",
    announcement_class: "INFORMATIONAL",
    delivery_method: "IN_APP",
    course: "",
    term: "",
    is_active: true,
  });

  if (!isOpen) return null;

  const targetOptions = {
    tutor: [
      {
        value: "STUDENTS_OFFERING_COURSE",
        label: "Students in Course",
        icon: <School className="w-4 h-4" />,
      },
      {
        value: "ORDINARY_USERS_OFFERING_COURSE",
        label: "Course Buyers",
        icon: <Person className="w-4 h-4" />,
      },
    ],
    admin: [
      {
        value: "ALL_USERS",
        label: "All Users",
        icon: <Public className="w-4 h-4" />,
      },
      {
        value: "ALL_STUDENTS",
        label: "All Students",
        icon: <School className="w-4 h-4" />,
      },
      {
        value: "ALL_TUTORS",
        label: "All Tutors",
        icon: <People className="w-4 h-4" />,
      },
      {
        value: "ORDINARY_USERS",
        label: "All Ordinary Users",
        icon: <Person className="w-4 h-4" />,
      },
      {
        value: "STUDENTS_OFFERING_COURSE",
        label: "Students in Course",
        icon: <School className="w-4 h-4" />,
      },
      {
        value: "ORDINARY_USERS_OFFERING_COURSE",
        label: "Course Buyers",
        icon: <Person className="w-4 h-4" />,
      },
      {
        value: "TUTORS_TEACHING_COURSE",
        label: "Tutors Teaching Course",
        icon: <People className="w-4 h-4" />,
      },
    ],
  };

  const announcementTypes = [
    {
      value: "INFORMATIONAL",
      label: "Informational",
      color: "bg-blue-100 text-blue-800",
    },
    { value: "ALERT", label: "Alert", color: "bg-red-100 text-red-800" },
    {
      value: "REMINDER",
      label: "Reminder",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "PROMOTIONAL",
      label: "Promotional",
      color: "bg-green-100 text-green-800",
    },
  ];

  const deliveryMethods = [
    {
      value: "IN_APP",
      label: "In-app Notification",
      icon: <Notifications className="w-5 h-5" />,
    },
    {
      value: "EMAIL",
      label: "Email Notification",
      icon: <Email className="w-5 h-5" />,
    },
    {
      value: "BOTH",
      label: "Both (In-app & Email)",
      icon: <Notifications className="w-5 h-5" />,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the payload for API
    const payload = {
      title: formData.title,
      content: formData.content,
      announcement_type: formData.announcement_type,
      announcement_class: formData.announcement_class,
      delivery_method: formData.delivery_method,
      is_active: formData.is_active,
    };

    // Add course and term only if they are provided
    if (formData.course) {
      payload.course = parseInt(formData.course);
    }
    if (formData.term) {
      payload.term = parseInt(formData.term);
    }

    onSubmit(payload);

    // Reset form
    setFormData({
      title: "",
      content: "",
      announcement_type: "",
      announcement_class: "INFORMATIONAL",
      delivery_method: "IN_APP",
      course: "",
      term: "",
      is_active: true,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const getTargetDescription = () => {
    if (!formData.announcement_type) return "";

    const selectedCourse = userCourses.find(
      (course) => course.id === formData.course
    );

    switch (formData.announcement_type) {
      case "ALL_USERS":
        return "All platform users will receive this announcement";
      case "ALL_STUDENTS":
        return "All enrolled students will receive this announcement";
      case "ALL_TUTORS":
        return "All tutors will receive this announcement";
      case "ORDINARY_USERS":
        return "All ordinary users will receive this announcement";
      case "STUDENTS_OFFERING_COURSE":
        return selectedCourse
          ? `${selectedCourse.studentCount} students in "${selectedCourse.title}" will receive this`
          : "Select a course to see recipient count";
      case "ORDINARY_USERS_OFFERING_COURSE":
        return selectedCourse
          ? `${selectedCourse.ordinaryUserCount} buyers of "${selectedCourse.title}" will receive this`
          : "Select a course to see recipient count";
      case "TUTORS_TEACHING_COURSE":
        return selectedCourse
          ? `Tutors teaching "${selectedCourse.title}" will receive this`
          : "Select a course to see recipient count";
      default:
        return "";
    }
  };

  const needsCourseSelection = formData.announcement_type.includes("_COURSE");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Campaign className="w-6 h-6 text-red-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Create Announcement
                </h2>
                <p className="text-gray-600 text-sm">
                  Send important updates to your audience
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <Close className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                placeholder="Enter announcement title..."
                disabled={isLoading}
              />
            </div>

            {/* Announcement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Announcement Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {announcementTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        announcement_class: type.value,
                      }))
                    }
                    className={`p-3 border rounded-xl transition-all duration-200 ${
                      formData.announcement_class === type.value
                        ? "border-red-800 bg-red-50 text-red-800 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={isLoading}
                  >
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${type.color} mb-1`}
                    >
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Audience *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {targetOptions[userRole].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        announcement_type: option.value,
                        course: "",
                      }))
                    }
                    className={`p-4 border rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      formData.announcement_type === option.value
                        ? "border-red-800 bg-red-50 text-red-800 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={isLoading}
                  >
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Selection */}
            {needsCourseSelection && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course *
                </label>
                <select
                  required
                  value={formData.course}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      course: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Choose a course...</option>
                  {userCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.studentCount} students,{" "}
                      {course.ordinaryUserCount} buyers)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Description */}
            {formData.announcement_type && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <People className="w-4 h-4" />
                  {getTargetDescription()}
                </p>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 resize-none"
                placeholder="Write your announcement message..."
                disabled={isLoading}
              />
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Method
              </label>
              <div className="space-y-3">
                {deliveryMethods.map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="delivery_method"
                      value={method.value}
                      checked={formData.delivery_method === method.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          delivery_method: e.target.value,
                        }))
                      }
                      className="w-4 h-4 text-red-800 border-gray-300 focus:ring-red-700"
                      disabled={isLoading}
                    />
                    {method.icon}
                    <span className="text-sm text-gray-700">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !formData.title ||
                  !formData.content ||
                  !formData.announcement_type ||
                  (needsCourseSelection && !formData.course) ||
                  isLoading
                }
                className="flex-1 bg-red-800 hover:bg-red-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Announcement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
