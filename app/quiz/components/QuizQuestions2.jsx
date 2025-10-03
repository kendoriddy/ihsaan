"use client";
import React, { useState, useEffect } from "react";
import { useFetch, usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import {
  Box,
  Modal,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import {
  formatTime,
  formatDate,
  decimalToFraction,
} from "../../../utils/utilFunctions";
import { getAuthToken } from "@/hooks/axios/axios";
import axios from "axios";

const QuizQuestion2 = ({ sectionData, setOpenQuizModal }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60 * 1000); // default 30 min
  const [selectedOption, setSelectedOption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResponse, setShowResponse] = useState(null);

  const {
    isLoading,
    data: QuestionsList,
    isFetching,
  } = useFetch(
    "questions",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcquestions/course-section/${sectionData?.id}/`,
    () => {},
    (error) => {
      toast.error(error.error || "Failed to load questions.");
      setOpenQuizModal(false);
    }
  );

  const Questions = QuestionsList?.data || [];

  useEffect(() => {
    if (Questions.length > 0) {
      setAnswers(Array(Questions.length).fill(null));
    }
  }, [Questions]);

  const { mutate: submitQuiz, isLoading: submittingQuiz } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcquestions/course-section/${sectionData?.id}/submit/`,
    {
      onSuccess: (response) => {
        toast.success("Quiz submitted successfully");
        console.log(response, "response::::");
        // Fetch detailed results using mcq_response_id with axios
        const token = getAuthToken();
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcq-responses/${response.data.mcq_response_id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            setShowResponse(res.data);
            setShowModal(true);
          })
          .catch((error) => {
            toast.error("Error fetching detailed results");
            setShowResponse(null);
            setShowModal(true);
          });
      },
      onError: (error) => {
        toast.error("Error submitting quiz");
        setShowResponse(null);
        setShowModal(true);
      },
    }
  );

  // Timer with auto-submit
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1000), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (key) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = key;
    setAnswers(updatedAnswers);
    setSelectedOption(key);
  };

  const handleSubmit = () => {
    if (!Questions.length) return;
    const unanswered = answers.filter((a) => a === null);
    if (unanswered.length > 0) {
      const confirm = window.confirm(
        "Some questions are unanswered. Submit anyway?"
      );
      if (!confirm) return;
    }
    const formatted = Questions.reduce((acc, q, i) => {
      if (answers[i] !== null) acc[q.id] = answers[i];
      return acc;
    }, {});
    submitQuiz({ answers: formatted });
  };

  const handleNext = () => {
    if (currentQuestionIndex < Questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleGoBack = () => {
    setOpenQuizModal(false);
  };

  const cards = [
    { id: 1, title: "Total", description: Questions.length },
    {
      id: 2,
      title: "Answered",
      description: answers.filter((a) => a !== null).length,
    },
    {
      id: 3,
      title: "Pending",
      description: answers.filter((a) => a === null).length,
    },
    { id: 4, title: "Time Left", description: formatTime(timeLeft) },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading questions...
        </p>
        <Loader />
      </div>
    );
  }

  if (!Questions.length) {
    return (
      <p className="text-lg font-semibold text-gray-600">
        No questions available.
      </p>
    );
  }

  const currentQ = Questions[currentQuestionIndex];

  return (
    <div className="w-full flex">
      <div className="flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {cards.map((card) => (
            <Card key={card.id}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" align="center">
                    {card.title}
                  </Typography>
                  <Typography variant="subtitle1" align="center">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </div>

        <div className="border p-4 rounded-md">
          <p className="text-center text-lg font-semibold mb-4">
            Question {currentQuestionIndex + 1}
          </p>
          <div className="text-center mb-4">
            {parse(currentQ?.question_text || "")}
          </div>
          <div className="space-y-2">
            {currentQ?.options &&
              Object.entries(currentQ.options).map(([key, text]) => (
                <label
                  key={key}
                  className="block p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name={`q-${currentQ.id}`}
                    checked={answers[currentQuestionIndex] === key}
                    onChange={() => handleOptionSelect(key)}
                    className="mr-2"
                  />
                  {parse(text)}
                </label>
              ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button onClick={handleSubmit} color="secondary">
              Submit
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === Questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="w-1/4 pl-4">
        <h3 className="text-lg font-semibold mb-2">Question Tracker</h3>
        <div className="space-y-1">
          {Questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestionIndex(i)}
              className={`block w-full text-left p-2 rounded-md ${
                answers[i] ? "bg-green-100" : "bg-red-100"
              }`}
            >
              Question {i + 1}: {answers[i] ? "Answered" : "Unanswered"}
            </button>
          ))}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {showResponse ? (
            <div className="space-y-6">
              <h1 className="text-center font-bold text-xl md:text-3xl">
                {showResponse.assessment_title}
              </h1>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <strong>Number of Questions:</strong>
                  <span>{showResponse.summary?.total_questions}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Correct Answers:</strong>
                  <span>{showResponse.summary?.correct_answers}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Wrong Answers:</strong>
                  <span>
                    {showResponse.summary?.total_questions -
                      showResponse.summary?.correct_answers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <strong>Obtainable Score:</strong>
                  <span>{showResponse.summary?.assessment_max_score}</span>
                </div>
                <div className="flex justify-between">
                  <strong>Your Score:</strong>
                  <span>{decimalToFraction(showResponse.summary?.score)}</span>
                </div>
                <div className="flex justify-between">
                  <strong>You submitted on:</strong>
                  <span>{formatDate(showResponse.submission_date)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="font-semibold text-justify">
                  <h3 className="text-base md:text-xl">
                    See your question breakdown below
                  </h3>
                  <p className="text-sm md:text-base">
                    Correct answers are displayed in green while incorrect
                    answers are displayed in red.
                  </p>
                </div>
                {Object.entries(showResponse.responses || {}).map(
                  ([key, resp], index) => {
                    const isCorrect = resp.is_correct;
                    const correctAnswer = resp.correct_answer;
                    const studentAnswer = resp.student_answer;

                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-md border ${
                          isCorrect
                            ? "border-green-400 bg-green-50"
                            : "border-red-400 bg-red-50"
                        }`}
                      >
                        <h2
                          className={`font-semibold mb-2 ${
                            isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {index + 1}. {resp.question_text}
                        </h2>
                        <ul className="space-y-1">
                          {Object.entries(resp.options).map(
                            ([optionKey, optionValue]) => {
                              const isStudentAnswer =
                                studentAnswer === optionKey;
                              const isCorrectOption =
                                correctAnswer === optionKey;

                              const optionClass = `p-2 rounded-md ${
                                isCorrectOption &&
                                !isStudentAnswer &&
                                !isCorrect
                                  ? "bg-green-100 text-green-700"
                                  : isStudentAnswer && !isCorrect
                                  ? "bg-red-100 text-red-700"
                                  : isStudentAnswer && isCorrect
                                  ? "bg-green-100 text-green-700"
                                  : ""
                              }`;

                              return (
                                <li key={optionKey} className={optionClass}>
                                  <span className="font-bold">
                                    {optionKey}.
                                  </span>{" "}
                                  {optionValue}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <p className="text-red-600">No results available</p>
          )}
          <Button onClick={handleGoBack} className="mt-4 w-full">
            Back
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default QuizQuestion2;
