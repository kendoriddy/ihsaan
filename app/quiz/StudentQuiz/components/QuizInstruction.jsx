const QuizInstructions = ({ questions, setCurrentScreen }) => {
  return (
    <div className="w-full max-w-2xl px-4">
      <h2 className="text-2xl font-semibold mb-4">Quiz Instructions</h2>
      <div className="border border-gray-300 rounded-md p-6 shadow-sm">
        <p className="text-lg font-medium mb-4">Read Carefully</p>
        <p className="text-gray-600 mb-4">
          This quiz consists of {questions.length} questions. You will have a
          limited time to complete the quiz. Make sure to read each question
          carefully and select the best answer. You can navigate between
          questions using the "Previous" and "Next" buttons. Once you are ready,
          click "Submit" to finish the quiz.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => setCurrentScreen("quiz")}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructions;
