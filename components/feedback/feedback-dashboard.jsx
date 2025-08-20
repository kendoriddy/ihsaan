import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Feedback as FeedbackIcon,
  Send,
  Inbox,
  Star,
  StarBorder,
  Person,
  MenuBook,
  Public,
  AttachFile,
  Edit,
  Delete,
  Reply,
  FilterList,
  Add,
  Refresh,
} from "@mui/icons-material";
import {
  fetchFeedbacks,
  deleteFeedback,
} from "@/utils/redux/slices/feedbackSlice";

export default function FeedbackDashboard({
  userRole,
  onCreateFeedback,
  status,
  error,
}) {
  const [activeTab, setActiveTab] = useState("sent");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const dispatch = useDispatch();
  const { feedbacks, total_count, next, previous } = useSelector(
    (state) => state.feedback
  );

  useEffect(() => {
    // Fetch feedbacks when filters change
    const filters = {
      page: currentPage,
      page_size: pageSize,
      ...(filterType !== "all" && { subject: filterType }),
    };

    dispatch(fetchFeedbacks(filters));
  }, [dispatch, filterType, currentPage, pageSize]);

  const handleDeleteFeedback = (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      dispatch(deleteFeedback(feedbackId));
    }
  };

  const handleRefresh = () => {
    const filters = {
      page: currentPage,
      page_size: pageSize,
      ...(filterType !== "all" && { subject: filterType }),
    };
    dispatch(fetchFeedbacks(filters));
  };

  const getEntityIcon = (entityType) => {
    switch (entityType) {
      case "course":
        return <MenuBook className="w-4 h-4" />;
      case "tutor":
        return <Person className="w-4 h-4" />;
      case "book":
        return <AttachFile className="w-4 h-4" />;
      case "platform":
        return <Public className="w-4 h-4" />;
      case "payment":
        return <AttachFile className="w-4 h-4" />;
      case "other":
        return <AttachFile className="w-4 h-4" />;
      default:
        return <FeedbackIcon className="w-4 h-4" />;
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

  // Helper function to properly display subject detail
  const getSubjectDetailDisplay = (subjectDetail, subject) => {
    // If subjectDetail is a string, return it
    if (typeof subjectDetail === "string") {
      return subjectDetail;
    }

    // If subjectDetail is an object, extract the appropriate display value
    if (typeof subjectDetail === "object" && subjectDetail !== null) {
      switch (subject) {
        case "course":
          return (
            subjectDetail.title ||
            subjectDetail.name ||
            `Course ${subjectDetail.id || ""}`
          );
        case "tutor":
          return subjectDetail.first_name && subjectDetail.last_name
            ? `${subjectDetail.first_name} ${subjectDetail.last_name}`
            : subjectDetail.name || `Tutor ${subjectDetail.id || ""}`;
        case "book":
          return (
            subjectDetail.title ||
            subjectDetail.name ||
            `Book ${subjectDetail.id || ""}`
          );
        default:
          return subjectDetail.title || subjectDetail.name || subject;
      }
    }

    // Fallback to subject if subjectDetail is null or undefined
    return subject;
  };

  const getFeedbackData = () => {
    if (!feedbacks || feedbacks.length === 0) return [];

    // Debug: Log the feedback data structure
    console.log("Feedback data:", feedbacks);
    if (feedbacks.length > 0) {
      console.log("First feedback item:", feedbacks[0]);
      console.log("Subject detail type:", typeof feedbacks[0].subject_detail);
      console.log("Subject detail value:", feedbacks[0].subject_detail);
    }

    // For now, we'll show all feedbacks since the API doesn't distinguish between sent/received
    // In a real implementation, you might want to filter based on user ID
    return feedbacks;
  };

  const filteredFeedback = getFeedbackData();

  const tabs = [
    {
      id: "sent",
      label: "Feedback Sent",
      icon: <Send className="w-4 h-4" />,
      show: true,
    },
    {
      id: "received",
      label: "Feedback Received",
      icon: <Inbox className="w-4 h-4" />,
      show: userRole === "student" || userRole === "tutor",
    },
    {
      id: "all",
      label: "All Feedback",
      icon: <FeedbackIcon className="w-4 h-4" />,
      show: userRole === "admin",
    },
  ];

  return (
    <div className="w-full p-2.5">
      {/* Action Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={onCreateFeedback}
          className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Add className="w-5 h-5" />
          Give Feedback
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs
              .filter((tab) => tab.show)
              .map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FilterList className="w-5 h-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="tutor">Tutors</option>
                <option value="book">Books</option>
                <option value="platform">Platform</option>
                <option value="payment">Payment</option>
                <option value="other">Other</option>
              </select>
              <span className="text-sm text-gray-600">
                Showing {filteredFeedback.length} of {total_count} feedback
                {total_count !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={status === "loading"}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <Refresh className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="divide-y divide-gray-200">
          {status === "loading" ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading feedbacks...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <FeedbackIcon className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error loading feedbacks
              </h3>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="p-12 text-center">
              <FeedbackIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No feedback found
              </h3>
              <p className="text-gray-500">
                {activeTab === "sent" && "You haven't sent any feedback yet."}
                {activeTab === "received" &&
                  "You haven't received any feedback yet."}
                {activeTab === "all" && "No feedback available."}
              </p>
            </div>
          ) : (
            filteredFeedback.map((feedback) => (
              <div
                key={feedback.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getEntityIcon(feedback.subject)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {getSubjectDetailDisplay(
                            feedback.subject_detail,
                            feedback.subject
                          )}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {feedback.subject}
                        </span>
                        {feedback.is_resolved && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                            Resolved
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(feedback.created_at)}
                      </div>
                      <div className="text-sm text-gray-500">
                        From: {feedback.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {feedback.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete feedback"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {typeof feedback.message === "string"
                      ? feedback.message
                      : "No message provided"}
                  </p>
                </div>

                {feedback.resource_detail && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <AttachFile className="w-4 h-4" />
                    <span>
                      Attachment:{" "}
                      {typeof feedback.resource_detail === "object"
                        ? feedback.resource_detail.title || "Attachment"
                        : feedback.resource_detail}
                    </span>
                    <span className="text-xs text-gray-400">
                      (
                      {typeof feedback.resource_detail === "object"
                        ? feedback.resource_detail.type || "Unknown"
                        : "File"}
                      )
                    </span>
                  </div>
                )}

                {feedback.country && (
                  <div className="mt-2 text-xs text-gray-500">
                    Country: {feedback.country}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {total_count > pageSize && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {Math.ceil(total_count / pageSize)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={!previous || status === "loading"}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
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
