"use client";

import { useState, useRef, useEffect } from "react";
import {
  Notifications,
  NotificationsActive,
  School,
  Person,
  Public,
  AttachFile,
  MarkEmailRead,
  Close,
} from "@mui/icons-material";

export default function StudentNotificationBell({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  onViewAll,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const recentNotifications = notifications.slice(0, 5); // Show only 5 most recent

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onNotificationClick(notification);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-gray-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
      >
        {unreadNotifications.length > 0 ? (
          <NotificationsActive className="w-6 h-6" />
        ) : (
          <Notifications className="w-6 h-6" />
        )}

        {/* Unread Badge */}
        {unreadNotifications.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-600">
                  {unreadNotifications.length > 0
                    ? `${unreadNotifications.length} unread notifications`
                    : "All caught up!"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      onMarkAllAsRead();
                      setIsOpen(false);
                    }}
                    className="text-xs bg-red-800 text-white px-3 py-1 rounded-full hover:bg-red-900 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Close className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Notifications className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Sender Avatar */}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        {notification.senderRole === "admin" ? (
                          <Public className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Person className="w-4 h-4 text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {notification.senderName}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(
                              notification.type
                            )}`}
                          >
                            {notification.type}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>

                        {/* Course Info */}
                        {notification.courseTitle && (
                          <div className="flex items-center gap-1 mb-2">
                            <School className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600 truncate">
                              {notification.courseTitle}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">
                          {notification.title}
                        </h4>

                        {/* Message Preview */}
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <div className="flex items-center gap-1">
                            {notification.hasAttachment && (
                              <AttachFile className="w-3 h-3 text-gray-400" />
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Mark as read"
                              >
                                <MarkEmailRead className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                onViewAll();
                setIsOpen(false);
              }}
              className="w-full text-center text-sm text-red-800 hover:text-red-900 font-medium py-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
