"use client";
import { useState } from "react";
import { useFetch } from "@/hooks/useHttp/useHttp";
import QuizQuestion from "./components/QuizQuestions";
import QuizInstructions from "./components/QuizInstruction";
import QuizList from "./components/QuizList";

// const questions = [
//   {
//     id: "1",
//     text: "Who is Muhammad?",
//     options: [
//       "A. An ordinary man",
//       "B. A man from Africa",
//       "C. The last Messenger of Allah",
//       "D. The first Prophet of Allah",
//     ],
//   },
//   {
//     id: "2",
//     text: "What is the capital of France?",
//     options: ["A. London", "B. Berlin", "C. Paris", "D. Madrid"],
//   },
//   // Add more questions as needed
// ];

const StudentQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState("list");

  const {
    isLoading,
    data: QuestionsList,
    isFetching,
    refetch,
  } = useFetch(
    "questions",
    `https://ihsaanlms.onrender.com/assessment/mcquestions/`
  );

  const Questions = QuestionsList && QuestionsList?.data?.results;

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
      {currentScreen === "quiz" && <QuizQuestion questions={Questions} />}
    </div>
  );
};

export default StudentQuiz;
