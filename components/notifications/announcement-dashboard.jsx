"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementComposer from "./announcement-composer";
import AnnouncementHistory from "./announcement-history";
import NotificationCenter from "./notification-center";
import {
  Campaign,
  Add,
  History,
  Notifications,
  NotificationsActive,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  fetchCoursesForAnnouncements,
  clearErrors,
  resetCreateStatus,
  resetDeleteStatus,
} from "@/utils/redux/slices/announcementSlice";

export default function AnnouncementDashboard({ userRole }) {
  const dispatch = useDispatch();
  const {
    announcements,
    courses,
    status,
    createStatus,
    deleteStatus,
    coursesStatus,
    error,
    createError,
    deleteError,
    total_count,
  } = useSelector((state) => state.announcements);

  const [activeTab, setActiveTab] = useState("create");
  const [showComposer, setShowComposer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch announcements and courses on component mount
  useEffect(() => {
    dispatch(fetchAnnouncements());
    dispatch(fetchCoursesForAnnouncements());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (createStatus === "succeeded") {
      toast.success("Announcement created successfully!");
      setShowComposer(false);
      dispatch(resetCreateStatus());
    } else if (createStatus === "failed" && createError) {
      toast.error(createError);
      dispatch(resetCreateStatus());
    }

    if (deleteStatus === "succeeded") {
      toast.success("Announcement deleted successfully!");
      dispatch(resetDeleteStatus());
    } else if (deleteStatus === "failed" && deleteError) {
      toast.error(deleteError);
      dispatch(resetDeleteStatus());
    }

    if (status === "failed" && error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [
    createStatus,
    deleteStatus,
    status,
    createError,
    deleteError,
    error,
    dispatch,
  ]);

  const handleSubmitAnnouncement = async (announcementData) => {
    dispatch(createAnnouncement(announcementData));
  };

  const handleMarkAsRead = (notificationId) => {
    console.log("Marking notification as read:", notificationId);
    // Implement API call
  };

  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read");
    // Implement API call
  };

  const handleDeleteNotification = (notificationId) => {
    console.log("Deleting notification:", notificationId);
    // Implement API call
  };

  const handleEditAnnouncement = (announcementId) => {
    console.log("Editing announcement:", announcementId);
    // Implement edit functionality
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    dispatch(deleteAnnouncement(announcementId));
  };

  const handleViewAnnouncement = (announcementId) => {
    console.log("Viewing announcement:", announcementId);
    // Implement view functionality
  };

  const mockNotifications = [
    {
      id: "1",
      title: "Assignment Reminder - Arabic Grammar",
      message:
        "Don't forget to submit your homework by Friday. The assignment covers chapters 1-3.",
      type: "reminder",
      senderName: "Ahmad Hassan",
      senderRole: "tutor",
      courseTitle: "Arabic Grammar Fundamentals",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z",
      hasAttachment: false,
      announcementId: "1",
    },
    {
      id: "2",
      title: "Platform Maintenance Notice",
      message:
        "The platform will be under maintenance this Saturday from 2-4 AM UTC.",
      type: "alert",
      senderName: "IHSAAN Admin",
      senderRole: "admin",
      isRead: true,
      createdAt: "2024-01-14T09:15:00Z",
      hasAttachment: false,
      announcementId: "2",
    },
  ];

  const unreadNotifications = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Announcement Center
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage your announcements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 text-gray-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                {unreadNotifications > 0 ? (
                  <NotificationsActive className="w-6 h-6" />
                ) : (
                  <Notifications className="w-6 h-6" />
                )}
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </div>
                )}
              </button>
              <button
                onClick={() => setShowComposer(true)}
                className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Add className="w-5 h-5" />
                Create Announcement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "create"
                    ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Campaign className="w-4 h-4" />
                Quick Create
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "history"
                    ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <History className="w-4 h-4" />
                History & Analytics
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "create" && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Campaign className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Create New Announcement
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Send important updates, reminders, or information to your
                  students and course participants.
                </p>
                <button
                  onClick={() => setShowComposer(true)}
                  className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 mx-auto"
                >
                  <Add className="w-6 h-6" />
                  Create Announcement
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <AnnouncementHistory
                userRole={userRole}
                announcements={announcements}
                total_count={total_count}
                onEdit={handleEditAnnouncement}
                onDelete={handleDeleteAnnouncement}
                onView={handleViewAnnouncement}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnnouncementComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        userRole={userRole}
        userCourses={courses}
        onSubmit={handleSubmitAnnouncement}
        isLoading={createStatus === "loading"}
      />

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={mockNotifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDeleteNotification}
      />
    </div>
  );
}
