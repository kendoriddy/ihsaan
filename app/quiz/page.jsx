"use client"
import { useState, useEffect } from "react";


const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   
      fetchQuestions(currentPage);
  }, [currentPage]);

  const fetchQuestions = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://ihsaanlms.onrender.com/assessment/mcquestions/`
      );
      const data = await response.json();
      setQuestions(data.results || []);
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 questions per page
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    setQuestions((prevQuestions) => prevQuestions.filter(q => q.id !== deletedId));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {questions.map((q, index) => (
            <div key={q.id} className="mb-6 p-4 border rounded-lg">
              <h2 className="text-lg font-semibold">{index + 1}. {q.question_text}</h2>
              <div className="mt-2">
                {q.options.split(",").map((option, idx) => (
                  <label key={idx} className="block cursor-pointer">
                    <input type="checkbox" className="mr-2" name={`question_name`} />
                    {option.trim()}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
