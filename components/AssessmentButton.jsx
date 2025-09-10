"use client";

import React from "react";
import { FaPlay, FaQuestionCircle } from "react-icons/fa";

const AssessmentButton = ({ section, onStartAssessment }) => {
  const handleClick = () => {
    onStartAssessment(section);
  };

  if (!section.has_mcq_assessment) {
    return null;
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
