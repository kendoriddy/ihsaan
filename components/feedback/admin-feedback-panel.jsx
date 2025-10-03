import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Feedback as FeedbackIcon,
  Person,
  MenuBook,
  Public,
  AttachFile,
  Star,
  StarBorder,
  Search,
  Visibility,
  Delete,
  Reply,
  Flag,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import {
  fetchFeedbacksWithCurrentFilters,
  updateFeedback,
  deleteFeedback,
  clearErrors,
  setSubjectFilter,
  setStatusFilter,
  setSearchFilter,
  setPage,
  clearFilters,
} from "@/utils/redux/slices/feedbackSlice";

export default function AdminFeedbackPanel() {
  const dispatch = useDispatch();
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Redux state
  const {
    feedbacks,
    total_count,
    status,
    error,
    updateStatus,
    deleteStatus,
    filters,
    current_page,
    total_pages,
    page_size,
    next,
    previous,
  } = useSelector((state) => state.feedback);

  // Fetch feedbacks on component mount and when filters change
  useEffect(() => {
    dispatch(fetchFeedbacksWithCurrentFilters());
  }, [dispatch, filters]);

  // Clear errors on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const getEntityIcon = (subject) => {
    switch (subject) {
      case "course":
        return <MenuBook className="w-4 h-4" />;
      case "tutor":
        return <Person className="w-4 h-4" />;
      case "student":
        return <Person className="w-4 h-4" />;
      case "platform":
        return <Public className="w-4 h-4" />;
      case "resource":
        return <AttachFile className="w-4 h-4" />;
      default:
        return <FeedbackIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (isResolved) => {
    if (isResolved) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  const getStatusIcon = (isResolved) => {
    if (isResolved) {
      return <CheckCircle className="w-4 h-4" />;
    } else {
      return <Warning className="w-4 h-4" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <Star key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <StarBorder key={i} className="w-4 h-4 text-gray-300" />
      )
    );
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

  // Since we're fetching filtered data from the API, we don't need client-side filtering
  const filteredFeedback = feedbacks || [];

  const handleStatusChange = (feedbackId, isResolved) => {
    dispatch(
      updateFeedback({
        feedbackId,
        feedbackData: { is_resolved: isResolved },
      })
    );
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(feedbackId));
    }
  };

  // Filter handlers using Redux actions
  const handleSubjectFilterChange = (subject) => {
    dispatch(setSubjectFilter(subject));
  };

  const handleStatusFilterChange = (status) => {
    dispatch(setStatusFilter(status));
  };

  const handleSearchChange = (search) => {
    dispatch(setSearchFilter(search));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleNextPage = () => {
    if (next) {
      dispatch(setPage(current_page + 1));
    }
  };

  const handlePreviousPage = () => {
    if (previous) {
      dispatch(setPage(current_page - 1));
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <CircularProgress size={40} />
          <p className="text-gray-600">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (status === "failed" && error) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <Warning className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Failed to load feedback
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchFeedbacksWithCurrentFilters())}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FeedbackIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {total_count || 0}
              </div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {feedbacks.length > 0
                  ? (
                      feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
                      feedbacks.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-sm text-gray-600">
                Avg Rating (Current Page)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filters.is_resolved}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filters.subject}
                onChange={(e) => handleSubjectFilterChange(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="tutor">Tutors</option>
                <option value="book">Books</option>
                <option value="platform">Platform</option>
                <option value="other">Other</option>
              </select>

              <button
                onClick={handleClearFilters}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                title="Clear all filters"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {filteredFeedback.length} of {total_count || 0} feedback
            entries
          </p>
        </div>

        {/* Feedback List */}
        <div className="divide-y divide-gray-200">
          {filteredFeedback.length === 0 ? (
            <div className="p-12 text-center">
              <FeedbackIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No feedback found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            filteredFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {getEntityIcon(feedback.subject)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {feedback.email}
                        </span>
                        {feedback.subject_detail && (
                          <>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-600">
                              {typeof feedback.subject_detail === "string"
                                ? feedback.subject_detail
                                : feedback.subject_detail.title ||
                                  (feedback.subject_detail.first_name &&
                                  feedback.subject_detail.last_name
                                    ? `${feedback.subject_detail.first_name} ${feedback.subject_detail.last_name}`
                                    : feedback.subject_detail.name ||
                                      `ID: ${
                                        feedback.subject_detail.id || "Unknown"
                                      }`)}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {feedback.subject}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(
                            feedback.is_resolved
                          )}`}
                        >
                          {getStatusIcon(feedback.is_resolved)}
                          {feedback.is_resolved ? "Resolved" : "Active"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(feedback.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {feedback.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                      </div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Visibility className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      disabled={deleteStatus === "loading"}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteStatus === "loading" ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Delete className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {feedback.message}
                  </p>
                </div>

                {!feedback.is_resolved && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(feedback.id, true)}
                      disabled={updateStatus === "loading"}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {updateStatus === "loading" && (
                        <CircularProgress size={16} color="inherit" />
                      )}
                      Mark as Resolved
                    </button>
                  </div>
                )}
                {feedback.is_resolved && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(feedback.id, false)}
                      disabled={updateStatus === "loading"}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {updateStatus === "loading" && (
                        <CircularProgress size={16} color="inherit" />
                      )}
                      Mark as Active
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {total_pages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {current_page} of {total_pages} • Showing{" "}
                {feedbacks.length} of {total_count} feedback entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!previous || status === "loading"}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, total_pages) }, (_, i) => {
                    let pageNum;
                    if (total_pages <= 5) {
                      pageNum = i + 1;
                    } else if (current_page <= 3) {
                      pageNum = i + 1;
                    } else if (current_page >= total_pages - 2) {
                      pageNum = total_pages - 4 + i;
                    } else {
                      pageNum = current_page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={status === "loading"}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          current_page === pageNum
                            ? "bg-red-800 text-white border-red-800"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!next || status === "loading"}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
