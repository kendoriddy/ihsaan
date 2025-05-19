// import { useFetch } from "@/hooks/useHttp/useHttp";
// import React from "react";

// const QuizSummary = ({ summaryId }) => {
//   const {
//     isLoading: isLoadingQuizData,
//     data: QuizSummary,
//     refetch: refetchQuizData,
//     isFetching: isFetchingQuizData,
//     error,
//   } = useFetch(
//     `summary`,
//     summaryId
//       ? `https://ihsaanlms.onrender.com/assessment/mcq-responses/${summaryId}/`
//       : null,
//     (data) => {},
//     (error) => {}
//   );

//   const QuizSummaryResult = QuizSummary?.data;

//   return (
//     <>
//       {isLoadingQuizData ? (
//         <p className="py-8 font-bold text-lg animate-pulse">
//           Loading quiz details...
//         </p>
//       ) : (
//         <div className="w-[15rem] md:w-[32rem] no-scrollbar">
//           <h1 className="text-center font-bold text-xl md:text-3xl">
//             {QuizSummaryResult?.assessment_title}
//           </h1>
//           <p className="flex justify-between">
//             <strong className="text-end">Number of Questions:</strong>
//             {QuizSummaryResult?.summary?.total_questions}
//           </p>
//           <p className="flex justify-between">
//             <strong className="text-end">Questions answered correctly:</strong>
//             {QuizSummaryResult?.summary?.correct_answers}
//           </p>
//           <p className="flex justify-between">
//             <strong className="text-end">Obtainable Score:</strong>
//             {QuizSummaryResult?.summary?.assessment_max_score}
//           </p>
//           <p className="flex justify-between">
//             <strong className="text-end">Your Score:</strong>
//             {QuizSummaryResult?.summary?.score}
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default QuizSummary;

import { useFetch } from "@/hooks/useHttp/useHttp";
import React from "react";
import clsx from "clsx"; // Optional: for cleaner class merging

const QuizSummary = ({ summaryId }) => {
  const { isLoading: isLoadingQuizData, data: QuizSummary } = useFetch(
    `summary`,
    summaryId
      ? `https://ihsaanlms.onrender.com/assessment/mcq-responses/${summaryId}/`
      : null,
    () => {},
    () => {}
  );

  const QuizSummaryResult = QuizSummary?.data;
  const responses = QuizSummaryResult?.responses || {};

  return (
    <>
      {isLoadingQuizData ? (
        <p className="py-8 font-bold text-lg animate-pulse">
          Loading quiz details...
        </p>
      ) : (
        <div className="w-[15rem] md:w-[32rem] no-scrollbar space-y-6">
          <div>
            <h1 className="text-center font-bold text-xl md:text-3xl">
              {QuizSummaryResult?.assessment_title}
            </h1>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <strong>Number of Questions:</strong>
                <span>{QuizSummaryResult?.summary?.total_questions}</span>
              </div>
              <div className="flex justify-between">
                <strong>Correct Answers:</strong>
                <span>{QuizSummaryResult?.summary?.correct_answers}</span>
              </div>
              <div className="flex justify-between">
                <strong>Wrong Answers:</strong>
                <span>{QuizSummaryResult?.summary?.total_questions - QuizSummaryResult?.summary?.correct_answers}</span>
              </div>
              <div className="flex justify-between">
                <strong>Obtainable Score:</strong>
                <span>{QuizSummaryResult?.summary?.assessment_max_score}</span>
              </div>
              <div className="flex justify-between">
                <strong>Your Score:</strong>
                <span>{QuizSummaryResult?.summary?.score}</span>
              </div>
              <div className="flex justify-between">
                <strong>You submitted on:</strong>
                <span>{QuizSummaryResult?.summary?.score}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="font-semibold text-justify">
              <h3 className="text-base md:text-xl">
                See your question breakdown below
              </h3>
              <p className="text-sm md:text-base">
                Correct answers are displayed in green while incorrect answers
                are displayed in red and the correct answer highlighted in green
              </p>
            </div>
            {Object.entries(responses).map(([key, resp], index) => {
              const isCorrect = resp.is_correct;
              const correctAnswer = resp.correct_answer;
              const studentAnswer = resp.student_answer;

              return (
                <div
                  key={key}
                  className={clsx(
                    "p-4 rounded-md border",
                    isCorrect
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                  )}
                >
                  <h2
                    className={clsx(
                      "font-semibold mb-2",
                      isCorrect ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {index + 1}. {resp.question_text}
                  </h2>
                  <ul className="space-y-1">
                    {Object.entries(resp.options).map(
                      ([optionKey, optionValue]) => {
                        const isStudentAnswer = studentAnswer === optionKey;
                        const isCorrectOption = correctAnswer === optionKey;

                        const optionClass = clsx(
                          "p-2 rounded-md",
                          isCorrectOption &&
                            !isStudentAnswer &&
                            !isCorrect &&
                            "bg-green-100 text-green-700",
                          isStudentAnswer &&
                            !isCorrect &&
                            "bg-red-100 text-red-700",
                          isStudentAnswer &&
                            isCorrect &&
                            "bg-green-100 text-green-700"
                        );

                        return (
                          <li key={optionKey} className={optionClass}>
                            <span className="font-bold">{optionKey}.</span>{" "}
                            {optionValue}
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default QuizSummary;
