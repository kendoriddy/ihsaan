"use client";

import React from "react";
import {
  FaPlay,
  FaQuestionCircle,
  FaCheckCircle,
  FaRedo,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectAssessmentResults } from "@/utils/redux/slices/assessmentSlice";

const AssessmentButton = ({ section, onStartAssessment }) => {
  const assessmentResults = useSelector((state) =>
    selectAssessmentResults(state, section.id)
  );

  const handleClick = () => {
    onStartAssessment(section);
  };

  if (!section.has_mcq_assessment) {
    return null;
  }

  const isCompleted = assessmentResults && assessmentResults.id;
  const score = assessmentResults?.score || 0;
  const totalQuestions = assessmentResults?.total_questions || 0;
  const passed = assessmentResults?.passed || false;

  return (
    <div
      className={`border rounded-lg p-3 mt-2 ${
        isCompleted
          ? passed
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
          : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`mr-3 ${
              isCompleted
                ? passed
                  ? "text-green-600"
                  : "text-red-600"
                : "text-blue-600"
            }`}
          >
            {isCompleted ? (
              passed ? (
                <FaCheckCircle className="w-4 h-4" />
              ) : (
                <FaRedo className="w-4 h-4" />
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
                  ? passed
                    ? "text-green-600"
                    : "text-red-600"
                  : "text-blue-600"
              }`}
            >
              {isCompleted
                ? `Score: ${score}/${totalQuestions} ${
                    passed ? "(Passed)" : "(Failed)"
                  }`
                : "Take the assessment for this section"}
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center ${
            isCompleted
              ? passed
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isCompleted ? (
            <>
              <FaRedo className="w-3 h-3 mr-1" />
              Retake
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
