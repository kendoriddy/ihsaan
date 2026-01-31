"use client";
import CustomModal from "@/components/CustomModal";
import React, { useMemo } from "react";
import { usePatch } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import { TextField } from "@mui/material";
import Editor from "@/components/Editor";
import Button from "@/components/Button";
import * as Yup from "yup";

// Safe Base URL to prevent "apiundefined" errors locally
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.ihsaanacademia.com/api";

const EditQuizQuestion = ({
  setOpenUpdateModal,
  openUpdateModal,
  selectedQuestion,
  refetchQuestions,
}) => {
  const { mutate: updateQuestion, isLoading: isUpdating } = usePatch(
    `${API_BASE}/assessment/mcquestions/${selectedQuestion?.id}/`,
    {
      onSuccess: () => {
        toast.success("Quiz question updated successfully");
        setOpenUpdateModal(false);
        refetchQuestions();
      },
      onError: (error) => {
        console.error("Patch Error Details:", error.response?.data);
        toast.error(error.response?.data?.message || "Update failed");
      },
    }
  );

  const initialValues = useMemo(
    () => ({
      id: selectedQuestion?.id || "",
      question_text: selectedQuestion?.question_text || "",
      options: selectedQuestion?.options || {},
      correct_answer: selectedQuestion?.correct_answer || "",
      course: selectedQuestion?.course || null,
      course_section: selectedQuestion?.course_section || null,
      is_active: selectedQuestion?.is_active ?? true,
    }),
    [selectedQuestion]
  );

  const validationSchema = Yup.object().shape({
    correct_answer: Yup.string()
      .required("Correct answer is required")
      .trim()
      .min(1, "Correct answer cannot be empty"),
  });

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      id: selectedQuestion?.id,
      correct_answer: values.correct_answer.toUpperCase().trim(),
    };

    // Clean up numeric fields to avoid sending empty strings
    if (payload.course === "") payload.course = null;
    if (payload.course_section === "") payload.course_section = null;
    
    // Remove read-only or extra detail objects
    delete payload.course_section_detail;

    updateQuestion(payload);
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
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
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
                    <span>Option</span>
                    <span className="mr-2 font-semibold ml-1">{key}.</span>
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
                  placeholder="Correct answer (A, B, C, or D)"
                  error={touched.correct_answer && !!errors.correct_answer}
                  helperText={
                    touched.correct_answer && errors.correct_answer
                      ? errors.correct_answer
                      : ""
                  }
                  // Using setFieldValue ensures the input remains responsive
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setFieldValue("correct_answer", val);
                  }}
                  onBlur={() => setFieldTouched("correct_answer", true)}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  className="rounded-md"
                  disabled={isUpdating || !values.correct_answer?.trim()}
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