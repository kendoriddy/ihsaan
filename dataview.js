"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StartQuiz() {
  const { id } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    // Fetch quiz questions from API
    fetch(`/api/quiz/${id}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions));
  }, [id]);

  const handleAnswerClick = () => {
    setAnsweredCount(answeredCount + 1);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center">Quiz {id}</h1>
      <p className="text-center text-gray-500">
        Answered: {answeredCount} / Pending: {questions.length - answeredCount}
      </p>

      <div className="mt-6 p-4 border rounded-lg shadow">
        <p className="text-lg">{questions[currentQuestionIndex].question}</p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {questions[currentQuestionIndex].options.map((option, idx) => (
            <button
              key={idx}
              onClick={handleAnswerClick}
              className="p-2 border rounded-lg hover:bg-gray-200"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          className="px-4 py-2 border rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={currentQuestionIndex === questions.length - 1}
          onClick={handleAnswerClick}
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-green-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
