"use client";

import { useState } from "react";
import {
  Campaign,
  Person,
  AttachFile,
  FilterList,
  Download,
  OpenInNew,
} from "@mui/icons-material";

export default function StudentCourseAnnouncements({
  courseTitle,
  courseId,
  announcements,
  onMarkAsRead,
  onDownloadAttachment,
}) {
  const [filter, setFilter] = useState("all");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      if (filter === "unread") return !announcement.isRead;
      if (filter === "pinned") return announcement.isPinned;
      return true;
    })
    .sort((a, b) => {
      // Pinned announcements first, then by date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleAnnouncementClick = (announcement) => {
    if (!announcement.isRead) {
      onMarkAsRead(announcement.id);
    }
    setSelectedAnnouncement(announcement);
  };

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Course Announcements
            </h2>
            <p className="text-gray-600">{courseTitle}</p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {unreadCount} unread
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-4">
          <FilterList className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
          >
            <option value="all">All Announcements</option>
            <option value="unread">Unread Only</option>
            <option value="pinned">Pinned Only</option>
          </select>
          <span className="text-sm text-gray-600 ml-auto">
            Showing {filteredAnnouncements.length} announcements
          </span>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Campaign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-500">
              {filter === "unread" &&
                "You're all caught up! No unread announcements."}
              {filter === "pinned" && "No pinned announcements in this course."}
              {filter === "all" &&
                "No announcements available for this course."}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md cursor-pointer transition-all duration-200 ${
                !announcement.isRead ? "ring-2 ring-blue-200 bg-blue-50" : ""
              } ${
                announcement.isPinned
                  ? "ring-2 ring-yellow-200 bg-yellow-50"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Tutor Avatar */}
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Person className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-800">
                        {announcement.senderName}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                          announcement.type
                        )}`}
                      >
                        {announcement.type}
                      </span>
                      {announcement.isPinned && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Pinned
                        </span>
                      )}
                      {!announcement.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {announcement.title}
                    </h3>

                    {/* Message Preview */}
                    <p className="text-gray-700 leading-relaxed line-clamp-3 mb-3">
                      {announcement.message}
                    </p>

                    {/* Attachments Preview */}
                    {announcement.hasAttachment && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <AttachFile className="w-4 h-4" />
                        <span>
                          {announcement.attachments?.length || 1} attachment(s)
                        </span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatDate(announcement.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!announcement.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(announcement.id);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnnouncementClick(announcement);
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
                        >
                          <OpenInNew className="w-3 h-3" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Person className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedAnnouncement.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      From {selectedAnnouncement.senderName} •{" "}
                      {formatDate(selectedAnnouncement.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.message}
                </p>
              </div>

              {/* Attachments */}
              {selectedAnnouncement.attachments &&
                selectedAnnouncement.attachments.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AttachFile className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-800">
                        Attachments
                      </span>
                    </div>
                    <div className="space-y-3">
                      {selectedAnnouncement.attachments.map(
                        (attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <AttachFile className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {attachment.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {attachment.type} • {attachment.size}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                onDownloadAttachment(
                                  attachment.url,
                                  attachment.name
                                )
                              }
                              className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
