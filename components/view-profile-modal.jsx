"use client";

import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Person,
  Public,
  Language,
  Schedule,
  AccountBalance,
  MenuBook,
  CheckCircle,
  Cancel,
  Close,
  Star,
  StarBorder,
  AccessTime,
  School,
  Verified,
} from "@mui/icons-material";

export default function ViewProfileModal({
  tutor,
  isOpen,
  onClose,
  onBookTrial,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  const fullName =
    `${tutor.first_name} ${tutor.middle_name} ${tutor.last_name}`.trim();

  // Mock additional data for the profile
  const mockData = {
    rating: 4.8,
    totalReviews: 127,
    totalStudents: 89,
    yearsExperience: 5,
    specializations: [
      "Tajweed",
      "Memorization",
      "Recitation",
      "Arabic Grammar",
    ],
    certifications: [
      "Ijazah in Qira'at",
      "Islamic Studies Degree",
      "Arabic Language Certificate",
    ],
    availability: [
      { day: "Monday", times: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"] },
      { day: "Tuesday", times: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"] },
      { day: "Wednesday", times: ["9:00 AM - 12:00 PM"] },
      { day: "Thursday", times: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"] },
      { day: "Friday", times: ["2:00 PM - 6:00 PM"] },
      { day: "Saturday", times: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"] },
      { day: "Sunday", times: ["Unavailable"] },
    ],
    reviews: [
      {
        id: 1,
        student: "Ahmad K.",
        rating: 5,
        comment:
          "Excellent teacher! Very patient and knowledgeable. My Tajweed has improved significantly.",
        date: "2 weeks ago",
      },
      {
        id: 2,
        student: "Fatima S.",
        rating: 5,
        comment:
          "MashAllah, Brother Abu is an amazing teacher. Highly recommend for Quran memorization.",
        date: "1 month ago",
      },
      {
        id: 3,
        student: "Omar M.",
        rating: 4,
        comment:
          "Great teacher with excellent Arabic pronunciation. Very helpful and encouraging.",
        date: "2 months ago",
      },
    ],
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? (
        <Star key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <StarBorder key={i} className="w-4 h-4 text-gray-300" />
      )
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="view-profile-modal"
      aria-describedby="view-profile-modal-description"
    >
      <Box className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <Person className="w-12 h-12 text-white" />
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center ${
                      tutor.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {tutor.available ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Cancel className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {fullName}
                    </h2>
                    <Verified className="w-6 h-6 text-blue-500" />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(mockData.rating)}
                    <span className="text-sm font-medium text-gray-700">
                      {mockData.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({mockData.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Person className="w-4 h-4" />
                      <span className="capitalize">{tutor.gender}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Public className="w-4 h-4" />
                      <span>{tutor.country_of_residence}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <School className="w-4 h-4" />
                      <span>{mockData.totalStudents} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AccessTime className="w-4 h-4" />
                      <span>{mockData.yearsExperience} Years Experience</span>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      tutor.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Schedule className="w-4 h-4" />
                    {tutor.available ? "Available Now" : "Not Available"}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Close className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Rate and Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-800">
                  {tutor.hourly_rate}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {tutor.currency}/hour
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onBookTrial}
                  className="bg-red-800 hover:bg-red-900 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  Book Trial Lesson
                </button>
                <button className="border border-red-800 text-red-800 hover:bg-red-50 font-medium py-3 px-6 rounded-xl transition-colors duration-200">
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: "overview", label: "Overview" },
                { id: "availability", label: "Availability" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-red-800 border-b-2 border-red-800"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{tutor.bio}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <Language className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-blue-800">
                      Languages
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      {tutor.languages.join(", ")}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <MenuBook className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-purple-800">
                      Ajaza
                    </div>
                    <div className="text-xs text-purple-700 mt-1">
                      {tutor.ajaza_memorized} Memorized
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <AccountBalance className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-800">
                      Sect
                    </div>
                    <div className="text-xs text-green-700 mt-1">
                      {tutor.sect}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <Public className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-orange-800">
                      Origin
                    </div>
                    <div className="text-xs text-orange-700 mt-1">
                      {tutor.country_of_origin}
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockData.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Certifications
                  </h3>
                  <div className="space-y-2">
                    {mockData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Verified className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "availability" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Weekly Schedule
                </h3>
                {mockData.availability.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="font-medium text-gray-800">
                      {schedule.day}
                    </div>
                    <div className="text-sm text-gray-600">
                      {schedule.times.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Student Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    {renderStars(mockData.rating)}
                    <span className="font-medium text-gray-700">
                      {mockData.rating}
                    </span>
                    <span className="text-gray-500">
                      ({mockData.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                {mockData.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <Person className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-800">
                          {review.student}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 ml-2">
                          {review.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
