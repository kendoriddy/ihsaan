import { useFetch } from "@/hooks/useHttp/useHttp";
import React from "react";

const QuizSummary = ({ summaryId }) => {
  console.log("summary id passed", summaryId);
  const {
    isLoading: isLoadingQuizData,
    data: QuizSummary,
    refetch: refetchQuizData,
    isFetching: isFetchingQuizData,
    error,
  } = useFetch(
    `summary`,
    summaryId
      ? `https://ihsaanlms.onrender.com/assessment/mcq-responses/${summaryId}/`
      : null,
    (data) => {},
    (error) => {}
  );

  console.log("quiz summary", QuizSummary);
  return <div>QuizSummary</div>;
};

export default QuizSummary;
