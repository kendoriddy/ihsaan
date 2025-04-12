"use client";
import Button from "@/components/Button";
import { useFetch } from "@/hooks/useHttp/useHttp";
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
    (quiz) =>
      quiz.question_type === "MCQ" &&
      new Date(quiz.end_date) > new Date() &&
      quiz.is_open === true
  );
  console.log("courses", filteredQuizes);

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
                <p className="text-sm font-medium text-gray-500">
                  Tutor: {filteredQuiz.tutor_name}
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
              >
                Take Quiz
              </Button>
            </div>
          ))}
        <div className="flex justify-center mt-4">
          <Pagination
            count={Math.ceil(totalQuiz / 15)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
};

export default QuizList;
