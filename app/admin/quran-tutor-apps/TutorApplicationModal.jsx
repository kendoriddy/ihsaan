"use client";
import {
  Close,
  Person,
  Email,
  Phone,
  Public,
  Language,
  MenuBook,
  AccountBalance,
  Schedule,
  CheckCircle,
  Pending,
  Cancel,
  Star,
  Verified,
  Warning,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export default function TutorApplicationModal({
  isOpen,
  handleClose,
  modalLoading,
  modalError,
  selectedTutor,
  rejectionReason,
  setRejectionReason,
  handleAdminStatus,
  getStatusColor,
}) {
  if (!isOpen) return null;

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
      case "APPROVED":
        return <CheckCircle className="w-5 h-5" />;
      case "PENDING":
        return <Pending className="w-5 h-5" />;
      case "REJECTED":
        return <Cancel className="w-5 h-5" />;
      default:
        return <Pending className="w-5 h-5" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Person className="w-6 h-6 text-red-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Application Details
                </h2>
                <p className="text-gray-600 text-sm">
                  Qur'an Tutor Application Review
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Close className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {modalLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-red-800 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading application details...
              </p>
            </div>
          ) : modalError ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Warning className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Error Loading Application
              </h3>
              <p className="text-red-600">{modalError}</p>
            </div>
          ) : selectedTutor ? (
            <div className="p-6 space-y-8">
              {/* Applicant Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center">
                    <Person className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedTutor.full_name}
                    </h3>
                    <p className="text-gray-600">{selectedTutor.email}</p>
                  </div>
                </div>

                {selectedTutor.quran_tutor_application_status === "REJECTED" &&
                selectedTutor.rejection_reason ? (
                  <Tooltip title={selectedTutor.rejection_reason}>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                        selectedTutor.quran_tutor_application_status
                      )}`}
                      style={{ cursor: "pointer" }}
                    >
                      {getStatusIcon(
                        selectedTutor.quran_tutor_application_status
                      )}
                      {selectedTutor.quran_tutor_application_status}
                    </div>
                  </Tooltip>
                ) : (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                      selectedTutor.quran_tutor_application_status
                    )}`}
                  >
                    {getStatusIcon(
                      selectedTutor.quran_tutor_application_status
                    )}
                    {selectedTutor.quran_tutor_application_status}
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Person className="w-5 h-5 text-red-800" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Email className="w-3 h-3" />
                      Email Address
                    </div>
                    <div className="font-medium text-gray-800">
                      {selectedTutor.email}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone Number
                    </div>
                    <div className="font-medium text-gray-800">
                      {selectedTutor.phone_number}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Gender</div>
                    <div className="font-medium text-gray-800 capitalize">
                      {selectedTutor.gender}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Public className="w-5 h-5 text-red-800" />
                  Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-sm text-blue-600 mb-1">
                      Country of Origin
                    </div>
                    <div className="font-medium text-blue-800">
                      {selectedTutor.country_of_origin}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-sm text-purple-600 mb-1">
                      Country of Residence
                    </div>
                    <div className="font-medium text-purple-800">
                      {selectedTutor.country_of_residence}
                    </div>
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-red-800" />
                  Qualifications & Experience
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <MenuBook className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-green-600 mb-1">
                      Ajzaa Memorized
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {selectedTutor.ajzaa_memorized}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <Verified className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm text-orange-600 mb-1">
                      Tajweed Level
                    </div>
                    <div className="font-medium text-orange-800">
                      {selectedTutor.tejweed_level}
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <AccountBalance className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <div className="text-sm text-indigo-600 mb-1">
                      Religion Sect
                    </div>
                    <div className="font-medium text-indigo-800">
                      {selectedTutor.religion_sect}
                    </div>
                  </div>
                  <div className="bg-teal-50 rounded-xl p-4 text-center">
                    <Schedule className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <div className="text-sm text-teal-600 mb-1">Experience</div>
                    <div className="text-xl font-bold text-teal-800">
                      {selectedTutor.years_of_experience}
                    </div>
                    <div className="text-xs text-teal-600">years</div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Language className="w-5 h-5 text-red-800" />
                  Languages
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.languages?.split(",").map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {lang.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Teaching Summary */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Teaching Summary
                </h4>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTutor.tutor_summary}
                  </p>
                </div>
              </div>

              {/* Admin Actions */}
              {selectedTutor.quran_tutor_application_status === "PENDING" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Warning className="w-5 h-5 text-yellow-600" />
                    Admin Review
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (required if rejecting)
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 transition-all duration-200 bg-white text-gray-700 placeholder-gray-400 resize-none"
                        placeholder="Please provide a detailed reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAdminStatus("ACCEPTED")}
                        disabled={modalLoading}
                      >
                        <ThumbUp className="w-5 h-5" />
                        {modalLoading ? "Processing..." : "Approve Application"}
                      </button>
                      <button
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAdminStatus("REJECTED")}
                        disabled={modalLoading || !rejectionReason.trim()}
                      >
                        <ThumbDown className="w-5 h-5" />
                        {modalLoading ? "Processing..." : "Reject Application"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
