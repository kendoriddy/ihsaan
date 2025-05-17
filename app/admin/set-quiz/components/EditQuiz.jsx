// "use client";
// import CustomModal from "@/components/CustomModal";
// import React, { useState, useEffect } from "react";
// import { usePatch } from "@/hooks/useHttp/useHttp";
// import { TextField } from "@mui/material";
// import { toast } from "react-toastify";

// const EditQuizQuestion = ({
//   setOpenUpdateModal,
//   openUpdateModal,
//   selectedQuestion,
//   refetchQuestions,
// }) => {
//   const [editedQuestion, setEditedQuestion] = useState({
//     question_text: selectedQuestion?.question_text || "",
//     options: selectedQuestion?.options || {},
//     correct_answer: selectedQuestion?.correct_answer || "",
//     section: selectedQuestion?.section || "",
//   });

//   // Update function with body
//   const { mutate: updateQuestion, isLoading: isUpdating } = usePatch(
//     `https://ihsaanlms.onrender.com/assessment/mcquestions/${selectedQuestion?.id}/`,
//     {
//       onSuccess: () => {
//         toast.success("Quiz question Updated successfully");
//         setOpenUpdateModal(false);
//         refetchQuestions();
//       },
//       onError: (error) => {
//         toast.error(error.response?.data?.message || "Update failed");
//       },
//     }
//   );

//   useEffect(() => {
//     if (selectedQuestion) {
//       setEditedQuestion({
//         question_text: selectedQuestion.question_text || "",
//         options: selectedQuestion.options || {},
//         correct_answer: selectedQuestion.correct_answer || "",
//         section: selectedQuestion.section || "",
//       });
//     }
//   }, [selectedQuestion]);

//   // Function to handle form submission
//   const handleUpdateSubmit = () => {
//     updateQuestion({
//       question_text: editedQuestion.question_text,
//       options: editedQuestion.options,
//       correct_answer: editedQuestion.correct_answer,
//       section: editedQuestion.section,
//     });
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     setEditedQuestion((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleOptionChange = (key, value) => {
//     setEditedQuestion((prev) => ({
//       ...prev,
//       options: { ...prev.options, [key]: value },
//     }));
//   };

//   return (
//     <div>
//       <CustomModal
//         open={openUpdateModal}
//         onClose={() => setOpenUpdateModal(false)}
//         title="Update Question"
//         onConfirm={handleUpdateSubmit}
//         confirmText={isUpdating ? "Updating..." : "Update"}
//         isLoading={isUpdating}
//       >
//         <TextField
//           fullWidth
//           label="Question"
//           name="question_text"
//           margin="dense"
//           value={editedQuestion.question_text}
//           onChange={handleInputChange}
//         />
//         {Object.entries(editedQuestion.options).map(([key, value]) => (
//           <TextField
//             key={key}
//             fullWidth
//             label={`Option ${key}`}
//             margin="dense"
//             value={value}
//             onChange={(e) => handleOptionChange(key, e.target.value)}
//           />
//         ))}
//         <TextField
//           fullWidth
//           label="question chapter or section"
//           name="section"
//           margin="dense"
//           value={editedQuestion.section}
//           onChange={handleInputChange}
//         />
//         <TextField
//           fullWidth
//           label="Correct Answer"
//           name="correct_answer"
//           margin="dense"
//           value={editedQuestion.correct_answer}
//           onChange={handleInputChange}
//         />
//       </CustomModal>
//     </div>
//   );
// };

// export default EditQuizQuestion;

"use client";
import CustomModal from "@/components/CustomModal";
import React, { useEffect, useMemo } from "react";
import { usePatch } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import { TextField } from "@mui/material";
import Editor from "@/components/Editor";
import Button from "@/components/Button";

const EditQuizQuestion = ({
  setOpenUpdateModal,
  openUpdateModal,
  selectedQuestion,
  refetchQuestions,
}) => {
  const { mutate: updateQuestion, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/assessment/mcquestions/${selectedQuestion?.id}/`,
    {
      onSuccess: () => {
        toast.success("Quiz question updated successfully");
        setOpenUpdateModal(false);
        refetchQuestions();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Update failed");
      },
    }
  );

  const initialValues = useMemo(
    () => ({
      question_text: selectedQuestion?.question_text || "",
      options: selectedQuestion?.options || {},
      correct_answer: selectedQuestion?.correct_answer || "",
      section: selectedQuestion?.section || "",
    }),
    [selectedQuestion]
  );

  const handleSubmit = (values) => {
    updateQuestion(values);
  };

  return (
    <CustomModal
      open={openUpdateModal}
      onClose={() => setOpenUpdateModal(false)}
      title="Update Question"
      isLoading={isUpdating}
      showCancel={false}
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Question</label>
                {/* <Field
                  name="question_text"
                  as={TextField}
                  fullWidth
                  size="small"
                  placeholder="Enter question"
                /> */}
                <Editor name="question_text" className="w-full" />
              </div>

              {Object.entries(values.options).map(([key]) => (
                <div key={key} className="mb-4">
                  <label
                    htmlFor={`options.${key}`}
                    className="flex items-center mb-1"
                  >
                    {" "}
                    <span>Option</span>
                    <span className="mr-2 font-semibold">{key}.</span>
                  </label>
                  <Editor name={`options.${key}`} className="w-full" />
                </div>
              ))}

              <div>
                <label className="block font-medium mb-1">Correct Answer</label>
                <Field
                  name="correct_answer"
                  as={TextField}
                  fullWidth
                  size="small"
                  placeholder="Correct answer"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Section</label>
                <Field
                  name="section"
                  as={TextField}
                  fullWidth
                  size="small"
                  placeholder="e.g. Chapter 1"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="rounded-md"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Question"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default EditQuizQuestion;
