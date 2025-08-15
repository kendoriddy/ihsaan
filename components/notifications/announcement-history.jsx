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
  total_count,
  onDelete,
  onView,
}) {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Map API data structure to component expectations
  const mappedAnnouncements = announcements?.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    message: announcement.content,
    type: announcement.announcement_class?.toLowerCase(),
    targetType: announcement.announcement_type?.toLowerCase(),
    courseTitle: announcement.course_title,
    recipientCount: announcement.recipient_count || 0,
    deliveredCount: announcement.delivered_count || 0,
    readCount: announcement.read_count || 0,
    createdAt: announcement.created_at,
    hasAttachments: announcement.has_attachments || false,
    canEdit: announcement.can_edit !== false,
    canDelete: announcement.can_delete !== false,
    expiresAt: announcement.expires_at,
  }));

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
      case "students_offering_course":
        return <School className="w-4 h-4" />;
      case "all_tutors":
      case "tutors_teaching_course":
        return <People className="w-4 h-4" />;
      case "ordinary_users":
      case "ordinary_users_offering_course":
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
      case "ordinary_users":
        return "All Ordinary Users";
      case "students_offering_course":
        return courseTitle
          ? `Students in ${courseTitle}`
          : "Students in Course";
      case "ordinary_users_offering_course":
        return courseTitle ? `Buyers of ${courseTitle}` : "Course Buyers";
      case "tutors_teaching_course":
        return courseTitle ? `Tutors of ${courseTitle}` : "Course Tutors";
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

  const filteredAnnouncements = mappedAnnouncements
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
                {total_count}
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
                {mappedAnnouncements.reduce(
                  (sum, a) => sum + a.recipientCount,
                  0
                )}
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
                {mappedAnnouncements.length > 0
                  ? Math.round(
                      mappedAnnouncements.reduce(
                        (sum, a) => sum + getReadRate(a),
                        0
                      ) / mappedAnnouncements.length
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
                {
                  mappedAnnouncements.filter((a) => isExpired(a.expiresAt))
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700"
            >
              <option value="all">All Announcements</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700"
            >
              <option value="all">All Types</option>
              <option value="informational">Informational</option>
              <option value="alert">Alert</option>
              <option value="reminder">Reminder</option>
              <option value="promotional">Promotional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_recipients">Most Recipients</option>
              <option value="highest_read_rate">Highest Read Rate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <Campaign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "You haven't sent any announcements yet."
                : `No ${filter} announcements found.`}
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                        announcement.type
                      )}`}
                    >
                      {announcement.type}
                    </span>
                    {isExpired(announcement.expiresAt) && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {announcement.message}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {getTargetIcon(announcement.targetType)}
                      <span>
                        {getTargetLabel(
                          announcement.targetType,
                          announcement.courseTitle
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <People className="w-4 h-4" />
                      <span>{announcement.recipientCount} recipients</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>{getReadRate(announcement)}% read rate</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarToday className="w-4 h-4" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>

                    {announcement.hasAttachments && (
                      <div className="flex items-center gap-2">
                        <AttachFile className="w-4 h-4" />
                        <span>Has attachments</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {announcement.canEdit && (
                    <button
                      onClick={() => onEdit(announcement.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit announcement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => onView(announcement.id)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Visibility className="w-4 h-4" />
                  </button>

                  {announcement.canDelete && (
                    <button
                      onClick={() => onDelete(announcement.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete announcement"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
