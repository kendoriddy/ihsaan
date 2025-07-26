"use client";

import { useState } from "react";
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

export default function AnnouncementDashboard({ userRole }) {
  const [activeTab, setActiveTab] = useState("create");
  const [showComposer, setShowComposer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data - replace with actual API calls
  const mockCourses = [
    {
      id: "1",
      title: "Arabic Grammar Fundamentals",
      studentCount: 45,
      ordinaryUserCount: 12,
    },
    {
      id: "2",
      title: "Tajweed Mastery Course",
      studentCount: 78,
      ordinaryUserCount: 23,
    },
    {
      id: "3",
      title: "Islamic History Overview",
      studentCount: 32,
      ordinaryUserCount: 8,
    },
  ];

  const mockAnnouncements = [
    {
      id: "1",
      title: "Assignment Reminder - Arabic Grammar",
      message:
        "Don't forget to submit your homework by Friday. The assignment covers chapters 1-3.",
      type: "reminder",
      targetType: "students_per_course",
      courseTitle: "Arabic Grammar Fundamentals",
      recipientCount: 45,
      deliveredCount: 45,
      readCount: 38,
      createdAt: "2024-01-15T10:30:00Z",
      hasAttachments: false,
      canEdit: true,
      canDelete: true,
    },
    {
      id: "2",
      title: "New Course Material Available",
      message:
        "I've uploaded additional practice exercises for Tajweed. Check the resources section.",
      type: "informational",
      targetType: "students_per_course",
      courseTitle: "Tajweed Mastery Course",
      recipientCount: 78,
      deliveredCount: 78,
      readCount: 65,
      createdAt: "2024-01-12T14:20:00Z",
      hasAttachments: true,
      canEdit: true,
      canDelete: true,
    },
  ];

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

  const handleSubmitAnnouncement = (announcementData) => {
    console.log("Submitting announcement:", announcementData);
    // Implement API call to create announcement
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

  const handleDeleteAnnouncement = (announcementId) => {
    console.log("Deleting announcement:", announcementId);
    // Implement delete functionality
  };

  const handleViewAnnouncement = (announcementId) => {
    console.log("Viewing announcement:", announcementId);
    // Implement view functionality
  };

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
                announcements={mockAnnouncements}
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
        userCourses={mockCourses}
        onSubmit={handleSubmitAnnouncement}
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
