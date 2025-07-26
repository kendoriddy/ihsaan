"use client";

import { useState } from "react";
import {
  Campaign,
  People,
  School,
  Person,
  Public,
  Edit,
  Delete,
  Visibility,
  CalendarToday,
  AttachFile,
  TrendingUp,
} from "@mui/icons-material";

export default function AnnouncementHistory({
  userRole,
  announcements,
  onEdit,
  onDelete,
  onView,
}) {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case "all_users":
        return <Public className="w-4 h-4" />;
      case "all_students":
      case "students_per_course":
        return <School className="w-4 h-4" />;
      case "all_tutors":
        return <People className="w-4 h-4" />;
      case "all_ordinary_users":
      case "ordinary_users_per_course":
        return <Person className="w-4 h-4" />;
      default:
        return <Campaign className="w-4 h-4" />;
    }
  };

  const getTargetLabel = (targetType, courseTitle) => {
    switch (targetType) {
      case "all_users":
        return "All Users";
      case "all_students":
        return "All Students";
      case "all_tutors":
        return "All Tutors";
      case "all_ordinary_users":
        return "All Ordinary Users";
      case "students_per_course":
        return courseTitle
          ? `Students in ${courseTitle}`
          : "Students in Course";
      case "ordinary_users_per_course":
        return courseTitle ? `Buyers of ${courseTitle}` : "Course Buyers";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getReadRate = (announcement) => {
    if (announcement.deliveredCount === 0) return 0;
    return Math.round(
      (announcement.readCount / announcement.deliveredCount) * 100
    );
  };

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !isExpired(announcement.expiresAt)) ||
        (filter === "expired" && isExpired(announcement.expiresAt));

      const matchesType =
        typeFilter === "all" || announcement.type === typeFilter;

      return matchesFilter && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "most_recipients":
          return b.recipientCount - a.recipientCount;
        case "highest_read_rate":
          return getReadRate(b) - getReadRate(a);
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Announcement History
        </h1>
        <p className="text-gray-600">View and manage your sent announcements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Campaign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {announcements.length}
              </div>
              <div className="text-sm text-gray-600">Total Sent</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <People className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {announcements.reduce((sum, a) => sum + a.recipientCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Recipients</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {announcements.length > 0
                  ? Math.round(
                      announcements.reduce(
                        (sum, a) => sum + getReadRate(a),
                        0
                      ) / announcements.length
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Avg Read Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <CalendarToday className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {announcements.filter((a) => isExpired(a.expiresAt)).length}
              </div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
            >
              <option value="all">All Announcements</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
            >
              <option value="all">All Types</option>
              <option value="informational">Informational</option>
              <option value="alert">Alerts</option>
              <option value="reminder">Reminders</option>
              <option value="promotional">Promotional</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_recipients">Most Recipients</option>
              <option value="highest_read_rate">Highest Read Rate</option>
            </select>

            <span className="text-sm text-gray-600 flex items-center ml-auto">
              Showing {filteredAnnouncements.length} announcements
            </span>
          </div>
        </div>

        {/* Announcements List */}
        <div className="divide-y divide-gray-200">
          {filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center">
              <Campaign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No announcements found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or create your first announcement.
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {announcement.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                          announcement.type
                        )}`}
                      >
                        {announcement.type}
                      </span>
                      {isExpired(announcement.expiresAt) && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          Expired
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        {getTargetIcon(announcement.targetType)}
                        <span>
                          {getTargetLabel(
                            announcement.targetType,
                            announcement.courseTitle
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarToday className="w-4 h-4" />
                        <span>{formatDate(announcement.createdAt)}</span>
                      </div>
                      {announcement.hasAttachments && (
                        <div className="flex items-center gap-1">
                          <AttachFile className="w-4 h-4" />
                          <span>Has attachments</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {announcement.message}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-800">
                          {announcement.recipientCount}
                        </div>
                        <div className="text-xs text-blue-600">Recipients</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-800">
                          {announcement.deliveredCount}
                        </div>
                        <div className="text-xs text-green-600">Delivered</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-800">
                          {getReadRate(announcement)}%
                        </div>
                        <div className="text-xs text-purple-600">Read Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <button
                      onClick={() => onView(announcement.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Visibility className="w-5 h-5" />
                    </button>
                    {announcement.canEdit && (
                      <button
                        onClick={() => onEdit(announcement.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit announcement"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {announcement.canDelete && (
                      <button
                        onClick={() => onDelete(announcement.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete announcement"
                      >
                        <Delete className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
