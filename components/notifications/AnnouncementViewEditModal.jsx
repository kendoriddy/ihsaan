"use client";

import { useState, useEffect } from "react";
import {
  Close,
  Campaign,
  People,
  School,
  Person,
  Public,
  CalendarToday,
  Save,
  Edit,
  Eye,
} from "@mui/icons-material";

// Debug icon imports
console.log("Icon imports:", {
  Close: !!Close,
  Campaign: !!Campaign,
  People: !!People,
  School: !!School,
  Person: !!Person,
  Public: !!Public,
  CalendarToday: !!CalendarToday,
  Save: !!Save,
  Edit: !!Edit,
  Eye: !!Eye,
});

export default function AnnouncementViewEditModal({
  isOpen,
  onClose,
  announcement,
  userRole,
  userCourses,
  onSave,
  isLoading = false,
  mode = "view", // 'view' or 'edit'
}) {
  // Add debugging
  console.log("AnnouncementViewEditModal props:", {
    isOpen,
    announcement,
    userRole,
    userCourses,
    isLoading,
    mode,
  });

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

  const [isEditing, setIsEditing] = useState(mode === "edit");

  // Update form data when announcement changes
  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        content: announcement.content || "",
        announcement_type: announcement.announcement_type || "",
        announcement_class: announcement.announcement_class || "INFORMATIONAL",
        delivery_method: announcement.delivery_method || "IN_APP",
        course: announcement.course || "",
        term: announcement.term || "",
        is_active: announcement.is_active !== false,
      });
    }
  }, [announcement]);

  // Reset editing state when mode changes
  useEffect(() => {
    setIsEditing(mode === "edit");
  }, [mode]);

  // Validate required props
  if (!userRole) {
    console.error("userRole is required but not provided");
    return null;
  }

  if (!userCourses) {
    console.error("userCourses is required but not provided");
    return null;
  }

  if (!isOpen || !announcement) return null;

  // Ensure userRole is valid
  const validUserRole =
    userRole === "admin" || userRole === "tutor" ? userRole : "admin";

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
        icon: <Person className="w-4 h-4" />,
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
      icon: <Campaign className="w-5 h-5" />,
    },
    {
      value: "EMAIL",
      label: "Email Notification",
      icon: <Campaign className="w-5 h-5" />,
    },
    {
      value: "BOTH",
      label: "Both (In-app & Email)",
      icon: <Campaign className="w-5 h-5" />,
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

    onSave(announcement.id, payload);
  };

  const getTargetDescription = () => {
    if (!formData.announcement_type) return "";

    const selectedCourse = Array.isArray(userCourses)
      ? userCourses.find((course) => course.id === formData.course)
      : null;

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

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Debug logging
  console.log("Modal state:", {
    isEditing,
    mode,
    announcement: !!announcement,
  });
  console.log("isEditing value:", isEditing);
  console.log("mode value:", mode);
  console.log("announcement data:", announcement);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                {isEditing ? (
                  <Edit className="w-6 h-6 text-red-800" />
                ) : (
                  <Eye className="w-6 h-6 text-red-800" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? "Edit Announcement" : "View Announcement"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {isEditing
                    ? "Update announcement details"
                    : "View announcement information"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit announcement"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <Close className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Form/Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {console.log("Rendering content, isEditing:", isEditing)}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {console.log("Rendering EDIT form")}
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
                  {announcementTypes &&
                    announcementTypes.map((type) => (
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
                  {targetOptions[validUserRole] &&
                    targetOptions[validUserRole].map((option) => (
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
                    {Array.isArray(userCourses) &&
                      userCourses.map((course) => (
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
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
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
                  {deliveryMethods &&
                    deliveryMethods.map((method) => (
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
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel Edit
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-6">
              {console.log("Rendering VIEW content")}
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600">{announcement.content}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Type:
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        announcement.announcement_class === "INFORMATIONAL"
                          ? "bg-blue-100 text-blue-800"
                          : announcement.announcement_class === "ALERT"
                          ? "bg-red-100 text-red-800"
                          : announcement.announcement_class === "REMINDER"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {announcement.announcement_class}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Target:
                    </span>
                    <span className="text-sm text-gray-600">
                      {announcement.announcement_type_display ||
                        announcement.announcement_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Delivery:
                    </span>
                    <span className="text-sm text-gray-600">
                      {announcement.delivery_method_display ||
                        announcement.delivery_method}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        announcement.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {announcement.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              {announcement.course_name && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      Course: {announcement.course_name}
                    </span>
                  </div>
                </div>
              )}

              {/* Term Info */}
              {announcement.term_name && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <CalendarToday className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Term: {announcement.term_name}
                    </span>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <CalendarToday className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(announcement.created_at)}
                    </p>
                  </div>
                </div>

                {announcement.updated_at && (
                  <div className="flex items-center gap-3">
                    <CalendarToday className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Last Updated
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(announcement.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Timestamps */}
              {(announcement.scheduled_at || announcement.sent_at) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  {announcement.scheduled_at && (
                    <div className="flex items-center gap-3">
                      <CalendarToday className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Scheduled For
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(announcement.scheduled_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  {announcement.sent_at && (
                    <div className="flex items-center gap-3">
                      <CalendarToday className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Sent At
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(announcement.sent_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {announcement.total_recipients || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Recipients</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {announcement.in_app_sent || 0}
                  </div>
                  <div className="text-sm text-gray-600">In-App Sent</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {announcement.email_sent || 0}
                  </div>
                  <div className="text-sm text-gray-600">Email Sent</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {announcement.total_read || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Read</div>
                </div>
              </div>

              {/* Created By Info */}
              {announcement.created_by_name && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Person className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Created by:{" "}
                      <span className="font-medium">
                        {announcement.created_by_name}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
