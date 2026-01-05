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
  Close,
} from "@mui/icons-material";
import { CircularProgress, Modal, Box, IconButton } from "@mui/material"; // Added Modal and Box
import {
  fetchFeedbacksWithCurrentFilters,
  updateFeedback,
  markFeedbackAsResolved,
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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the view modal

  // Redux state
  const {
    feedbacks,
    total_count,
    status,
    error,
    updateStatus,
    markAsResolvedStatus,
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

  const filteredFeedback = feedbacks || [];

  const handleStatusChange = (feedback, isResolved) => {
    // If marking as resolved, use the mark_as_resolved endpoint
    if (isResolved) {
      const payload = {
        user: feedback.user || null,
        email: feedback.email || "",
        subject: feedback.subject || null,
        subject_id: feedback.subject_id || null,
        country: feedback.country || null,
        message: feedback.message || null,
        rating: feedback.rating || null,
        resource: feedback.resource || 0,
      };

      dispatch(
        markFeedbackAsResolved({
          feedbackId: feedback.id,
          feedbackData: payload,
        })
      );
    } else {
      // If marking as active, use the regular update endpoint
      dispatch(
        updateFeedback({
          feedbackId: feedback.id,
          feedbackData: { is_resolved: false },
        })
      );
    }
  };

  const handleDelete = (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(feedbackId));
    }
  };

  // NEW: Handler for viewing feedback details
  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  // NEW: Handler for reply/share
  const handleReply = (email) => {
    window.location.href = `mailto:${email}?subject=Feedback Follow-up`;
  };

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
      {/* View Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 outline-none">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Feedback Details
            </h2>
            <IconButton onClick={() => setIsModalOpen(false)}>
              <Close />
            </IconButton>
          </div>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">From:</span>
                <span className="font-medium text-sm md:text-base">
                  {selectedFeedback.email}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Subject:</span>
                <span className="capitalize font-medium">
                  {selectedFeedback.subject}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Rating:</span>
                <div className="flex">
                  {renderStars(selectedFeedback.rating)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl mt-4 max-h-[40vh] overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedFeedback.message}
                </p>
              </div>
            </div>
          )}
        </Box>
      </Modal>

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

            <div className="flex flex-wrap md:flex-nowrap gap-3">
              <select
                value={filters.is_resolved}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="flex-1 md:flex-none px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filters.subject}
                onChange={(e) => handleSubjectFilterChange(e.target.value)}
                className="flex-1 md:flex-none px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
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
                className="w-full md:w-auto px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                title="Clear all filters"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

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
                className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getEntityIcon(feedback.subject)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                        <span className="font-medium text-gray-800 truncate text-sm md:text-base">
                          {feedback.email}
                        </span>
                        {feedback.subject_detail && (
                          <div className="flex items-center gap-1 md:gap-2 overflow-hidden">
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-600 text-xs md:text-sm truncate">
                              {typeof feedback.subject_detail === "string"
                                ? feedback.subject_detail
                                : feedback.subject_detail.title ||
                                  (feedback.subject_detail.first_name &&
                                  feedback.subject_detail.last_name
                                    ? `${feedback.subject_detail.first_name} ${feedback.subject_detail.last_name}`
                                    : feedback.subject_detail.name ||
                                      `ID: ${feedback.subject_detail.id}`)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 md:py-1 bg-gray-100 text-gray-600 text-[10px] md:text-xs rounded-full capitalize">
                          {feedback.subject}
                        </span>
                        <span
                          className={`px-2 py-0.5 md:py-1 text-[10px] md:text-xs rounded-full flex items-center gap-1 ${getStatusColor(
                            feedback.is_resolved
                          )}`}
                        >
                          {getStatusIcon(feedback.is_resolved)}
                          {feedback.is_resolved ? "Resolved" : "Active"}
                        </span>
                        <span className="text-[10px] md:text-sm text-gray-500">
                          {formatDate(feedback.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Only Actions */}
                  <div className="hidden md:flex items-center gap-2">
                    {feedback.rating > 0 && (
                      <div className="flex items-center gap-1 mr-2">
                        {renderStars(feedback.rating)}
                      </div>
                    )}
                    <button
                      onClick={() => handleViewDetails(feedback)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Visibility className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReply(feedback.email)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      disabled={deleteStatus === "loading"}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleteStatus === "loading" ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Delete className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Message Section */}
                <div className="bg-gray-50 rounded-xl p-3 md:p-4 mb-4">
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {feedback.message}
                  </p>
                </div>

                {/* Mobile Bottom Action Bar */}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* <button
                    onClick={() => handleStatusChange(feedback, !feedback.is_resolved)}
                    disabled={markAsResolvedStatus === "loading" || updateStatus === "loading"}
                    className={`px-4 py-2.5 md:py-2 ${feedback.is_resolved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium`}
                  >
                    {(markAsResolvedStatus === "loading" || updateStatus === "loading") && <CircularProgress size={16} color="inherit" />}
                    Mark as {feedback.is_resolved ? "Active" : "Resolved"}
                  </button> */}

                  {/* Mobile Only: Icons at the bottom row */}
                  {/* <div className="flex md:hidden items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex gap-0.5">
                       {feedback.rating > 0 && renderStars(feedback.rating)}
                    </div>
                    <div className="flex gap-2">
                      <IconButton size="small" onClick={() => handleViewDetails(feedback)} className="bg-blue-50 text-blue-600">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleReply(feedback.email)} className="bg-green-50 text-green-600">
                        <Reply fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(feedback.id)} 
                        disabled={deleteStatus === "loading"}
                        className="bg-red-50 text-red-600"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  </div> */}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {total_pages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs md:text-sm text-gray-600">
                Page {current_page} of {total_pages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!previous || status === "loading"}
                  className="px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg bg-white disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!next || status === "loading"}
                  className="px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg bg-white disabled:opacity-50"
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
