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
  // onSendMessage,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  const fullName =
    `${tutor.first_name} ${tutor.middle_name} ${tutor.last_name}`.trim();

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
        <Star key={i} className="w-4 h-4 text-yellow-500" />
      ) : (
        <StarBorder key={i} className="w-4 h-4 text-gray-400" />
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
      <Box className="flex items-center justify-center min-h-screen p-4 outline-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden mx-auto border border-gray-200">
          
          {/* Header Section (Reduced vertically) */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <Person className="w-10 h-10 text-white" />
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
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

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      {fullName}
                    </h2>
                    <Verified className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(mockData.rating)}
                    <span className="text-xs font-bold text-gray-800">
                      {mockData.rating}
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      ({mockData.totalReviews} reviews)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700 font-medium mb-2">
                    <div className="flex items-center gap-1.5">
                      <Person className="w-3.5 h-3.5 text-red-800" />
                      <span className="capitalize">{tutor.gender}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Public className="w-3.5 h-3.5 text-red-800" />
                      <span>{tutor.country_of_residence}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-red-800" />
                      <span>{mockData.totalStudents} Students</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AccessTime className="w-3.5 h-3.5 text-red-800" />
                      <span>{mockData.yearsExperience} Years Exp</span>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                      tutor.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <Schedule className="w-3.5 h-3.5" />
                    {tutor.available ? "AVAILABLE NOW" : "NOT AVAILABLE"}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
              >
                <Close className="w-5 h-5 text-gray-500 group-hover:text-red-800" />
              </button>
            </div>

            {/* Price and Buttons (Condensed) */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-300">
              <div className="text-left leading-tight">
                <div className="text-2xl font-black text-red-800">
                  {tutor.hourly_rate}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {tutor.currency} / HR
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onBookTrial}
                  className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold py-2 px-6 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Book Trial
                </button>
                <button 
                  className="border-2 border-red-800 text-red-800 hover:bg-red-50 text-sm font-bold py-2 px-6 rounded-xl transition-all active:scale-95"
                >
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation (Condensed) */}
          <div className="bg-white border-b border-gray-200 flex-shrink-0">
            <div className="flex px-2">
              {[
                { id: "overview", label: "Overview" },
                { id: "availability", label: "Availability" },
                { id: "reviews", label: "Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-xs font-bold transition-all relative ${
                    activeTab === tab.id
                      ? "text-red-800"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-800 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Content Area (Scrollable - Now has more space) */}
          <div className="p-6 overflow-y-auto flex-1 bg-white">
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 border-l-4 border-red-800 pl-3">
                    About
                  </h3>
                  <p className="text-gray-800 leading-relaxed text-sm font-medium">
                    {tutor.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                    <Language className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-[10px] font-bold text-blue-900 uppercase">Languages</div>
                    <div className="text-xs font-bold text-blue-700 mt-1">
                      {tutor.languages.join(", ")}
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
                    <MenuBook className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-[10px] font-bold text-purple-900 uppercase">Ajzaa</div>
                    <div className="text-xs font-bold text-purple-700 mt-1">
                      {tutor.ajzaa_memorized}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                    <AccountBalance className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-[10px] font-bold text-green-900 uppercase">Sect</div>
                    <div className="text-xs font-bold text-green-700 mt-1">
                      {tutor.sect}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                    <Public className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <div className="text-[10px] font-bold text-orange-900 uppercase">Origin</div>
                    <div className="text-xs font-bold text-orange-700 mt-1">
                      {tutor.country_of_origin}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 border-l-4 border-red-800 pl-3">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mockData.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-800 text-white rounded-full text-[10px] font-bold shadow-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 border-l-4 border-red-800 pl-3">
                    Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mockData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <Verified className="w-4 h-4 text-green-600" />
                        <span className="text-gray-800 font-bold text-xs">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "availability" && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <h3 className="text-base font-bold text-gray-900 mb-3 border-l-4 border-red-800 pl-3">
                  Weekly Schedule
                </h3>
                {mockData.availability.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="font-bold text-sm text-gray-900">
                      {schedule.day}
                    </div>
                    <div className="text-xs font-bold text-red-800">
                      {schedule.times.join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                  <h3 className="text-base font-bold text-red-900">
                    Student Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    {renderStars(mockData.rating)}
                    <span className="font-black text-red-900 text-sm">
                      {mockData.rating}
                    </span>
                  </div>
                </div>

                {mockData.reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Person className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="font-bold text-sm text-gray-900">
                          {review.student}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">
                          {review.date}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-xs font-medium italic leading-relaxed">
                      "{review.comment}"
                    </p>
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