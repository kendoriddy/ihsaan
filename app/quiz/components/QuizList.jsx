"use client";
import Button from "@/components/Button";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { formatDate } from "@/utils/utilFunctions";
import { Pagination } from "@mui/material";
import { useState } from "react";

const QuizList = ({ setCurrentScreen }) => {
  const [totalQuiz, setTotalQuiz] = useState(10);
  const [page, setPage] = useState(1);

  const {
    isLoading,
    data: QuizesList,
    isFetching,
    refetch,
  } = useFetch(
    "questions",
    `https://ihsaanlms.onrender.com/assessment/base/?page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalQuiz(data.total);
      }
    }
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
  };

  const Quizes = QuizesList && QuizesList?.data?.results;

  const filteredQuizes = Quizes?.filter(
    (quiz) => quiz.question_type === "MCQ"
    // &&
    //   new Date(quiz.end_date) > new Date() &&
    //   quiz.is_open === true
  );

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-semibold mb-6">Quiz List</h2>
      {!filteredQuizes && (
        <p className="py-8 font-bold text-lg animate-pulse">
          Loading quizzes...
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredQuizes &&
          filteredQuizes.map((filteredQuiz) => (
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
                  {formatDate(filteredQuiz?.start_date) ||
                    "No start date available"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong className="text-red-600">End:</strong>{" "}
                  {formatDate(filteredQuiz?.end_date) ||
                    "No end date available"}
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
                  filteredQuiz?.is_open === false
                }
              >
                Take Quiz
              </Button>
            </div>
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
