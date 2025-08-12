import { useState } from "react";
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
} from "@mui/icons-material";

export default function FeedbackDashboard({ userRole, onCreateFeedback }) {
  const [activeTab, setActiveTab] = useState("sent");
  const [filterType, setFilterType] = useState("all");

  // Mock data - replace with actual API calls
  const mockFeedbackSent = [
    {
      id: "1",
      senderName: "You",
      receiverName: "Ahmad Hassan",
      entityType: "tutor",
      entityId: "tutor-123",
      content:
        "Excellent teacher! Very patient and knowledgeable. My Tajweed has improved significantly.",
      rating: 5,
      createdAt: "2024-01-15T10:30:00Z",
      canEdit: true,
      canDelete: true,
    },
    {
      id: "2",
      senderName: "You",
      entityType: "course",
      entityId: "course-456",
      content: "Great course content but could use more interactive exercises.",
      rating: 4,
      createdAt: "2024-01-10T14:20:00Z",
      canEdit: true,
      canDelete: true,
    },
  ];

  const mockFeedbackReceived = [
    {
      id: "3",
      senderName: "Sarah Ahmed",
      receiverName: "You",
      entityType: "tutor",
      entityId: "you",
      content:
        "Thank you for the excellent lessons. Your teaching style is very clear and easy to follow.",
      rating: 5,
      createdAt: "2024-01-12T09:15:00Z",
      canEdit: false,
      canDelete: false,
    },
  ];

  const mockAllFeedback = [...mockFeedbackSent, ...mockFeedbackReceived];

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

  const getFeedbackData = () => {
    switch (activeTab) {
      case "sent":
        return mockFeedbackSent;
      case "received":
        return mockFeedbackReceived;
      case "all":
        return mockAllFeedback;
      default:
        return [];
    }
  };

  const filteredFeedback = getFeedbackData().filter((feedback) => {
    if (filterType === "all") return true;
    return feedback.entityType === filterType;
  });

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
              <option value="student">Students</option>
              <option value="platform">Platform</option>
              <option value="resource">Resources</option>
            </select>
            <span className="text-sm text-gray-600">
              Showing {filteredFeedback.length} feedback
              {filteredFeedback.length !== 1 ? "s" : ""}
            </span>
          </div>
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
                      {getEntityIcon(feedback.entityType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">
                          {activeTab === "sent"
                            ? `To: ${
                                feedback.receiverName || feedback.entityId
                              }`
                            : `From: ${feedback.senderName}`}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {feedback.entityType}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(feedback.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {feedback.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                      </div>
                    )}
                    {feedback.canEdit && (
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {feedback.canDelete && (
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Delete className="w-4 h-4" />
                      </button>
                    )}
                    {activeTab === "received" && (
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Reply className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {feedback.content}
                  </p>
                </div>

                {feedback.attachment && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <AttachFile className="w-4 h-4" />
                    <span>Attachment: {feedback.attachment}</span>
                  </div>
                )}

                {feedback.updatedAt &&
                  feedback.updatedAt !== feedback.createdAt && (
                    <div className="mt-2 text-xs text-gray-500">
                      Last edited: {formatDate(feedback.updatedAt)}
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
