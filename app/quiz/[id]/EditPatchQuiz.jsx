"use client";

import { useState, useEffect } from "react";
import http from "../../../hooks/axios/axios";

export default function EditQuestionPatch ({ handleViewPatch, questionId }) {
  const [question, setQuestion] = useState({
    question_text: "",
    options: ["", "", "", ""], // Ensure options exist
    correct_answer: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetails(questionId);
    }
  }, [questionId]);

  const fetchQuestionDetails = async (id) => {
    try {
      const response = await http.get(`/assessment/mcquestions/${id}/`);
      const data = await response.data;

      // Ensure options is an array
      const optionsArray = data.options  ? Object.values(data.options) 
      : ["", "", "", ""];

      setQuestion({
        question_text: data.question_text || "",
        options: optionsArray,
        correct_answer: data.correct_answer || "",
      });
  
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

    const optionsObject = {
        A: question.options[0],
        B: question.options[1],
        C: question.options[2],
        D: question.options[3],
      };

    try {
      const response = await http.patch(`/assessment/mcquestions/${questionId}/`, {
        question_text: question.question_text,
        options: optionsObject, // Convert array to JSON string
        correct_answer: question.correct_answer,
      }, {
        headers: { "Content-Type": "application/json" },
       
      });

      if (!response.ok) throw new Error("Failed to update question");

      setMessage("Question updated successfully!");
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <p className="loading"></p>;;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      
      <div className="flex justify-between items-center my-4">
      <h2 className="text-xl font-bold ">Edit Question</h2>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-black cursor-pointer "  onClick={handleViewPatch}>
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
    </div>
      
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

        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? <p className="loading"></p> : "Patch Question"}
        </button>
      </form>
    </div>
  );
};


