"use client";

import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaQuestionCircle,
  FaCheckCircle,
  FaRedo,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectAssessmentResults } from "@/utils/redux/slices/assessmentSlice";
import { getAuthToken } from "@/hooks/axios/axios";
import axios from "axios";

const AssessmentButton = ({ section, onStartAssessment, course }) => {
  const assessmentResults = useSelector((state) =>
    selectAssessmentResults(state, section.id)
  );
  const [hasTakenAssessment, setHasTakenAssessment] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [userAssessmentResults, setUserAssessmentResults] = useState(null);

  // Check if user has already taken the assessment
  useEffect(() => {
    const checkAssessmentStatus = async () => {
      if (!section.has_mcq_assessment) {
        setIsCheckingStatus(false);
        return;
      }

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

        const hasTaken = response.data?.has_taken || false;
        setHasTakenAssessment(hasTaken);

        // If user has taken the assessment, fetch their results
        if (hasTaken && course?.assessments) {
          // Find the assessment for this section
          const sectionAssessment = course.assessments.find(
            (assessment) => assessment.course_section === section.id
          );

          if (sectionAssessment) {
            try {
              // Get user's assessment results
              const resultsResponse = await axios.get(
                `https://ihsaanlms.onrender.com/assessment/mcq-responses/?assessment=${sectionAssessment.id}&student=${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                  },
                }
              );

              if (resultsResponse.data?.results?.length > 0) {
                // Get the latest result
                const latestResult = resultsResponse.data.results[0];
                setUserAssessmentResults(latestResult);
              }
            } catch (resultsError) {
              console.error("Error fetching assessment results:", resultsError);
            }
          }
        }
      } catch (error) {
        console.error("Error checking assessment status:", error);
        setHasTakenAssessment(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkAssessmentStatus();
  }, [section.id, section.has_mcq_assessment, course?.assessments]);

  const handleClick = () => {
    // If user has already taken the assessment, show results instead of starting new assessment
    if (isCompleted && (assessmentResults || userAssessmentResults)) {
      // Show the assessment results modal
      const resultsToShow = assessmentResults || userAssessmentResults;
      onStartAssessment({
        ...section,
        showResults: true,
        results: resultsToShow,
      });
    } else {
      // Start new assessment
      onStartAssessment(section);
    }
  };

  if (!section.has_mcq_assessment) {
    return null;
  }

  // Use Redux results if available, otherwise use the fetched user results
  const isCompleted =
    assessmentResults && assessmentResults.id ? true : hasTakenAssessment;
  const score = assessmentResults?.score || userAssessmentResults?.score || 0;
  const totalQuestions =
    assessmentResults?.total_questions ||
    userAssessmentResults?.total_questions ||
    0;
  const passed =
    assessmentResults?.passed || userAssessmentResults?.passed || false;

  return (
    <div
      className={`border rounded-lg p-3 mt-2 ${
        isCompleted
          ? assessmentResults && assessmentResults.id
            ? passed
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
            : "bg-gray-50 border-gray-200"
          : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`mr-3 ${
              isCompleted
                ? assessmentResults && assessmentResults.id
                  ? passed
                    ? "text-green-600"
                    : "text-red-600"
                  : "text-gray-600"
                : "text-blue-600"
            }`}
          >
            {isCompleted ? (
              assessmentResults && assessmentResults.id ? (
                passed ? (
                  <FaCheckCircle className="w-4 h-4" />
                ) : (
                  <FaRedo className="w-4 h-4" />
                )
              ) : (
                <FaCheckCircle className="w-4 h-4" />
              )
            ) : (
              <FaQuestionCircle className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">
              Section Assessment
            </h4>
            <p
              className={`text-xs ${
                isCompleted
                  ? assessmentResults && assessmentResults.id
                    ? passed
                      ? "text-green-600"
                      : "text-red-600"
                    : "text-gray-600"
                  : "text-blue-600"
              }`}
            >
              {isCompleted
                ? assessmentResults && assessmentResults.id
                  ? `Score: ${score}/${totalQuestions} ${
                      passed ? "(Passed)" : "(Failed)"
                    }`
                  : "Assessment completed"
                : "Take the assessment for this section"}
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center ${
            isCompleted
              ? assessmentResults && assessmentResults.id
                ? passed
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isCompleted ? (
            <>
              <FaRedo className="w-3 h-3 mr-1" />
              View
            </>
          ) : (
            <>
              <FaPlay className="w-3 h-3 mr-1" />
              Start
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AssessmentButton;
