"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  const [hasAlreadyTaken, setHasAlreadyTaken] = useState(false);

  // Assessment scheduling states
  const [assessmentSchedule, setAssessmentSchedule] = useState({
    startDate: null,
    endDate: null,
    timeWindow: null, // in minutes
    isScheduled: false,
  });
  const [scheduleStatus, setScheduleStatus] = useState("checking"); // 'checking', 'available', 'not_available', 'expired'

  // Question randomization and pools
  const [questionPool, setQuestionPool] = useState([]);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [questionSettings, setQuestionSettings] = useState({
    randomizeOrder: true,
    useQuestionPool: true,
    maxQuestions: 10,
    difficultyLevel: "mixed", // 'easy', 'medium', 'hard', 'mixed'
  });

  // Check if user has already taken the assessment
  const checkAssessmentTaken = useCallback(async () => {
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
            course_section: sectionData.id,
            user_id: userId,
          },
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      setHasAlreadyTaken(response.data?.has_taken || false);
    } catch (error) {
      console.error("Error checking assessment status:", error);
      setHasAlreadyTaken(false);
    }
  }, [sectionData?.id]);

  // Check assessment scheduling
  const checkAssessmentSchedule = () => {
    // For demo purposes, we'll simulate scheduling data
    // In a real implementation, this would come from the backend
    const now = new Date();
    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday (available now)
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Next week
    const timeWindow = 30; // 30 minutes

    setAssessmentSchedule({
      startDate,
      endDate,
      timeWindow,
      isScheduled: true,
    });

    // Check if assessment is available
    if (now < startDate) {
      setScheduleStatus("not_available");
    } else if (now > endDate) {
      setScheduleStatus("expired");
    } else {
      setScheduleStatus("available");
    }
  };

  // Question randomization functions
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const filterQuestionsByDifficulty = (questions, difficulty) => {
    if (difficulty === "mixed") return questions;

    // For demo purposes, we'll simulate difficulty filtering
    // In a real implementation, questions would have difficulty metadata
    return questions.filter((_, index) => {
      if (difficulty === "easy") return index % 3 === 0;
      if (difficulty === "medium") return index % 3 === 1;
      if (difficulty === "hard") return index % 3 === 2;
      return true;
    });
  };

  const createRandomizedQuestionSet = useCallback(
    (allQuestions) => {
      let selectedQuestions = [...allQuestions];

      // Filter by difficulty if specified
      if (questionSettings.difficultyLevel !== "mixed") {
        selectedQuestions = filterQuestionsByDifficulty(
          selectedQuestions,
          questionSettings.difficultyLevel
        );
      }

      // Limit number of questions if using question pool
      if (
        questionSettings.useQuestionPool &&
        selectedQuestions.length > questionSettings.maxQuestions
      ) {
        selectedQuestions = shuffleArray(selectedQuestions).slice(
          0,
          questionSettings.maxQuestions
        );
      }

      // Randomize order if enabled
      if (questionSettings.randomizeOrder) {
        selectedQuestions = shuffleArray(selectedQuestions);
      }

      return selectedQuestions;
    },
    [questionSettings]
  );

  // Fetch questions when modal opens

  // Initialize answers when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  const fetchQuestions = useCallback(async () => {
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
      console.log("response.data::::", response.data);
      const allQuestions = response.data || [];

      // Store original question pool
      setQuestionPool(allQuestions);

      // Create randomized question set
      const randomizedSet = createRandomizedQuestionSet(allQuestions);
      setRandomizedQuestions(randomizedSet);
      setQuestions(randomizedSet);
    } catch (error) {
      toast.error("Failed to load assessment questions");
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sectionData, createRandomizedQuestionSet]);

  useEffect(() => {
    if (isOpen && sectionData?.id) {
      checkAssessmentSchedule();
      checkAssessmentTaken();
      fetchQuestions();
    }
  }, [isOpen, sectionData?.id, fetchQuestions, checkAssessmentTaken]);

  const handleStartAssessment = () => {
    if (hasAlreadyTaken) {
      toast.error("You have already taken this assessment");
      return;
    }

    if (scheduleStatus !== "available") {
      toast.error("Assessment is not available at this time");
      return;
    }

    setHasStarted(true);
    // Use scheduled time window if available, otherwise default to 30 minutes
    const timeLimit = assessmentSchedule.timeWindow
      ? assessmentSchedule.timeWindow * 60 * 1000
      : 30 * 60 * 1000;
    setTimeLeft(timeLimit);
  };

  const handleRegenerateQuestions = () => {
    if (questionPool.length === 0) return;

    const newRandomizedSet = createRandomizedQuestionSet(questionPool);
    setRandomizedQuestions(newRandomizedSet);
    setQuestions(newRandomizedSet);
    setCurrentQuestionIndex(0);
    setAnswers(Array(newRandomizedSet.length).fill(null));
    toast.success("Questions regenerated with new randomization");
  };

  const handleQuestionSettingsChange = (setting, value) => {
    setQuestionSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
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

  const handleSubmit = useCallback(async () => {
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
  }, [questions, answers, sectionData, onAssessmentComplete]);

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
  }, [hasStarted, timeLeft, handleSubmit]);

  // Handle pre-loaded results when sectionData contains results
  useEffect(() => {
    if (isOpen && sectionData?.showResults && sectionData?.results) {
      setAssessmentResults(sectionData.results);
      setShowResults(true);
    }
  }, [isOpen, sectionData]);

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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-scroll">
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

              {/* Schedule Status */}
              {assessmentSchedule.isScheduled && (
                <div className="mb-6">
                  {scheduleStatus === "not_available" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                        Assessment Not Yet Available
                      </h4>
                      <p className="text-yellow-700">
                        This assessment will be available from{" "}
                        <strong>
                          {formatDate(assessmentSchedule.startDate)}
                        </strong>
                      </p>
                    </div>
                  )}

                  {scheduleStatus === "expired" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <h4 className="text-lg font-semibold text-red-800 mb-2">
                        Assessment Expired
                      </h4>
                      <p className="text-red-700">
                        This assessment expired on{" "}
                        <strong>
                          {formatDate(assessmentSchedule.endDate)}
                        </strong>
                      </p>
                    </div>
                  )}

                  {scheduleStatus === "available" && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="text-lg font-semibold text-green-800 mb-2">
                        Assessment Available
                      </h4>
                      <p className="text-green-700">
                        Available until{" "}
                        <strong>
                          {formatDate(assessmentSchedule.endDate)}
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {hasAlreadyTaken
                  ? "Assessment Already Completed"
                  : scheduleStatus === "available"
                  ? "Ready to Start Assessment?"
                  : "Assessment Information"}
              </h3>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-semibold">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-semibold">
                      {assessmentSchedule.timeWindow || 30} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-semibold">1</span>
                  </div>
                  {assessmentSchedule.isScheduled && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available From:</span>
                        <span className="font-semibold text-sm">
                          {formatDate(assessmentSchedule.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Until:</span>
                        <span className="font-semibold text-sm">
                          {formatDate(assessmentSchedule.endDate)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Question Randomization Settings */}
              {/* {questionPool.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">
                    Question Settings
                  </h4>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Randomize Order:</span>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={questionSettings.randomizeOrder}
                          onChange={(e) =>
                            handleQuestionSettingsChange(
                              "randomizeOrder",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">Enabled</span>
                      </label>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Use Question Pool:</span>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={questionSettings.useQuestionPool}
                          onChange={(e) =>
                            handleQuestionSettingsChange(
                              "useQuestionPool",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">Enabled</span>
                      </label>
                    </div>

                    {questionSettings.useQuestionPool && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Max Questions:</span>
                        <select
                          value={questionSettings.maxQuestions}
                          onChange={(e) =>
                            handleQuestionSettingsChange(
                              "maxQuestions",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                          <option value={questionPool.length}>
                            All ({questionPool.length})
                          </option>
                        </select>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Difficulty:</span>
                      <select
                        value={questionSettings.difficultyLevel}
                        onChange={(e) =>
                          handleQuestionSettingsChange(
                            "difficultyLevel",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="mixed">Mixed</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleRegenerateQuestions}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Regenerate Questions
                    </button>
                  </div>
                </div>
              )} */}

              {hasAlreadyTaken ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-green-800 mb-2">
                      Assessment Completed
                    </h4>
                    <p className="text-green-700 mb-4">
                      You have already completed this assessment. Only one
                      attempt is allowed.
                    </p>
                    <button
                      onClick={handleClose}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                scheduleStatus === "available" && (
                  <button
                    onClick={handleStartAssessment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
                  >
                    <FaPlay className="w-4 h-4 mr-2" />
                    Start Assessment
                  </button>
                )
              )}
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
  // Calculate percentage based on correct answers vs total questions
  const totalQuestions = results?.summary?.total_questions || 0;
  const correctAnswers = results?.summary?.correct_answers || 0;
  const scorePercentage =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

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
                {totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">
                {totalQuestions - correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Your Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-gray-800">Question Review</h4>
        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
          {Object.entries(results?.responses || {}).map(
            ([key, resp], index) => {
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
                          if (
                            isCorrectOption &&
                            !isStudentAnswer &&
                            !isCorrect
                          ) {
                            optionClass +=
                              "bg-green-100 border-green-300 text-green-700";
                          } else if (isStudentAnswer && !isCorrect) {
                            optionClass +=
                              "bg-red-100 border-red-300 text-red-700";
                          } else if (isStudentAnswer && isCorrect) {
                            optionClass +=
                              "bg-green-100 border-green-300 text-green-700";
                          } else {
                            optionClass +=
                              "bg-gray-50 border-gray-200 text-gray-700";
                          }

                          return (
                            <div key={optionKey} className={optionClass}>
                              <span className="font-bold mr-2">
                                {optionKey}.
                              </span>
                              {parse(optionValue)}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
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
