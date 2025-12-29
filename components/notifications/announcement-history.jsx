"use client";

import { useEffect, useState } from "react";
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
    if (!dateString) return "Not specified";
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
    if (!announcement.in_app_sent || announcement.in_app_sent === 0) return 0;
    return Math.round(
      (announcement.total_read / announcement.in_app_sent) * 100
    );
  };

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !isExpired(announcement.expires_at)) ||
        (filter === "expired" && isExpired(announcement.expires_at));

      const matchesType =
        typeFilter === "all" ||
        announcement.announcement_class?.toLowerCase() === typeFilter;

      return matchesFilter && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "most_recipients":
          return (b.total_recipients || 0) - (a.total_recipients || 0);
        case "highest_read_rate":
          return getReadRate(b) - getReadRate(a);
        default:
          return 0;
      }
    });

  console.log(filteredAnnouncements, "filteredAnnouncements!!!");
  return (
    <div className="w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Announcement History
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">View and manage your sent announcements</p>
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
                {announcements.reduce(
                  (sum, a) => sum + (a.total_recipients || 0),
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
                {announcements.filter((a) => isExpired(a.expires_at)).length}
              </div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
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
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                        announcement.announcement_class?.toLowerCase()
                      )}`}
                    >
                      {announcement.announcement_class}
                    </span>
                    {isExpired(announcement.expires_at) && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {announcement.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {getTargetIcon(
                        announcement.announcement_type?.toLowerCase()
                      )}
                      <span className="text-xs sm:text-sm">
                        {getTargetLabel(
                          announcement.announcement_type?.toLowerCase(),
                          announcement.course_title
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <People className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        {announcement.total_recipients || 0} recipients
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">{getReadRate(announcement)}% read rate</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarToday className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">{formatDate(announcement.created_at)}</span>
                    </div>

                    {announcement.has_attachments && (
                      <div className="flex items-center gap-2">
                        <AttachFile className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">Has attachments</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
                  <button
                    onClick={() => onEdit(announcement.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit announcement"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onView(announcement.id)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Visibility className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(announcement.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete announcement"
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
  );
}
