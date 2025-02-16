"use client";

import { useState } from "react";

export default function CreateQuestion ()  {
  const [question, setQuestion] = useState({
    course: "",
    question_text: "",
    options: ["", "", "", ""], // Store options as an array
    correct_answer: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      const response = await fetch("https://ihsaanlms.onrender.com/assessment/mcquestions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...question,
          options: JSON.stringify(question.options), // Convert array to JSON string
        }),
      });

      if (!response.ok) throw new Error("Failed to create question");

      setMessage("Question created successfully!");
      setQuestion({ course: "", question_text: "", options: ["", "", "", ""], correct_answer: "" });
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Question</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="course"
          value={question.course}
          onChange={handleChange}
          placeholder="Course ID"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="question_text"
          value={question.question_text}
          onChange={handleChange}
          placeholder="Question Text"
          className="w-full p-2 border rounded"
          required
        />

        {question.options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="w-full p-2 border rounded"
            required
          />
        ))}

        <input
          type="text"
          name="correct_answer"
          value={question.correct_answer}
          onChange={handleChange}
          placeholder="Correct Answer"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Question"}
        </button>
      </form>
    </div>
  );
};

