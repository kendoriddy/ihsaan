import Button from "@/components/Button";
import { useState } from "react";

const quizzes = [
  { id: "1", title: "ITHS 102", tutor: "Ust. Fazil" },
  { id: "2", title: "ITHS 104", tutor: "Ust. Fazil" },
  { id: "3", title: "ITHS 105", tutor: "Ust. Fazil" },
  { id: "4", title: "ITHS 106", tutor: "Ust. Maryam" },
  { id: "5", title: "ITHS 107", tutor: "Ust. Aishah" },
  { id: "6", title: "ITHS 109", tutor: "Ust. Fazil" },
];
const QuizList = ({ setCurrentScreen }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-semibold mb-6">Quiz List</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="border border-gray-300 rounded-md p-4 flex flex-col items-center justify-between shadow-sm"
          >
            <div className="text-center">
              <h3 className="text-lg font-medium">{quiz.title}</h3>
              <p className="text-sm text-gray-500">Tutor: {quiz.tutor}</p>
            </div>
            <Button
              onClick={() => {
                setSelectedQuiz(quiz);
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
      </div>
    </div>
  );
};

export default QuizList;
