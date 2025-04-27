"use client";
import { useState } from "react";
import QuizQuestion from "./components/QuizQuestions";
import QuizInstructions from "./components/QuizInstruction";
import QuizList from "./components/QuizList";
import Layout from "@/components/Layout";

const StudentQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState("list");

  return (
    <Layout>
      <div className="w-full">
        {currentScreen === "list" && (
          <QuizList setCurrentScreen={setCurrentScreen} />
        )}
        {currentScreen === "instructions" && (
          <QuizInstructions
            // questions={Questions}
            setCurrentScreen={setCurrentScreen}
          />
        )}
        {currentScreen === "quiz" && (
          <QuizQuestion setCurrentScreen={setCurrentScreen} />
          // questions={Questions?.results}
        )}
      </div>
    </Layout>
  );
};

export default StudentQuiz;
