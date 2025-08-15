"use client";

import { useState } from "react";
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
} from "@mui/icons-material";

export default function StudentNotificationPage({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNavigateToCourse,
}) {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

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

  const filteredNotifications = notifications.filter((notification) => {
    const matchesReadFilter =
      filter === "all" ||
      (filter === "unread" && !notification.isRead) ||
      (filter === "read" && notification.isRead);

    const matchesTypeFilter =
      typeFilter === "all" || notification.type === typeFilter;

    return matchesReadFilter && matchesTypeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
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

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <FilterList className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filter by:
              </span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
            >
              <option value="all">All Types</option>
              <option value="informational">Informational</option>
              <option value="alert">Alerts</option>
              <option value="reminder">Reminders</option>
              <option value="promotional">Promotional</option>
            </select>
            <span className="text-sm text-gray-600 ml-auto">
              Showing {filteredNotifications.length} of {notifications.length}{" "}
              notifications
            </span>
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
                {filter === "all" && "No notifications available."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead
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
                        {!notification.isRead && (
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
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
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
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {selectedNotification.senderRole === "admin" ? (
                      <Public className="w-6 h-6 text-gray-600" />
                    ) : (
                      <Person className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedNotification.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      From {selectedNotification.senderName} (
                      {selectedNotification.senderRole})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Delete className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedNotification.courseTitle && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                  <School className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    {selectedNotification.courseTitle}
                  </span>
                  <button
                    onClick={() => {
                      if (selectedNotification.courseId) {
                        onNavigateToCourse(selectedNotification.courseId);
                        setSelectedNotification(null);
                      }
                    }}
                    className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Go to Course
                  </button>
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.hasAttachment && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AttachFile className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      Attachments
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    This announcement includes attachments. View the full
                    announcement to access them.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                Sent {formatDate(selectedNotification.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
