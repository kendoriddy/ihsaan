"use client";
import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useHttp/useHttp";
import QuizQuestion from "./components/QuizQuestions";
import QuizInstructions from "./components/QuizInstruction";
import QuizList from "./components/QuizList";

const StudentQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState("list");
  const [fetchAll, setFetchAll] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(10);

  const {
    isLoading,
    data: QuestionsList,
    isFetching,
    refetch,
  } = useFetch(
    "questions",
    `https://ihsaanlms.onrender.com/assessment/mcquestions/?page_size=${
      fetchAll ? totalQuestions : 10
    }`,
    (data) => {
      if (data?.total && !fetchAll) {
        setTotalQuestions(data.total);
        setFetchAll(true);
        refetch();
      }
    }
  );

  const Questions = QuestionsList && QuestionsList?.data;

  return (
    <div>
      {currentScreen === "list" && (
        <QuizList setCurrentScreen={setCurrentScreen} />
      )}
      {currentScreen === "instructions" && (
        <QuizInstructions
          questions={Questions}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === "quiz" && (
        <QuizQuestion questions={Questions?.results} />
      )}
    </div>
  );
};

export default StudentQuiz;
