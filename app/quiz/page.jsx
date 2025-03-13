"use client";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import StudentQuiz from "./StudentQuiz";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchQuestions(currentPage);
  // }, [currentPage]);

  // const fetchQuestions = async (page) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `https://ihsaanlms.onrender.com/assessment/mcquestions/`
  //     );
  //     const data = await response.json();
  //     setQuestions(data.results || []);
  //     setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 questions per page
  //   } catch (error) {
  //     console.error("Error fetching questions:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDeleteSuccess = (deletedId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== deletedId)
    );
  };
  const roles = localStorage.getItem("roles");
  const parsedRoles = JSON.parse(roles);
  return (
    <Layout>
      {parsedRoles?.includes("TUTOR") ? "" : <StudentQuiz />}
      <StudentQuiz />
    </Layout>
  );
};

export default QuizPage;
