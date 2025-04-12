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

const QuizQuestion = ({ setCurrentScreen }) => {
  const quizData = JSON.parse(localStorage.getItem("selectedQuiz"));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showResponse, setShowResponse] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60 * 1000);
  const router = useRouter();

  const {
    isLoading,
    data: QuestionsList,
    isFetching,
    refetch,
  } = useFetch(
    "questions",
    `https://ihsaanlms.onrender.com/assessment/mcquestions/random-for-assessment/?assessment_type=TEST&page_size=20&assessment_id=${quizData.id}&term=${quizData.term}`,
    (data) => {},
    (error) => {
      toast.error(
        error.error ||
          "Failed to load questions, make sure you're eligible for the quiz"
      );
      localStorage.removeItem("selectedCourse");
      setCurrentScreen("list");
    }
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Time's up!");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const { mutate: submitQuiz, isLoading: submittingQuiz } = usePost(
    `https://ihsaanlms.onrender.com/assessment/mcquestions/submit-answers/?assessment_id=${quizData.id}`,
    {
      onSuccess: (response) => {
        toast.success("Quiz submitted successfully");
        setShowModal(true);
        setShowResponse(response);
      },
      onError: (error) => {
        toast.error(error.error || "Failed to submit quiz");
      },
    }
  );

  const Questions = QuestionsList && QuestionsList?.data?.questions;

  useEffect(() => {
    if (Questions?.length > 0) {
      setAnswers(Array(Questions.length).fill(null));
    }
  }, [Questions]);

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

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
      <div className="font-bold text-red-600">
        {minutes}: {seconds < 10 ? "0" : ""}
        {seconds}
      </div>
    );
  };

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
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting!");
      return;
    }
    const formattedAnswers = Questions.reduce((acc, question, index) => {
      acc[question.id] = answers[index];
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
    localStorage.removeItem("selectedQuiz");
    router.push("/dashboard");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
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
            {currentQuestion?.question_text}
          </p>
          <div className="space-y-3">
            {currentQuestion?.options &&
              Object.entries(currentQuestion.options).map(([key, option]) => (
                <label
                  key={key}
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
                  {option}
                </label>
              ))}
          </div>
          <div className="flex justify-between mt-6">
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
            <Button
              onClick={
                currentQuestionIndex === totalQuestions - 1
                  ? handleSubmit
                  : handleNext
              }
              color="secondary"
            >
              {currentQuestionIndex === totalQuestions - 1 ? "Submit" : "Next"}
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
              className="flex items-center transition-all duration-300"
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Quiz Result
          </Typography>
          <Typography id="modal-modal-description" className="">
            <p>
              <strong>Passing score:</strong>
              {showResponse?.pass_percentage}
            </p>
            <p>
              <strong>Your text score:</strong>
              {showResponse?.student_score}
            </p>{" "}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button color="secondary" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                localStorage.removeItem("selectedQuiz");
                setCurrentScreen("list");
              }}
            >
              Take Another Quiz
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default QuizQuestion;
