"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import Header from "@/components/Header";
import StudentNotificationPage from "@/components/notifications/student-notification-page";
import { toast } from "react-toastify";
import {
  fetchUserNotifications,
  fetchRecentNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearErrors,
  resetMarkReadStatus,
  resetMarkAllReadStatus,
  resetDeleteStatus,
} from "@/utils/redux/slices/notificationSlice";

function Page() {
  const dispatch = useDispatch();
  const {
    notifications,
    total_count,
    status,
    markReadStatus,
    markAllReadStatus,
    deleteStatus,
    error,
    markReadError,
    markAllReadError,
    deleteError,
  } = useSelector((state) => state.notifications);

  const currentRoute = usePathname();

  // Fetch notifications, recent notifications, and unread count on component mount
  useEffect(() => {
    dispatch(fetchUserNotifications());
    dispatch(fetchRecentNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (markReadStatus === "succeeded") {
      toast.success("Notification marked as read!");
      dispatch(resetMarkReadStatus());
    } else if (markReadStatus === "failed" && markReadError) {
      toast.error(markReadError);
      dispatch(resetMarkReadStatus());
    }

    if (markAllReadStatus === "succeeded") {
      toast.success("All notifications marked as read!");
      dispatch(resetMarkAllReadStatus());
    } else if (markAllReadStatus === "failed" && markAllReadError) {
      toast.error(markAllReadError);
      dispatch(resetMarkAllReadStatus());
    }

    if (deleteStatus === "succeeded") {
      toast.success("Notification deleted successfully!");
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
    markReadStatus,
    markAllReadStatus,
    deleteStatus,
    status,
    markReadError,
    markAllReadError,
    deleteError,
    error,
    dispatch,
  ]);

  const handleMarkAsRead = (notificationId) => {
    // Find the notification object by ID
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      dispatch(markNotificationAsRead(notification));
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDeleteNotification = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    // Navigate to relevant page or show details
  };

  const handleNavigateToCourse = (courseId) => {
    console.log("Navigating to course:", courseId);
    // Implement navigation to course
  };

  // Map API data structure to component expectations
  const mappedNotifications =
    notifications?.map((notification) => ({
      id: notification.id,
      title: notification.title || notification.message,
      message: notification.content || notification.message,
      type: notification.type || notification.notification_type?.toLowerCase(),
      senderName:
        notification.sender_name || notification.sender?.name || "System",
      senderRole:
        notification.sender_role || notification.sender?.role || "admin",
      courseTitle: notification.course_title || notification.course?.title,
      courseId: notification.course_id || notification.course?.id,
      isRead: notification.is_read || false,
      createdAt: notification.created_at || notification.created_at,
      hasAttachment: notification.has_attachment || false,
      announcementId: notification.announcement_id,
    })) || [];

  return (
    <>
      <Header />
      <main className="py-2 flex">
        <DashboardSidebar currentRoute={currentRoute} />
        <div className="px-4 w-full py-8 lg:py-0">
          <div className="">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      Notifications
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Stay updated with your latest notifications
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="py-8">
              {status === "loading" ? (
                <div className="max-w-6xl mx-auto px-4 py-8">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Loading Notifications
                    </h2>
                    <p className="text-gray-600">
                      Please wait while we fetch your notifications...
                    </p>
                  </div>
                </div>
              ) : (
                <StudentNotificationPage
                  notifications={mappedNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDelete={handleDeleteNotification}
                  onNavigateToCourse={handleNavigateToCourse}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Page;
