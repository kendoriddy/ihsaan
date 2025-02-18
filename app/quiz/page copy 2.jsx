"use client";
import { useState, useEffect } from "react";
import http from "../../hooks/axios/axios";
import Link from "next/link";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const Quiz = "/assessment/mcquestions/";

  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);

  const fetchQuestions = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await http.get(`${Quiz}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);

      const { results = [], total_pages = 1, current_page = 1 } = response.data;

      setQuestions(results);
      setTotalPages(total_pages);
      setCurrentPage(current_page); // Ensure state matches API response
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl text-center mb-5 font-bold">Quiz List</h1>
      {loading ? (
        <p className="loading"></p>
      ) : (
        <div >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4  ">
          {questions.map((q, index) => {
            const optionsArray =
              q.options && typeof q.options === "object"
                ? Object.values(q.options)
                : [];

            return (
              <div
                key={q.id}
                className="border border-2  border-gray-100 p-8 sm:w-80 hover:scale-105 mb-5 w-  rounded-lg shadow-xl"
              >
                <h2 className="text-lg font-semibold w-60">
                  {index + 1}. {q.question_text}
                </h2>
                <div className="mt-2 ">
                  {optionsArray.map((option, idx) => (
                    <label key={idx} className="block my-2 cursor-pointer">
                      <input type="checkbox" className="mr-2" name={`question_${q.id}`} />
                      {option}
                    </label>
                  ))}
                </div>
                <Link href={`/quiz/${q.id}`} className="mx-auto text-center">
                  <button className="mx-auto w-40 flex items-center justify-center mt-5 sec text-center bg-blue-600 p-2 rounded text-white hover:bg-green-600">
                    Take Quiz
                  </button>
                </Link>
              </div>
            );
          })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between my-10">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-2 py-2 bg-gray-300 rounded-full disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
          </svg>

            </button>

            <span className="text-xl font-bold">
               {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-2 py-2 bg-gray-300 rounded-full disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
            </svg>

            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
