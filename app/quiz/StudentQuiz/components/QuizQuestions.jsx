const { useState, useEffect } = require("react");

const QuizQuestion = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredQuestions = answers.filter((answer) => answer !== null).length;
  const pendingQuestions = totalQuestions - answeredQuestions;

  const [timeLeft, setTimeLeft] = useState(30 * 60 * 1000);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const [minutes, seconds] = prev.split(":").map(Number);
        if (seconds > 0) return `${minutes}:${seconds - 1}`;
        if (minutes > 0) return `${minutes - 1}:59`;
        clearInterval(timer);
        alert("Time's up!");
        return "0:00";
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1]);
    }
  };

  const handleSubmit = () => {
    alert("Quiz submitted! Answers: " + JSON.stringify(answers));
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-20 bg-gray-50">
      <div className="w-full max-w-4xl px-4 flex">
        {/* Main Quiz Area */}
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <p className="text-lg font-medium">Total: {totalQuestions}</p>
            <p className="text-lg font-medium">Answered: {answeredQuestions}</p>
            <p className="text-lg font-medium">Pending: {pendingQuestions}</p>
            <p className="text-lg font-medium">Time Left: {timeLeft}</p>
          </div>
          <div className="border border-gray-300 rounded-md p-6 shadow-sm">
            <p className="text-lg font-medium mb-4">
              Question {currentQuestionIndex + 1}
            </p>
            <p className="text-lg font-medium mb-4">{currentQuestion?.text}</p>
            <div className="space-y-3">
              {currentQuestion?.options((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-2 border border-gray-200 rounded-md cursor-pointer hover:border-purple-600"
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionSelect(option)}
                    className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-600"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestionIndex === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                } transition-colors duration-300`}
              >
                Previous
              </button>
              <button
                onClick={
                  currentQuestionIndex === totalQuestions - 1
                    ? handleSubmit
                    : handleNext
                }
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
              >
                {currentQuestionIndex === totalQuestions - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>

        {/* Question Tracker */}
        <div className="w-1/4 pl-4">
          <h3 className="text-lg font-medium mb-4">Track Questions</h3>
          <div className="space-y-2">
            {questions.map((_, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={answers[index] !== null}
                  readOnly
                  className="hidden" // Hide the checkbox input
                />
                <span
                  className={`w-6 h-6 flex items-center justify-center border rounded-md ${
                    answers[index]
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-red-500 text-white border-red-500"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="ml-2 text-sm">QUE {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
