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
  fetchFeedbacks,
  updateFeedback,
  deleteFeedback,
  clearErrors,
} from "@/utils/redux/slices/feedbackSlice";

export default function AdminFeedbackPanel() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Redux state
  const { feedbacks, total_count, status, error, updateStatus, deleteStatus } =
    useSelector((state) => state.feedback);

  // Fetch feedbacks on component mount
  useEffect(() => {
    const filters = {};
    if (filterStatus !== "all")
      filters.is_resolved = filterStatus === "resolved";
    if (filterType !== "all") filters.subject = filterType;
    if (searchTerm) filters.search = searchTerm;

    dispatch(fetchFeedbacks(filters));
  }, [dispatch, filterStatus, filterType, searchTerm]);

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
            onClick={() => {
              const filters = {};
              if (filterStatus !== "all")
                filters.is_resolved = filterStatus === "resolved";
              if (filterType !== "all") filters.subject = filterType;
              if (searchTerm) filters.search = searchTerm;
              dispatch(fetchFeedbacks(filters));
            }}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {filteredFeedback.filter((f) => !f.is_resolved).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {filteredFeedback.filter((f) => f.is_resolved).length}
              </div>
              <div className="text-sm text-gray-600">Resolved</div>
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
                {filteredFeedback.length > 0
                  ? (
                      filteredFeedback.reduce(
                        (sum, f) => sum + (f.rating || 0),
                        0
                      ) / filteredFeedback.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="tutor">Tutors</option>
                <option value="student">Students</option>
                <option value="platform">Platform</option>
                <option value="resource">Resources</option>
              </select>
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
                              {feedback.subject_detail}
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
      </div>
    </div>
  );
}
