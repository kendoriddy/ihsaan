"use client";
import React, { useState, useEffect } from "react";
import { useFetch, usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import { formatTime, timeStringToMs } from "../../../utils/utilFunctions";
import parse from "html-react-parser";

const QuizQuestion = ({ setCurrentScreen }) => {
  const quizData = JSON.parse(localStorage.getItem("selectedQuiz"));
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedState = localStorage.getItem(`quizState_${quizData.id}`);
    return savedState ? JSON.parse(savedState).currentQuestionIndex : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const savedState = localStorage.getItem(`quizState_${quizData.id}`);
    return savedState ? JSON.parse(savedState).answers : [];
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedState = localStorage.getItem(`quizState_${quizData.id}`);
    return savedState
      ? JSON.parse(savedState).timeLeft
      : timeStringToMs(quizData.mcq_duration);
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResponse, setShowResponse] = useState(null);

  // Fetch questions
  const {
    isLoading,
    data: QuestionsList,
    isFetching,
    refetch,
  } = useFetch(
    "questions",
    `https://ihsaanlms.onrender.com/assessment/mcquestions/random-for-assessment/?page_size=${quizData?.mcq_question_count}&assessment_id=${quizData?.id}`,
    (data) => {},
    (error) => {
      toast.error(
        error.error ||
          "Failed to load questions, make sure you're eligible for the quiz"
      );
      localStorage.removeItem("selectedCourse");
      localStorage.removeItem(`quizState_${quizData.id}`);
      setCurrentScreen("list");
    }
  );

  const Questions = QuestionsList && QuestionsList?.data?.questions;

  useEffect(() => {
    if (Questions?.length > 0) {
      const savedState = localStorage.getItem(`quizState_${quizData.id}`);
      const savedAnswers = savedState ? JSON.parse(savedState).answers : null;
      setAnswers(savedAnswers || Array(Questions.length).fill(null));
    }
  }, [Questions]);

  useEffect(() => {
    if (Questions?.length > 0) {
      const quizState = {
        currentQuestionIndex,
        answers,
        timeLeft,
      };
      localStorage.setItem(
        `quizState_${quizData.id}`,
        JSON.stringify(quizState)
      );
    }
  }, [currentQuestionIndex, answers, timeLeft, Questions]);

  const handleAutoSubmit = () => {
    const formattedAnswers = Questions?.reduce((acc, question, index) => {
      if (answers[index] !== null) {
        acc[question.id] = answers[index];
      }
      return acc;
    }, {});
    submitQuiz({ answers: formattedAnswers });
  };

  // Timer logic with auto-submit
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Update selected option when navigating between questions
  useEffect(() => {
    const selected = answers[currentQuestionIndex];
    setSelectedOption(selected);
  }, [currentQuestionIndex, answers]);

  // Mutation for submitting the quiz
  const { mutate: submitQuiz, isLoading: submittingQuiz } = usePost(
    `https://ihsaanlms.onrender.com/assessment/mcquestions/submit-answers/?assessment_id=${quizData?.id}`,
    {
      onSuccess: (response) => {
        toast.success("Quiz submitted successfully");
        setShowModal(true);
        setShowResponse(response.data);
        console.log("submission response", response);
        console.log("show response", showResponse);
      },
      onError: (error) => {
        // toast.error(error.error || "Failed to submit quiz");
      },
    }
  );

  if (isLoading || isFetching || !Questions) {
    return (
      <div className="">
        <p className="text-lg font-semibold text-gray-600">
          Loading questions...
        </p>
        <Loader />
      </div>
    );
  }

  if (!Questions || Questions.length === 0) {
    return (
      <div className="">
        <p className="text-lg font-semibold text-gray-600">
          No questions available for this course.
        </p>
      </div>
    );
  }

  const currentQuestion = Questions[currentQuestionIndex];
  const totalQuestions = Questions.length;
  const answeredQuestions = answers.filter((answer) => answer !== null).length;
  const pendingQuestions = totalQuestions - answeredQuestions;

  const handleOptionSelect = (key) => {
    setSelectedOption(key);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = key;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => {
        const nextIndex = prev + 1;
        scrollToTracker(nextIndex);
        return nextIndex;
      });
      setSelectedOption(answers[currentQuestionIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => {
        const prevIndex = prev - 1;
        scrollToTracker(prevIndex);
        return prevIndex;
      });
      setSelectedOption(answers[currentQuestionIndex - 1]);
    }
  };

  const scrollToTracker = (index) => {
    const element = document.getElementById(`tracker-${index}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleSubmit = () => {
    const unansweredQuestions = answers.filter((answer) => answer === null);
    // if (unansweredQuestions.length > 0) {
    //   alert("All questions were not answered, are you sure want to submit?");
    // }
    if (unansweredQuestions.length > 0) {
      const confirmSubmit = window.confirm(
        "Some questions are unanswered. Are you sure you want to submit?"
      );

      if (!confirmSubmit) {
        return;
      }
    }
    const formattedAnswers = Questions.reduce((acc, question, index) => {
      if (answers[index] !== null) {
        acc[question.id] = answers[index];
      }
      return acc;
    }, {});
    submitQuiz({ answers: formattedAnswers });
  };

  const cards = [
    {
      id: 1,
      title: "Total",
      description: totalQuestions,
    },
    {
      id: 2,
      title: "Answered",
      description: answeredQuestions,
    },
    {
      id: 3,
      title: "Pending",
      description: pendingQuestions,
    },
    {
      id: 4,
      title: "Time Left",
      description: formatTime(timeLeft),
    },
  ];

  const handleGoToDashboard = () => {
    localStorage.removeItem(`quizState_${quizData.id}`);
    localStorage.removeItem("selectedQuiz");
    router.push("/dashboard");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid white",
    boxShadow: 24,
    width: 370,
    p: 4,
  };

  return (
    <div className="w-full flex">
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
              gap: 2,
            }}
          >
            {cards.map((card, index) => (
              <Card key={index}>
                <CardActionArea
                  sx={{
                    height: "100%",
                    "&[data-active]": {
                      backgroundColor: "action.selected",
                      "&:hover": {
                        backgroundColor: "action.selectedHover",
                      },
                    },
                  }}
                >
                  <CardContent sx={{ height: "100%" }}>
                    <Typography
                      variant="h5"
                      component="div"
                      className="text-center"
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      className="text-center"
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </div>
        <div className="border border-gray-300 rounded-md p-6 shadow-sm">
          <p className="text-lg text-center font-semibold mb-4">
            Question {currentQuestionIndex + 1}
          </p>
          <p className="text-lg text-center font-medium mb-4">
            {parse(currentQuestion?.question_text)}
          </p>
          <div className="space-y-3">
            {currentQuestion?.options &&
              Object.entries(currentQuestion.options).map(([key, option]) => (
                <label
                  key={key}
                  id={`question-${currentQuestionIndex}`}
                  className="flex items-center p-2 border border-gray-200 rounded-md cursor-pointer hover:border-purple-600"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={key}
                    checked={selectedOption === key}
                    onChange={() => handleOptionSelect(key)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-600 mr-2"
                  />
                  {parse(option)}
                </label>
              ))}
          </div>
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between items-center mt-6">
            {/* Previous Button - Left */}
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              } transition-colors duration-300`}
            >
              Previous
            </Button>

            {/* Submit Button - Center */}
            <div className="flex-1 flex justify-center">
              <Button
                onClick={handleSubmit}
                color="secondary"
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                Submit
              </Button>
            </div>

            {/* Next Button - Right */}
            <Button
              onClick={handleNext}
              color="secondary"
              disabled={currentQuestionIndex === totalQuestions - 1}
              className={`px-6 py-2 rounded-md ${
                currentQuestionIndex === totalQuestions - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition-colors duration-300`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="w-1/4 pl-4 sticky top-10 max-h-[85vh] overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Questions Tracking</h3>
        <div className="space-y-2">
          {Questions.map((_, index) => (
            <div
              key={index}
              id={`tracker-${index}`}
              className="flex items-center transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentQuestionIndex(index)}
              tabIndex={0}
            >
              <input
                type="checkbox"
                checked={answers[index] !== null}
                readOnly
                className="hidden"
              />
              <span
                className={`w-6 h-6 flex items-center justify-center border rounded-md ${
                  answers[index]
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-red-500 text-white border-red-500"
                }`}
              >
                {index + 1}
              </span>
              <span className="ml-2 text-sm text-nowrap">
                {answers[index] ? "Answered" : "Unanswered"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            className="text-center mb-4 font-extrabold"
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Quiz Result
          </Typography>
          <Typography id="modal-modal-description" className="">
            <p>
              <strong>Number of Questions:</strong>{" "}
              {showResponse?.total_questions}
            </p>
            <p>
              <strong>Correct Answers:</strong> {showResponse?.correct_answers}
            </p>
            <p>
              <strong>Total Score:</strong> {showResponse?.total_score}
            </p>
            <p>
              <strong>Your Score:</strong> {showResponse?.student_score}
            </p>
            <p>
              <strong>Pass Accuracy (%):</strong>{" "}
              {showResponse?.pass_percentage}
            </p>
          </Typography>
          <div
            className="mt-4 flex flex-col gap-3 md:gap-4"
            sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
          >
            <Button color="secondary" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                localStorage.removeItem(`quizState_${quizData.id}`);
                localStorage.removeItem("selectedQuiz");
                setCurrentScreen("list");
              }}
            >
              Take Another Quiz
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default QuizQuestion;
