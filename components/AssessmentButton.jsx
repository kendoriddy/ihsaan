"use client";

import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaQuestionCircle,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";

const AssessmentButton = ({ section, onStartAssessment }) => {
  const [assessmentStatus, setAssessmentStatus] = useState({
    isLoading: true,
    hasTaken: false,
    error: null,
  });

  useEffect(() => {
    const checkAssessmentStatus = async () => {
      if (!section?.id) return;

      try {
        // Get user ID from localStorage or fetch from API
        let userId = localStorage.getItem("userId");

        if (!userId) {
          // If not in localStorage, fetch from API
          const userResponse = await axios.get(
            "https://ihsaanlms.onrender.com/api/auth/logged-in-user/",
            {
              headers: {
                Authorization: `Bearer ${getAuthToken()}`,
              },
            }
          );
          userId = userResponse.data?.id;

          if (userId) {
            localStorage.setItem("userId", userId);
          }
        }

        if (!userId) {
          throw new Error("User ID not found");
        }

        // Check if user has already taken the assessment
        const response = await axios.get(
          `https://ihsaanlms.onrender.com/assessment/assessments/has-taken/`,
          {
            params: {
              course_section: section.id,
              user_id: userId,
            },
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        setAssessmentStatus({
          isLoading: false,
          hasTaken: response.data?.has_taken || false,
          error: null,
        });
      } catch (error) {
        console.error("Error checking assessment status:", error);
        setAssessmentStatus({
          isLoading: false,
          hasTaken: false,
          error: error.message,
        });
      }
    };

    checkAssessmentStatus();
  }, [section?.id]);

  const handleClick = () => {
    if (assessmentStatus.hasTaken) {
      return; // Prevent action if already taken
    }
    onStartAssessment(section);
  };

  if (!section.has_mcq_assessment) {
    return null;
  }

  if (assessmentStatus.isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-gray-400 mr-3">
              <FaQuestionCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                Section Assessment
              </h4>
              <p className="text-sm text-gray-500">
                Checking assessment status...
              </p>
            </div>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  if (assessmentStatus.hasTaken) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">
              <FaCheckCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                Section Assessment
              </h4>
              <p className="text-sm text-green-600">
                Assessment completed successfully
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg font-medium bg-green-500 text-white flex items-center">
            <FaLock className="w-4 h-4 mr-2" />
            Completed
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-blue-600 mr-3">
            <FaQuestionCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Section Assessment</h4>
            <p className="text-sm text-blue-600">
              Take the assessment for this section
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center bg-blue-500 hover:bg-blue-600 text-white"
        >
          <FaPlay className="w-4 h-4 mr-2" />
          Start Assessment
        </button>
      </div>
    </div>
  );
};

export default AssessmentButton;
