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
}) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetType: "",
    courseId: "",
    expiresAt: "",
    notifyVia: {
      inApp: true,
      email: false,
      push: false,
    },
    attachments: [],
    announcementType: "informational",
  });

  if (!isOpen) return null;

  const targetOptions = {
    tutor: [
      {
        value: "students_per_course",
        label: "Students in Course",
        icon: <School className="w-4 h-4" />,
      },
      {
        value: "ordinary_users_per_course",
        label: "Course Buyers",
        icon: <Person className="w-4 h-4" />,
      },
    ],
    admin: [
      {
        value: "all_users",
        label: "All Users",
        icon: <Public className="w-4 h-4" />,
      },
      {
        value: "all_students",
        label: "All Students",
        icon: <School className="w-4 h-4" />,
      },
      {
        value: "all_tutors",
        label: "All Tutors",
        icon: <People className="w-4 h-4" />,
      },
      {
        value: "all_ordinary_users",
        label: "All Ordinary Users",
        icon: <Person className="w-4 h-4" />,
      },
      {
        value: "students_per_course",
        label: "Students in Course",
        icon: <School className="w-4 h-4" />,
      },
      {
        value: "ordinary_users_per_course",
        label: "Course Buyers",
        icon: <Person className="w-4 h-4" />,
      },
    ],
  };

  const announcementTypes = [
    {
      value: "informational",
      label: "Informational",
      color: "bg-blue-100 text-blue-800",
    },
    { value: "alert", label: "Alert", color: "bg-red-100 text-red-800" },
    {
      value: "reminder",
      label: "Reminder",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "promotional",
      label: "Promotional",
      color: "bg-green-100 text-green-800",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      message: "",
      targetType: "",
      courseId: "",
      expiresAt: "",
      notifyVia: { inApp: true, email: false, push: false },
      attachments: [],
      announcementType: "informational",
    });
    onClose();
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
    if (!formData.targetType) return "";

    const selectedCourse = userCourses.find(
      (course) => course.id === formData.courseId
    );

    switch (formData.targetType) {
      case "all_users":
        return "All platform users will receive this announcement";
      case "all_students":
        return "All enrolled students will receive this announcement";
      case "all_tutors":
        return "All tutors will receive this announcement";
      case "all_ordinary_users":
        return "All ordinary users will receive this announcement";
      case "students_per_course":
        return selectedCourse
          ? `${selectedCourse.studentCount} students in "${selectedCourse.title}" will receive this`
          : "Select a course to see recipient count";
      case "ordinary_users_per_course":
        return selectedCourse
          ? `${selectedCourse.ordinaryUserCount} buyers of "${selectedCourse.title}" will receive this`
          : "Select a course to see recipient count";
      default:
        return "";
    }
  };

  const needsCourseSelection = formData.targetType.includes("per_course");

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
                        announcementType: type.value,
                      }))
                    }
                    className={`p-3 border rounded-xl transition-all duration-200 ${
                      formData.announcementType === type.value
                        ? "border-red-800 bg-red-50 text-red-800 ring-2 ring-red-200"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
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
                        targetType: option.value,
                        courseId: "",
                      }))
                    }
                    className={`p-4 border rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      formData.targetType === option.value
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

            {/* Course Selection */}
            {needsCourseSelection && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course *
                </label>
                <select
                  required
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      courseId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
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
            {formData.targetType && (
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
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 resize-none"
                placeholder="Write your announcement message..."
              />
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date (Optional)
                <span className="text-xs text-gray-500 ml-2">
                  Leave empty for permanent announcement
                </span>
              </label>
              <div className="relative">
                <CalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiresAt: e.target.value,
                    }))
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200"
                />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 transition-colors">
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3"
                />
                <label htmlFor="attachments" className="cursor-pointer">
                  <AttachFile className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload files</p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, Word, Images, Videos, Audio
                  </p>
                </label>
              </div>

              {/* Attachment List */}
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2">
                        <AttachFile className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Notify Recipients Via
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifyVia.inApp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notifyVia: {
                          ...prev.notifyVia,
                          inApp: e.target.checked,
                        },
                      }))
                    }
                    className="w-4 h-4 text-red-800 border-gray-300 rounded focus:ring-red-700"
                  />
                  <Notifications className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    In-app Notification
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifyVia.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notifyVia: {
                          ...prev.notifyVia,
                          email: e.target.checked,
                        },
                      }))
                    }
                    className="w-4 h-4 text-red-800 border-gray-300 rounded focus:ring-red-700"
                  />
                  <Email className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Email Notification
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !formData.title || !formData.message || !formData.targetType
                }
                className="flex-1 bg-red-800 hover:bg-red-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Announcement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
