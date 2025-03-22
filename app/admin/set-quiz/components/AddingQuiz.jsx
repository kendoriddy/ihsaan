"use client";
import { useFetch } from "@/hooks/useHttp/useHttp";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import { addQuizSchema } from "@/components/validationSchemas/ValidationSchema";

const AddingQuiz = () => {
  const [fetchAll, setFetchAll] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);

  // Fetch courses dynamically
  const {
    isLoading,
    data: CoursesList,
    isFetching,
    refetch,
  } = useFetch(
    "courses",
    `https://ihsaanlms.onrender.com/course/courses/?page_size=${
      fetchAll ? totalCourses : 10
    }`,
    (data) => {
      if (data?.total && !fetchAll) {
        setTotalCourses(data.total);
        setFetchAll(true);
        refetch();
      }
    }
  );

  const Courses = CoursesList?.data?.results || [];

  // Mutation to create quiz questions
  const { mutate: createQuestions, isLoading: isCreatingQuestions } = usePost(
    "https://ihsaanlms.onrender.com/assessment/mcquestions/bulk-create/",
    {
      onSuccess: (response) => {
        toast.success("Question(s) created successfully");
        resetForm();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to create questions"
        );
      },
    }
  );

  // Initial form values
  const initialValues = {
    course_id: "",
    questions: [
      {
        question_text: "",
        options: { A: "", B: "", C: "", D: "" },
        correct_answer: "",
      },
    ],
  };

  // Formik form submission handler
  const handleSubmit = (values, { resetForm }) => {
    createQuestions(values);
    resetForm();
  };

  // Handle course selection
  const handleCourseChange = (e, setFieldValue) => {
    setFieldValue("course_id", e.target.value);
  };

  // Handle adding a new question
  const handleQuestionChange = (setFieldValue, values) => {
    const newQuestion = {
      question_text: "",
      options: { A: "", B: "", C: "", D: "" },
      correct_answer: "",
    };
    setFieldValue("questions", [...values.questions, newQuestion]);
  };

  const handleAddOption = (setFieldValue, values, questionIndex) => {
    const currentOptions = values.questions[questionIndex].options;
    const nextLetter = String.fromCharCode(
      65 + Object.keys(currentOptions).length
    );
    setFieldValue(`questions[${questionIndex}].options.${nextLetter}`, "");
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Set Quiz Question(s)
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={addQuizSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, setFieldValue, isValid }) => (
          <Form className="bg-white p-6 rounded-md shadow-md space-y-6">
            <div>
              <label
                htmlFor="course_id"
                className="block md:text-lg font-medium mb-2"
              >
                Select Course
              </label>
              <Field
                as="select"
                id="course_id"
                name="course_id"
                onChange={(e) => handleCourseChange(e, setFieldValue)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={isLoading || isFetching}
              >
                <option value="">Select a course</option>
                {Courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="course_id"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Questions */}
            {values.questions.map((question, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">
                  Question {index + 1}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={`questions[${index}].question_text`}
                      className="block md:text-lg font-medium"
                    >
                      Question Text
                    </label>
                    <Field
                      type="text"
                      id={`questions[${index}].question_text`}
                      name={`questions[${index}].question_text`}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <ErrorMessage
                      name={`questions[${index}].question_text`}
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="block md:text-lg font-medium">
                      Options
                    </label>
                    {Object.keys(question.options).map((key) => (
                      <div key={key} className="mb-2">
                        <label
                          htmlFor={`questions[${index}].options.${key}`}
                          className="flex items-center"
                        >
                          <span className="mr-2">{key}</span>
                          <Field
                            type="text"
                            id={`questions[${index}].options.${key}`}
                            name={`questions[${index}].options.${key}`}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                          />
                        </label>
                        <ErrorMessage
                          name={`questions[${index}].options.${key}`}
                          component="p"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={() =>
                        handleAddOption(setFieldValue, values, index)
                      }
                      className="mt-2"
                    >
                      Add Option
                    </Button>
                  </div>
                  <div>
                    <label
                      htmlFor={`questions[${index}].correct_answer`}
                      className="block md:text-lg font-medium"
                    >
                      Correct Answer
                    </label>
                    <Field
                      as="select"
                      id={`questions[${index}].correct_answer`}
                      name={`questions[${index}].correct_answer`}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="">Select correct answer</option>
                      {Object.keys(question.options).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name={`questions[${index}].correct_answer`}
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
                {/* Remove button */}
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => {
                      const newQuestions = values.questions.filter(
                        (_, i) => i !== index
                      );
                      setFieldValue("questions", newQuestions);
                    }}
                    className="mt-4"
                  >
                    Remove Question
                  </Button>
                )}
              </div>
            ))}

            {/* Add New Question and Submit Button */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Button
                type="button"
                color="secondary"
                onClick={() => handleQuestionChange(setFieldValue, values)}
                className="w-full px-4 py-2 rounded-md"
              >
                Add New Question
              </Button>

              <Button
                type="submit"
                color="secondary"
                disabled={
                  isCreatingQuestions || !isValid || isLoading || isFetching
                }
                className={`w-full px-6 py-2 rounded-md font-medium text-white ${
                  isCreatingQuestions || !isValid || isLoading || isFetching
                    ? "bg-gray-400 cursor-not-allowed"
                    : ""
                } transition-colors duration-300`}
              >
                {isCreatingQuestions ? "Creating..." : "Create Questions"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddingQuiz;
