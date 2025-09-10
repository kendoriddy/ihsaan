"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaFlag,
  FaPlay,
} from "react-icons/fa";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";
import {
  formatTime,
  formatDate,
  decimalToFraction,
} from "@/utils/utilFunctions";

const AssessmentModal = ({
  isOpen,
  onClose,
  sectionData,
  onAssessmentComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60 * 1000); // 30 minutes default
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Fetch questions when modal opens
  useEffect(() => {
    if (isOpen && sectionData?.id) {
      fetchQuestions();
    }
  }, [isOpen, sectionData?.id]);

  // Initialize answers when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  // Timer effect
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          handleSubmit();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, timeLeft]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://ihsaanlms.onrender.com/assessment/mcquestions/course-section/${sectionData.id}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setQuestions(response.data?.data || []);
    } catch (error) {
      toast.error("Failed to load assessment questions");
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = () => {
    setHasStarted(true);
    setTimeLeft(30 * 60 * 1000); // Reset timer
  };

  const handleOptionSelect = (optionKey) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = optionKey;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    if (!questions.length) return;

    const unanswered = answers.filter((a) => a === null);
    if (unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered questions. Submit anyway?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.reduce((acc, q, i) => {
        if (answers[i] !== null) acc[q.id] = answers[i];
        return acc;
      }, {});

      const response = await axios.post(
        `https://ihsaanlms.onrender.com/assessment/mcquestions/course-section/${sectionData.id}/submit/`,
        { answers: formattedAnswers },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch detailed results
      const resultsResponse = await axios.get(
        `https://ihsaanlms.onrender.com/assessment/mcq-responses/${response.data.mcq_response_id}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      setAssessmentResults(resultsResponse.data);
      setShowResults(true);
      toast.success("Assessment submitted successfully!");

      // Notify parent component
      if (onAssessmentComplete) {
        onAssessmentComplete(resultsResponse.data);
      }
    } catch (error) {
      toast.error("Error submitting assessment");
      console.error("Error submitting assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (hasStarted && !showResults) {
      const confirm = window.confirm(
        "Are you sure you want to close? Your progress will be lost."
      );
      if (!confirm) return;
    }

    // Reset state
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeLeft(30 * 60 * 1000);
    setQuestions([]);
    setIsLoading(false);
    setIsSubmitting(false);
    setShowResults(false);
    setAssessmentResults(null);
    setHasStarted(false);

    onClose();
  };

  const getProgressPercentage = () => {
    if (!questions.length) return 0;
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return answers.filter((a) => a !== null).length;
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Section Assessment</h2>
              <p className="text-blue-100 mt-1">{sectionData?.title}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading assessment...</p>
            </div>
          ) : !hasStarted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaQuestionCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Start Assessment?
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-semibold">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-semibold">30 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-semibold">1</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleStartAssessment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
              >
                <FaPlay className="w-4 h-4 mr-2" />
                Start Assessment
              </button>
            </div>
          ) : showResults ? (
            <AssessmentResults
              results={assessmentResults}
              onClose={handleClose}
            />
          ) : (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              {/* Assessment Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="text-sm text-gray-600">Current</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {getAnsweredCount()}
                  </div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {questions.length - getAnsweredCount()}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600">Time Left</div>
                </div>
              </div>

              {/* Question */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h3>
                  <div className="flex items-center text-orange-600">
                    <FaClock className="w-4 h-4 mr-2" />
                    <span className="font-semibold">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-lg text-gray-800 leading-relaxed">
                    {parse(
                      questions[currentQuestionIndex]?.question_text || ""
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {questions[currentQuestionIndex]?.options &&
                    Object.entries(questions[currentQuestionIndex].options).map(
                      ([key, text]) => (
                        <label
                          key={key}
                          className={`block p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                            answers[currentQuestionIndex] === key
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${questions[currentQuestionIndex].id}`}
                            checked={answers[currentQuestionIndex] === key}
                            onChange={() => handleOptionSelect(key)}
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <div
                              className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                                answers[currentQuestionIndex] === key
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {answers[currentQuestionIndex] === key && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="font-semibold text-gray-700 mr-3">
                              {key}.
                            </span>
                            <span className="text-gray-800">{parse(text)}</span>
                          </div>
                        </label>
                      )
                    )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                        index === currentQuestionIndex
                          ? "bg-blue-600 text-white"
                          : answers[index]
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                  >
                    <FaFlag className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>

                  {currentQuestionIndex < questions.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Next
                      <FaChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Assessment Results Component
const AssessmentResults = ({ results, onClose }) => {
  const scorePercentage = results?.summary?.score
    ? (results.summary.score / results.summary.assessment_max_score) * 100
    : 0;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div
        className={`border-2 rounded-xl p-6 ${getScoreBgColor(
          scorePercentage
        )}`}
      >
        <div className="text-center">
          <div
            className={`text-6xl font-bold mb-2 ${getScoreColor(
              scorePercentage
            )}`}
          >
            {scorePercentage.toFixed(1)}%
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {results?.assessment_title || "Assessment Complete"}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {results?.summary?.total_questions || 0}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {results?.summary?.correct_answers || 0}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                {(results?.summary?.total_questions || 0) -
                  (results?.summary?.correct_answers || 0)}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {decimalToFraction(results?.summary?.score) || "0"}
              </div>
              <div className="text-sm text-gray-600">Your Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-gray-800">Question Review</h4>
        {Object.entries(results?.responses || {}).map(([key, resp], index) => {
          const isCorrect = resp.is_correct;
          const correctAnswer = resp.correct_answer;
          const studentAnswer = resp.student_answer;

          return (
            <div
              key={key}
              className={`border-2 rounded-lg p-4 ${
                isCorrect
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h5
                  className={`font-semibold ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  Question {index + 1}
                </h5>
                <div className="flex items-center">
                  {isCorrect ? (
                    <FaCheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <FaTimesCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-gray-800 font-medium mb-3">
                  {parse(resp.question_text)}
                </div>

                <div className="space-y-2">
                  {Object.entries(resp.options).map(
                    ([optionKey, optionValue]) => {
                      const isStudentAnswer = studentAnswer === optionKey;
                      const isCorrectOption = correctAnswer === optionKey;

                      let optionClass = "p-3 rounded-lg border ";
                      if (isCorrectOption && !isStudentAnswer && !isCorrect) {
                        optionClass +=
                          "bg-green-100 border-green-300 text-green-700";
                      } else if (isStudentAnswer && !isCorrect) {
                        optionClass += "bg-red-100 border-red-300 text-red-700";
                      } else if (isStudentAnswer && isCorrect) {
                        optionClass +=
                          "bg-green-100 border-green-300 text-green-700";
                      } else {
                        optionClass +=
                          "bg-gray-50 border-gray-200 text-gray-700";
                      }

                      return (
                        <div key={optionKey} className={optionClass}>
                          <span className="font-bold mr-2">{optionKey}.</span>
                          {parse(optionValue)}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Close Assessment
        </button>
      </div>
    </div>
  );
};

export default AssessmentModal;
