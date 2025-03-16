"use client";
import CustomModal from "@/components/CustomModal";
import React, { useState, useEffect } from "react";
import { usePatch } from "@/hooks/useHttp/useHttp";
import { TextField } from "@mui/material";

const EditQuizQuestion = ({
  setOpenUpdateModal,
  openUpdateModal,
  selectedQuestion,
  refetchQuestions,
}) => {
  const [editedQuestion, setEditedQuestion] = useState({
    question_text: selectedQuestion?.question_text || "",
    options: selectedQuestion?.options || {},
    correct_answer: selectedQuestion?.correct_answer || "",
  });

  // Update function with body
  const { mutate: updateQuestion, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/assessment/mcquestions/${selectedQuestion?.id}/`,
    {
      onSuccess: () => {
        toast.success("Updated successfully");
        setOpenUpdateModal(false);
        refetchQuestions();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
      },
    }
  );

  useEffect(() => {
    if (selectedQuestion) {
      setEditedQuestion({
        question_text: selectedQuestion.question_text || "",
        options: selectedQuestion.options || {},
        correct_answer: selectedQuestion.correct_answer || "",
      });
    }
  }, [selectedQuestion]);

  // Function to handle form submission
  const handleUpdateSubmit = () => {
    updateQuestion({
      question_text: editedQuestion.question_text,
      options: editedQuestion.options,
      correct_answer: editedQuestion.correct_answer,
    });
    setOpenUpdateModal(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setEditedQuestion((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOptionChange = (key, value) => {
    setEditedQuestion((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }));
  };

  return (
    <div>
      <CustomModal
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        title="Update Question"
        onConfirm={handleUpdateSubmit}
        confirmText={isUpdating ? "Updating..." : "Update"}
        isLoading={isUpdating}
      >
        <TextField
          fullWidth
          label="Question"
          name="question_text"
          margin="dense"
          value={editedQuestion.question_text}
          onChange={handleInputChange}
        />
        {Object.entries(editedQuestion.options).map(([key, value]) => (
          <TextField
            key={key}
            fullWidth
            label={`Option ${key}`}
            margin="dense"
            value={value}
            onChange={(e) => handleOptionChange(key, e.target.value)}
          />
        ))}
        <TextField
          fullWidth
          label="Correct Answer"
          name="correct_answer"
          margin="dense"
          value={editedQuestion.correct_answer}
          onChange={handleInputChange}
        />
      </CustomModal>
    </div>
  );
};

export default EditQuizQuestion;
