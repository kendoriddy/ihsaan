"use client";

import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Close,
  CalendarToday,
  AccessTime,
  Email,
  Phone,
  Message,
  CheckCircle,
} from "@mui/icons-material";

export default function BookTrialModal({ tutor, isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentAge: "",
    currentLevel: "",
    goals: "",
    specialRequests: "",
  });

  if (!isOpen) return null;

  const fullName =
    `${tutor.first_name} ${tutor.middle_name} ${tutor.last_name}`.trim();

  // Mock available dates and times
  const availableDates = [
    "2024-01-15",
    "2024-01-16",
    "2024-01-17",
    "2024-01-18",
    "2024-01-19",
    "2024-01-22",
    "2024-01-23",
  ];

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      // Validate step 1
      if (!formData.date || !formData.time) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate step 2
      if (!formData.firstName || !formData.lastName || !formData.email) {
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Final submission
      console.log("Booking submitted:", formData);
      setStep(4); // Success step
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="book-trial-modal"
      aria-describedby="book-trial-modal-description"
    >
      <Box className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Book Trial Lesson
                </h2>
                <p className="text-gray-600 mt-1">with {fullName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Close className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mt-6">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNum
                        ? "bg-red-800 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > stepNum ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        step > stepNum ? "bg-red-800" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-2">
              <div className="text-sm text-gray-600">
                {step === 1 && "Select Date & Time"}
                {step === 2 && "Your Information"}
                {step === 3 && "Learning Goals"}
                {step === 4 && "Booking Confirmed"}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <CalendarToday className="w-4 h-4" />
                    Select Date{" "}
                    {formData.date && (
                      <span className="text-red-800 text-xs">✓ Selected</span>
                    )}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => handleInputChange("date", date)}
                        className={`p-3 text-left border rounded-xl transition-colors ${
                          formData.date === date
                            ? "border-red-800 bg-red-50 text-red-800 ring-2 ring-red-200"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">
                          {formatDate(date).split(",")[0]}
                        </div>
                        <div className="text-sm text-gray-500">{date}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <AccessTime className="w-4 h-4" />
                    Select Time{" "}
                    {formData.time && (
                      <span className="text-red-800 text-xs">✓ Selected</span>
                    )}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleInputChange("time", time)}
                        className={`p-3 text-center border rounded-xl transition-colors ${
                          formData.time === time
                            ? "border-red-800 bg-red-50 text-red-800 ring-2 ring-red-200"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{time}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formData.date || !formData.time}
                  className="w-full bg-red-800 hover:bg-red-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  {!formData.date || !formData.time
                    ? "Please select date and time"
                    : "Continue to Personal Information"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Email className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Age
                  </label>
                  <select
                    value={formData.studentAge}
                    onChange={(e) =>
                      handleInputChange("studentAge", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
                  >
                    <option value="">Select Age Range</option>
                    <option value="child">Child (5-12 years)</option>
                    <option value="teen">Teen (13-17 years)</option>
                    <option value="adult">Adult (18+ years)</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-800 hover:bg-red-900 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Quran Level
                  </label>
                  <select
                    value={formData.currentLevel}
                    onChange={(e) =>
                      handleInputChange("currentLevel", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700"
                  >
                    <option value="">Select Current Level</option>
                    <option value="beginner">
                      Beginner (Learning Arabic letters)
                    </option>
                    <option value="basic">
                      Basic (Can read with difficulty)
                    </option>
                    <option value="intermediate">
                      Intermediate (Can read fluently)
                    </option>
                    <option value="advanced">
                      Advanced (Working on Tajweed)
                    </option>
                    <option value="memorization">
                      Memorization (Hifz student)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Goals
                  </label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => handleInputChange("goals", e.target.value)}
                    placeholder="What would you like to achieve? (e.g., improve Tajweed, memorize specific Surahs, learn Arabic, etc.)"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Message className="w-4 h-4" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      handleInputChange("specialRequests", e.target.value)
                    }
                    placeholder="Any special requirements or questions for the tutor?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-700 focus:border-red-700 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-800 hover:bg-red-900 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    Book Trial Lesson
                  </button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Trial Lesson Booked!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your trial lesson with {fullName} has been scheduled for{" "}
                  <span className="font-medium">
                    {formatDate(formData.date)}
                  </span>{" "}
                  at <span className="font-medium">{formData.time}</span>.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-800">
                    <strong>What's next?</strong>
                    <br />• You'll receive a confirmation email shortly
                    <br />• The tutor will contact you 24 hours before the
                    lesson
                    <br />• Join the lesson using the link in your email
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-red-800 hover:bg-red-900 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
