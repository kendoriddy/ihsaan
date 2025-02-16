"use client";

import { Api } from "@/app/api/axios";
import { useState } from "react";

const DeleteQuestion = ({ questionId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${Api}/mcquestions/${questionId}/`, {
        method: "DELETE",
      });

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
    <div className="mt-4">
      {message && <p className="text-red-600">{message}</p>}
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Question"}
      </button>
    </div>
  );
};

export default DeleteQuestion;
