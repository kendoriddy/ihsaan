"use client";
import { useState } from "react";
import http from "../../../hooks/axios/axios";

const DeleteQuestion = ({ questionId, handleViewDelete }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([])

  const onDeleteSuccess = (prevquestionId) =>{
      setQuestions(prevQuiz.filter(prev => prev.id !== prevquestionId))
  }
  const handleDelete = async () => {
    setLoading(true);
    setMessage("");

  

    try {
      const response = await http.delete(`/assessment/mcquestions/${questionId}/`);

      if (!response.ok) throw new Error("Failed to delete question");

      setMessage("Question deleted successfully!");
      onDeleteSuccess(questionId); // Remove question from UI after deletion
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <div>
      <h2 className="text-xl font-bold text-center ">Did you want to Delete this Question? </h2>
    </div>
      {message && <p className="text-red-600 text-center">{message}</p>}
      <div className="flex justify-between items-center my-8">
      <button
        onClick={handleViewDelete}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
        disabled={loading}
      >
        Cancel
      </button>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? <p className="loading"></p> : "Delete Question"}
      </button>
      </div>

    </div>
  );
};

export default DeleteQuestion;
