"use client";

import { useState, useEffect } from "react";

const EditQuestion = ({ questionId }) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetails(questionId);
    }
  }, [questionId]);

  const fetchQuestionDetails = async (id) => {
    try {
      const response = await fetch(`https://ihsaanlms.onrender.com/assessment/mcquestions/${id}/`);
      const data = await response.json();

      // Ensure options is an array
      let parsedOptions = [];
      try {
        parsedOptions = JSON.parse(data.options);
        if (!Array.isArray(parsedOptions)) {
          parsedOptions = []; // Fallback if parsedOptions is not an array
        }
      } catch (error) {
        parsedOptions = []; // Handle invalid JSON
      }

      setQuestion({ ...data, options: parsedOptions });
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`https://ihsaanlms.onrender.com/assessment/mcquestions/${questionId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: question.question_text,
          options: JSON.stringify(question.options), // Convert array to JSON string
          correct_answer: question.correct_answer,
        }),
      });

      if (!response.ok) throw new Error("Failed to update question");

      setMessage("Question updated successfully!");
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <p>Loading question details...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Edit Question</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="question_text"
          value={question.question_text}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {question.options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        ))}

        <input
          type="text"
          name="correct_answer"
          value={question.correct_answer}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Question"}
        </button>
      </form>
    </div>
  );
};

export default EditQuestion;
