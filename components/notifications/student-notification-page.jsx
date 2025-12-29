"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Notifications,
  Campaign,
  School,
  Person,
  Public,
  AttachFile,
  MarkEmailRead,
  Delete,
  FilterList,
  Settings,
  OpenInNew,
  Close,
  CalendarToday,
  AccessTime,
  CheckCircle,
  Refresh,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchNotificationById,
  fetchRecentNotifications,
  fetchUnreadCount,
  clearSelectedNotification,
  resetFetchDetailStatus,
  resetRecentStatus,
  resetUnreadCountStatus,
} from "@/utils/redux/slices/notificationSlice";

export default function StudentNotificationPage({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNavigateToCourse,
}) {
  const dispatch = useDispatch();
  const {
    selectedNotification,
    fetchDetailStatus,
    fetchDetailError,
    recentNotifications,
    recentStatus,
    recentError,
    unreadCount: apiUnreadCount,
    unreadCountStatus,
    unreadCountError,
  } = useSelector((state) => state.notifications);

  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("all"); // 'all' | 'recent'

  // Fetch recent notifications and unread count on component mount
  useEffect(() => {
    dispatch(fetchRecentNotifications());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Handle success/error messages for notification detail fetch
  useEffect(() => {
    if (fetchDetailStatus === "failed" && fetchDetailError) {
      toast.error(fetchDetailError);
      dispatch(resetFetchDetailStatus());
    }
  }, [fetchDetailStatus, fetchDetailError, dispatch]);

  // Handle success/error messages for recent notifications
  useEffect(() => {
    if (recentStatus === "failed" && recentError) {
      toast.error(recentError);
      dispatch(resetRecentStatus());
    }
  }, [recentStatus, recentError, dispatch]);

  // Handle success/error messages for unread count
  useEffect(() => {
    if (unreadCountStatus === "failed" && unreadCountError) {
      toast.error(unreadCountError);
      dispatch(resetUnreadCountStatus());
    }
  }, [unreadCountStatus, unreadCountError, dispatch]);

  const getTypeColor = (type) => {
    switch (type) {
      case "informational":
        return "bg-blue-100 text-blue-800";
      case "alert":
        return "bg-red-100 text-red-800";
      case "reminder":
        return "bg-yellow-100 text-yellow-800";
      case "promotional":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "informational":
        return <Campaign className="w-4 h-4" />;
      case "alert":
        return <Notifications className="w-4 h-4" />;
      case "reminder":
        return <Notifications className="w-4 h-4" />;
      case "promotional":
        return <Campaign className="w-4 h-4" />;
      default:
        return <Notifications className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Determine which notifications to show based on view mode
  const displayNotifications =
    viewMode === "recent" ? recentNotifications : notifications;

  // Helper function to check if notification is read (handles both isRead and is_read)
  const isNotificationRead = (notification) => {
    return notification.is_read || notification.isRead || false;
  };

  // Filter notifications based on read status
  const filteredNotifications = displayNotifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !isNotificationRead(notification);
    if (filter === "read") return isNotificationRead(notification);
    return true;
  });

  // Use API unread count if available, otherwise fallback to local calculation
  const unreadCount =
    apiUnreadCount || notifications.filter((n) => !isNotificationRead(n)).length;

  const handleNotificationClick = (notification) => {
    // Fetch notification details from API
    dispatch(fetchNotificationById(notification.id));
  };

  const handleCloseModal = () => {
    dispatch(clearSelectedNotification());
  };

  const handleRefreshRecent = () => {
    dispatch(fetchRecentNotifications());
    dispatch(fetchUnreadCount());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Notifications
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <MarkEmailRead className="w-4 h-4" />
                Mark All Read
              </button>
            )}
            <button
              onClick={handleRefreshRecent}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh recent notifications"
            >
              <Refresh className="w-5 h-5" />
            </button>
            {/* <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Notifications className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {notifications.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Notifications className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {unreadCount}
              </div>
              <div className="text-sm text-gray-600">Unread</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {notifications.filter((n) => n.courseTitle).length}
              </div>
              <div className="text-sm text-gray-600">Course Related</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Public className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {notifications.filter((n) => n.senderRole === "admin").length}
              </div>
              <div className="text-sm text-gray-600">From Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("all")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "all"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  All Notifications
                </button>
                <button
                  onClick={() => setViewMode("recent")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === "recent"
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Recent Only
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FilterList className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Filter:
                </span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
              >
                <option value="all">All</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>

            {/* Status Info */}
            <div className="text-sm text-gray-600">
              {viewMode === "recent" ? (
                <span>
                  Showing {filteredNotifications.length} recent notifications
                </span>
              ) : (
                <span>
                  Showing {filteredNotifications.length} of{" "}
                  {notifications.length} notifications
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Notifications className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500">
                {filter === "unread" &&
                  "You're all caught up! No unread notifications."}
                {filter === "read" && "No read notifications found."}
                {filter === "all" &&
                  viewMode === "recent" &&
                  "No recent notifications available."}
                {filter === "all" &&
                  viewMode === "all" &&
                  "No notifications available."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !isNotificationRead(notification)
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Sender Avatar */}
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {notification.senderRole === "admin" ? (
                        <Public className="w-6 h-6 text-gray-600" />
                      ) : (
                        <Person className="w-6 h-6 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-800">
                          {notification.senderName}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">
                          ({notification.senderRole})
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          {notification.type}
                        </span>
                        {!isNotificationRead(notification) && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>

                      {/* Course Info */}
                      {notification.courseTitle && (
                        <div className="flex items-center gap-2 mb-2">
                          <School className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {notification.courseTitle}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notification.courseId) {
                                onNavigateToCourse(notification.courseId);
                              }
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Go to course"
                          >
                            <OpenInNew className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {notification.title}
                      </h3>

                      {/* Message */}
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {notification.message}
                      </p>

                      {/* Attachments */}
                      {notification.hasAttachment && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <AttachFile className="w-4 h-4" />
                          <span>This announcement has attachments</span>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {!isNotificationRead(notification) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="text-sm text-primary hover:text-blue-800 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {/* <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Notifications className="w-6 h-6 text-red-800" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Notification Details
                    </h2>
                    <p className="text-gray-600 text-sm">
                      View complete notification information
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Close className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
              {fetchDetailStatus === "loading" ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-red-200 border-t-red-800 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading notification details...
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Notification Type Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(
                        selectedNotification.notification_type?.toLowerCase()
                      )}`}
                    >
                      {selectedNotification.notification_type_display ||
                        selectedNotification.notification_type}
                    </span>
                    {selectedNotification.is_read && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Read</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {selectedNotification.title}
                    </h3>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedNotification.message}
                    </p>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <CalendarToday className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Created
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(selectedNotification.created_at)}
                        </p>
                      </div>
                    </div>

                    {selectedNotification.read_at && (
                      <div className="flex items-center gap-3">
                        <AccessTime className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Read At
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(selectedNotification.read_at)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time Since Created */}
                  {selectedNotification.time_since_created && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Time since created:</span>{" "}
                        {selectedNotification.time_since_created}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
