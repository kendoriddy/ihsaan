"use client";
import {
  Person,
  Public,
  Language,
  Schedule,
  AccountBalance,
  MenuBook,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import BookTrialModal from "./book-trial-modal";
import ViewProfileModal from "./view-profile-modal";
import { useState } from "react";

export default function QuranTutorCard({ tutor }) {
  const fullName =
    `${tutor.first_name} ${tutor.middle_name} ${tutor.last_name}`.trim();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6">
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Person className="w-10 h-10 text-white" />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                tutor.available ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {tutor.available ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Cancel className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{fullName}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Person className="w-4 h-4" />
                <span className="capitalize">{tutor.gender}</span>
              </div>
              <div className="flex items-center gap-1">
                <Public className="w-4 h-4" />
                <span>{tutor.country_of_residence}</span>
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                tutor.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <Schedule className="w-3 h-3" />
              {tutor.available ? "Available Now" : "Not Available"}
            </div>
          </div>

          {/* Rate */}
          <div className="text-right">
            <div className="text-2xl font-bold text-red-800">
              {tutor.hourly_rate}
            </div>
            <div className="text-sm text-gray-500 capitalize">
              {tutor.currency}/hour
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Language className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Languages
              </span>
            </div>
            <div className="text-sm text-blue-700">
              {tutor.languages.join(", ")}
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <MenuBook className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Ajzaa</span>
            </div>
            <div className="text-sm text-purple-700">
              {tutor.ajzaa_memorized} Memorized
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <AccountBalance className="w-4 h-4" />
            <span>{tutor.sect}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Public className="w-4 h-4" />
            <span>From {tutor.country_of_origin}</span>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
            {tutor.bio}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex-1 bg-red-800 hover:bg-red-900 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            View Profile
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex-1 border border-red-800 text-red-800 hover:bg-red-50 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Book Trial
          </button>
        </div>
      </div>
      <ViewProfileModal
        tutor={tutor}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onBookTrial={() => {
          setShowProfileModal(false);
          setShowBookingModal(true);
        }}
      />

      <BookTrialModal
        tutor={tutor}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
