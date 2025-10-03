"use client";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { formatDate, formatDuration } from "@/utils/utilFunctions";
import { Pagination } from "@mui/material";
import { useState, useEffect } from "react";
import QuizSummary from "./QuizSummary";

const QuizList = ({ setCurrentScreen }) => {
  const [totalQuiz, setTotalQuiz] = useState(10);
  const [page, setPage] = useState(1);
  const [quizId, setQuizId] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const {
    isLoading,
    data: QuizesList,
    isFetching,
    refetch,
  } = useFetch(
    "questions",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/base/?question_type=MCQ&page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalQuiz(data.total);
      }
    }
  );

  const {
    isLoading: isLoadingQuizData,
    data: QuizData,
    refetch: refetchQuizData,
    isFetching: isFetchingQuizData,
    error,
  } = useFetch(
    `submission-${quizId}`,
    quizId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcq-responses/?assessment=${quizId}&student=${studentId}`
      : null,
    (data) => {},
    (error) => {}
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
  };

  const Quizes = QuizesList && QuizesList?.data?.results;

  // Filter quizzes to show only those available for general quiz taking
  const filteredQuizes =
    Quizes?.filter((quiz) => quiz.course_section === null) || [];

  useEffect(() => {
    const selectedQuiz = localStorage.getItem("selectedQuiz");
    if (selectedQuiz) {
      const quizData = JSON.parse(selectedQuiz);
      const quizState = localStorage.getItem(`quizState_${quizData.id}`);
      if (quizState) {
        setCurrentScreen("quiz");
      }
    }
  }, [setCurrentScreen]);

  const fetchStudentId = () => {
    const storedStudentId = localStorage.getItem("userId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
    }
  };

  useEffect(() => {
    fetchStudentId();
  });

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-semibold mb-6">Quiz List</h2>
      {!Quizes && (
        <p className="py-8 font-bold text-lg animate-pulse">
          Loading quizzes...
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Quizes &&
          Quizes.map((filteredQuiz) => (
            <>
              <div
                key={filteredQuiz.id}
                className="border border-gray-300 rounded-md p-4 flex flex-col items-center justify-between shadow-sm"
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium">{filteredQuiz.title}</h3>
                  <p className="text-sm text-gray-500">
                    {filteredQuiz.course_title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {filteredQuiz.course_code}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong className="text-green-600">Start:</strong>{" "}
                    {(filteredQuiz.course_section === null &&
                      formatDate(filteredQuiz?.start_date)) ||
                      "No start date available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong className="text-red-600">End:</strong>{" "}
                    {(filteredQuiz.course_section === null &&
                      formatDate(filteredQuiz?.end_date)) ||
                      "No end date available"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong className="">Duration:</strong>{" "}
                    {(filteredQuiz.course_section === null &&
                      formatDuration(filteredQuiz.mcq_duration)) ||
                      "No duration available"}
                  </p>
                  <p>
                    <strong className="text-yellow-600">Status:</strong>{" "}
                    {filteredQuiz?.submission_status === "submitted" ? (
                      <span className="text-green-600">Submitted</span>
                    ) : filteredQuiz?.is_open ? (
                      <span className="text-blue-600">Pending</span>
                    ) : (
                      <span className="text-red-600">Closed</span>
                    )}
                  </p>
                </div>
                {filteredQuiz?.submission_status === "submitted" ? (
                  <Button
                    onClick={() => {
                      setQuizId(filteredQuiz?.id);
                      setShowSummary(true);
                    }}
                    className="mt-4 px-10 py-2"
                    size="large"
                    color="secondary"
                    disabled={filteredQuiz.course_section !== null}
                  >
                    {filteredQuiz.course_section === null
                      ? "View Details"
                      : "View from Course"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      localStorage.setItem(
                        "selectedQuiz",
                        JSON.stringify(filteredQuiz)
                      );
                      setCurrentScreen("instructions");
                    }}
                    className="mt-4 px-10 py-2"
                    size="large"
                    color="secondary"
                    disabled={
                      filteredQuiz?.submission_status === "submitted" ||
                      filteredQuiz?.is_open === false ||
                      filteredQuiz.course_section !== null
                    }
                  >
                    {filteredQuiz?.is_open === false
                      ? "Quiz Closed"
                      : filteredQuiz.course_section === null
                      ? "Take Quiz"
                      : "Take from Course"}
                  </Button>
                )}
              </div>
              <CustomModal
                open={showSummary}
                onClose={() => setShowSummary(false)}
              >
                <QuizSummary
                  summaryId={QuizData && QuizData?.data?.results[0].id}
                  startDate={formatDate(filteredQuiz?.start_date)}
                  endDate={formatDate(filteredQuiz?.end_date)}
                  duration={formatDuration(filteredQuiz?.mcq_duration)}
                />
              </CustomModal>
            </>
          ))}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(totalQuiz / 15)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default QuizList;
