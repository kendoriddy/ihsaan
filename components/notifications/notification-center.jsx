"use client";

import { useState } from "react";
import {
  Notifications,
  NotificationsActive,
  Campaign,
  School,
  Person,
  Public,
  AttachFile,
  MarkEmailRead,
  Delete,
  FilterList,
  Close,
} from "@mui/icons-material";

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  if (!isOpen) return null;

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
        return <NotificationsActive className="w-4 h-4" />;
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
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center relative">
                <Notifications className="w-6 h-6 text-red-800" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Notifications
                </h2>
                <p className="text-gray-600 text-sm">
                  {unreadCount > 0
                    ? `${unreadCount} unread notifications`
                    : "All caught up!"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="px-4 py-2 text-sm bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2"
                >
                  <MarkEmailRead className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Close className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <FilterList className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white text-sm"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white text-sm"
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
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
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
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {notification.senderRole === "admin" ? (
                          <Public className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Person className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">
                            {notification.senderName}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            ({notification.senderRole})
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getTypeColor(
                              notification.type
                            )}`}
                          >
                            {getTypeIcon(notification.type)}
                            {notification.type}
                          </span>
                        </div>
                        {notification.courseTitle && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <School className="w-4 h-4" />
                            {notification.courseTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Mark as read"
                        >
                          <MarkEmailRead className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete notification"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {notification.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {notification.hasAttachment && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AttachFile className="w-4 h-4" />
                      <span>This announcement has attachments</span>
                    </div>
                  )}

                  {!notification.isRead && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
