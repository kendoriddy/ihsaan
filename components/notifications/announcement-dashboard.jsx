"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementComposer from "./announcement-composer";
import AnnouncementHistory from "./announcement-history";
import AnnouncementViewEditModal from "./AnnouncementViewEditModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import NotificationCenter from "./notification-center";
import {
  Campaign,
  Add,
  History,
  Notifications,
  NotificationsActive,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchAnnouncements,
  fetchAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  fetchCoursesForAnnouncements,
  clearErrors,
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  clearSelectedAnnouncement,
} from "@/utils/redux/slices/announcementSlice";

export default function AnnouncementDashboard({ userRole }) {
  const dispatch = useDispatch();
  const {
    announcements,
    selectedAnnouncement,
    courses,
    status,
    createStatus,
    updateStatus,
    deleteStatus,
    coursesStatus,
    error,
    createError,
    updateError,
    deleteError,
    total_count,
  } = useSelector((state) => state.announcements);
  console.log(announcements, "announcements here!!!", total_count);

  const [activeTab, setActiveTab] = useState("history");
  const [showComposer, setShowComposer] = useState(false);
  const [showViewEditModal, setShowViewEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // 'view' or 'edit'

  // Fetch announcements and courses on component mount
  useEffect(() => {
    dispatch(fetchAnnouncements());
    dispatch(fetchCoursesForAnnouncements());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (createStatus === "succeeded") {
      toast.success("Announcement created successfully!");
      setShowComposer(false);
      dispatch(resetCreateStatus());
    } else if (createStatus === "failed" && createError) {
      toast.error(createError);
      dispatch(resetCreateStatus());
    }

    if (updateStatus === "succeeded") {
      toast.success("Announcement updated successfully!");
      setShowViewEditModal(false);
      setModalMode("view");
      dispatch(resetUpdateStatus());
      dispatch(clearSelectedAnnouncement());
    } else if (updateStatus === "failed" && updateError) {
      toast.error(updateError);
      dispatch(resetUpdateStatus());
    }

    if (deleteStatus === "succeeded") {
      toast.success("Announcement deleted successfully!");
      setShowDeleteModal(false);
      setAnnouncementToDelete(null);
      dispatch(resetDeleteStatus());
    } else if (deleteStatus === "failed" && deleteError) {
      toast.error(deleteError);
      dispatch(resetDeleteStatus());
    }

    if (status === "failed" && error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [
    createStatus,
    updateStatus,
    deleteStatus,
    status,
    createError,
    updateError,
    deleteError,
    error,
    dispatch,
  ]);

  const handleSubmitAnnouncement = async (announcementData) => {
    dispatch(createAnnouncement(announcementData));
  };

  const handleMarkAsRead = (notificationId) => {
    console.log("Marking notification as read:", notificationId);
    // Implement API call
  };

  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read");
    // Implement API call
  };

  const handleDeleteNotification = (notificationId) => {
    console.log("Deleting notification:", notificationId);
    // Implement API call
  };

  const handleEditAnnouncement = (announcementId) => {
    console.log("Editing announcement:", announcementId);
    setModalMode("edit");
    dispatch(fetchAnnouncementById(announcementId));
    setShowViewEditModal(true);
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    // Find the announcement to get its title for the confirmation modal
    const announcement = announcements.find((a) => a.id === announcementId);
    if (announcement) {
      setAnnouncementToDelete(announcement);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (announcementToDelete) {
      dispatch(deleteAnnouncement(announcementToDelete.id));
    }
  };

  const handleViewAnnouncement = (announcementId) => {
    console.log("Viewing announcement:", announcementId);
    setModalMode("view");
    dispatch(fetchAnnouncementById(announcementId));
    setShowViewEditModal(true);
  };

  const handleSaveAnnouncement = (announcementId, announcementData) => {
    dispatch(updateAnnouncement({ announcementId, announcementData }));
  };

  const handleCloseViewEditModal = () => {
    setShowViewEditModal(false);
    setModalMode("view");
    dispatch(clearSelectedAnnouncement());
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAnnouncementToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Announcement Center
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage your announcements
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* <button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 text-gray-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                {unreadNotifications > 0 ? (
                  <NotificationsActive className="w-6 h-6" />
                ) : (
                  <Notifications className="w-6 h-6" />
                )}
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </div>
                )}
              </button> */}
              <button
                onClick={() => setShowComposer(true)}
                className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Add className="w-5 h-5" />
                Create Announcement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {/* <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "create"
                    ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Campaign className="w-4 h-4" />
                Quick Create
              </button> */}
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === "history"
                    ? "text-red-800 border-b-2 border-red-800 bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <History className="w-4 h-4" />
                History & Analytics
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "create" && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Campaign className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Create New Announcement
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Send important updates, reminders, or information to your
                  students and course participants.
                </p>
                <button
                  onClick={() => setShowComposer(true)}
                  className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-3 mx-auto"
                >
                  <Add className="w-6 h-6" />
                  Create Announcement
                </button>
              </div>
            )}

            {activeTab === "history" && (
              <AnnouncementHistory
                userRole={userRole}
                announcements={announcements}
                total_count={total_count}
                onEdit={handleEditAnnouncement}
                onDelete={handleDeleteAnnouncement}
                onView={handleViewAnnouncement}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnnouncementComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        userRole={userRole}
        userCourses={courses}
        onSubmit={handleSubmitAnnouncement}
        isLoading={createStatus === "loading"}
      />

      <AnnouncementViewEditModal
        isOpen={showViewEditModal}
        onClose={handleCloseViewEditModal}
        announcement={selectedAnnouncement}
        userRole={userRole}
        userCourses={courses}
        onSave={handleSaveAnnouncement}
        isLoading={updateStatus === "loading"}
        mode={modalMode}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        announcementTitle={announcementToDelete?.title || ""}
        isLoading={deleteStatus === "loading"}
      />

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={[]}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDeleteNotification}
      />
    </div>
  );
}
