"use client";
import Button from "@/components/Button";

const QuizInstructions = ({ questions, setCurrentScreen }) => {
  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-semibold mb-4">Quiz Instructions</h2>
      <div className="text-center">
        <p className="text-lg font-medium mb-4">Read Carefully</p>
        <p className="text-gray-600 mb-4">
          This quiz consists of {questions?.total} questions. You will have a
          limited time to complete the quiz. Make sure to read each question
          carefully and select the best answer. You can navigate between
          questions using the "Previous" and "Next" buttons. Once you are ready,
          click "Start Quiz" to start your quiz and press "Submit Quiz" to
          finish the quiz.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => setCurrentScreen("quiz")}
            className="mt-4 px-10 py-2"
            size="large"
            color="secondary"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructions;
