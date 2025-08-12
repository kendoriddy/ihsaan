import { useState } from "react";
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

export default function AdminFeedbackPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Mock data - replace with actual API calls
  const mockFeedback = [
    {
      id: "1",
      senderName: "Sarah Ahmed",
      senderRole: "student",
      receiverName: "Ahmad Hassan",
      receiverRole: "tutor",
      entityType: "tutor",
      entityId: "tutor-123",
      content: "Excellent teacher! Very patient and knowledgeable.",
      rating: 5,
      createdAt: "2024-01-15T10:30:00Z",
      status: "active",
    },
    {
      id: "2",
      senderName: "Omar Khan",
      senderRole: "student",
      entityType: "platform",
      entityId: "platform",
      content: "The platform is great but needs better mobile optimization.",
      rating: 4,
      createdAt: "2024-01-14T14:20:00Z",
      status: "active",
    },
    {
      id: "3",
      senderName: "Fatima Ali",
      senderRole: "ordinary",
      entityType: "course",
      entityId: "course-456",
      content:
        "This course content is inappropriate and not suitable for children.",
      rating: 1,
      createdAt: "2024-01-13T09:15:00Z",
      status: "flagged",
    },
  ];

  const getEntityIcon = (entityType) => {
    switch (entityType) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "flagged":
        return <Flag className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
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

  const filteredFeedback = mockFeedback.filter((feedback) => {
    const matchesSearch =
      feedback.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.entityType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || feedback.status === filterStatus;
    const matchesType =
      filterType === "all" || feedback.entityType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (feedbackId, newStatus) => {
    console.log(`Changing feedback ${feedbackId} status to ${newStatus}`);
    // Implement status change logic
  };

  const handleDelete = (feedbackId) => {
    console.log(`Deleting feedback ${feedbackId}`);
    // Implement delete logic
  };

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
                {mockFeedback.length}
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
                {mockFeedback.filter((f) => f.status === "active").length}
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
                {mockFeedback.filter((f) => f.status === "flagged").length}
              </div>
              <div className="text-sm text-gray-600">Flagged</div>
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
                {(
                  mockFeedback.reduce((sum, f) => sum + f.rating, 0) /
                  mockFeedback.length
                ).toFixed(1)}
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
                <option value="flagged">Flagged</option>
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
            Showing {filteredFeedback.length} of {mockFeedback.length} feedback
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
                      {getEntityIcon(feedback.entityType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {feedback.senderName} ({feedback.senderRole})
                        </span>
                        {feedback.receiverName && (
                          <>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-600">
                              {feedback.receiverName} ({feedback.receiverRole})
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {feedback.entityType}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(
                            feedback.status
                          )}`}
                        >
                          {getStatusIcon(feedback.status)}
                          {feedback.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(feedback.createdAt)}
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
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {feedback.content}
                  </p>
                </div>

                {feedback.status === "flagged" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(feedback.id, "active")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Mark as Active
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(feedback.id, "resolved")
                      }
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Mark as Resolved
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
