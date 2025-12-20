"use client";
import CustomModal from "@/components/CustomModal";
import React, { useMemo } from "react";
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
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcquestions/${selectedQuestion?.id}/`,
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
                  placeholder="Correct answer (A,B,C,D etc)"
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
