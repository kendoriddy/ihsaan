"use client";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { usePost } from "@/hooks/useHttp/useHttp";
import Button from "@/components/Button";
import { addQuizSchema } from "@/components/validationSchemas/ValidationSchema";
import Editor from "@/components/Editor";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Alert,
  Chip,
  Button as MuiButton,
} from "@mui/material";
import { Eye, FileSpreadsheet, Upload, X, Info } from "lucide-react";

const AddingQuiz = () => {
  const [fetchAll, setFetchAll] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalCourseSections, setTotalCourseSections] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Excel upload states
  const [excelFile, setExcelFile] = useState(null);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);

  // Modal for showing course and section IDs
  const [showIdModal, setShowIdModal] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [sectionsByCourse, setSectionsByCourse] = useState({});
  const [loadingIds, setLoadingIds] = useState(false);

  // Fetch courses dynamically
  const {
    isLoading,
    data: CoursesList,
    isFetching,
    refetch,
  } = useFetch(
    "courses",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/?page_size=${
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

  const {
    isLoading: sectionLoading,
    data: CourseSectionList,
    isFetching: csFetching,
    refetch: csRefetch,
  } = useFetch(
    "courseSections",
    selectedCourseId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-sections/?course=${selectedCourseId}`
      : null,
    (data) => {
      if (data?.total && !fetchAll) {
        setTotalCourseSections(data.total);
        setFetchAll(true);
        refetch();
      }
    }
  );

  const Courses = CoursesList?.data?.results || [];
  const CourseSections = CourseSectionList?.data?.results || [];

  // Mutation to create quiz questions
  const { mutate: createQuestions, isLoading: isCreatingQuestions } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcquestions/bulk-create/`,
    {
      onSuccess: (response, variables, context) => {
        toast.success("Question(s) created successfully");
        // Do not call resetForm here
        // Clear Excel data after successful upload
        setExcelFile(null);
        setParsedQuestions([]);
        setUploadErrors([]);
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to create questions"
        );
      },
    }
  );

  // Excel file processing
  const processExcelFile = (file) => {
    setIsProcessingExcel(true);
    setUploadErrors([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // Remove empty rows
        const filteredData = jsonData.filter((row) =>
          row.some((cell) => cell && cell.toString().trim() !== "")
        );
        if (filteredData.length < 2) {
          setUploadErrors([
            "Excel file must contain at least one question row",
          ]);
          setIsProcessingExcel(false);
          return;
        }
        // Expect header row in the correct order
        const header = filteredData[0].map(
          (h) => h && h.toString().trim().toLowerCase()
        );
        const expectedHeader = [
          "course_id",
          "course_section_id",
          "question_text",
          "option_a",
          "option_b",
          "option_c",
          "option_d",
          "correct_answer",
        ];
        if (header.join(",") !== expectedHeader.join(",")) {
          setUploadErrors([
            `Excel header must be: ${expectedHeader.join(", ")}`,
          ]);
          setIsProcessingExcel(false);
          return;
        }
        // Parse questions
        const questions = [];
        const errors = [];
        for (let i = 1; i < filteredData.length; i++) {
          const row = filteredData[i];
          const [
            course_id,
            course_section_id,
            question_text,
            option_A,
            option_B,
            option_C,
            option_D,
            correct_answer,
          ] = row;
          const rowErrors = [];
          if (
            !course_id ||
            !question_text ||
            !option_A ||
            !option_B ||
            !correct_answer
          ) {
            rowErrors.push(
              "course_id, question_text, option_A, option_B, and correct_answer are required"
            );
          }
          if (
            !["A", "B", "C", "D"].includes((correct_answer || "").toUpperCase())
          ) {
            rowErrors.push("Correct answer must be A, B, C, or D");
          }
          if (rowErrors.length > 0) {
            errors.push(`Row ${i + 1}: ${rowErrors.join(", ")}`);
          } else {
            const options = { A: option_A };
            if (option_B) options.B = option_B;
            if (option_C) options.C = option_C;
            if (option_D) options.D = option_D;
            questions.push({
              course_id: course_id,
              course_section_id: course_section_id || "",
              question_text: question_text,
              options,
              correct_answer: (correct_answer || "").toUpperCase(),
            });
          }
        }
        if (errors.length > 0) setUploadErrors(errors);
        setParsedQuestions(questions);
        setIsProcessingExcel(false);
        if (questions.length > 0) {
          toast.success(
            `Successfully parsed ${questions.length} questions from Excel file`
          );
        }
      } catch (error) {
        setUploadErrors([
          "Failed to process Excel file. Please check the file format.",
        ]);
        setIsProcessingExcel(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension !== "xlsx" && fileExtension !== "xls") {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
        return;
      }

      setExcelFile(file);
      processExcelFile(file);
    }
  };

  // Excel file upload to backend
  const handleExcelSubmit = async () => {
    if (!excelFile) {
      toast.error("No Excel file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", excelFile);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/mcquestions/upload-mcq-questions/`,
        {
          method: "POST",
          headers: {
            // 'Content-Type': 'multipart/form-data', // Let browser set this
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload Excel file");
      }
      toast.success("Questions uploaded successfully from Excel file");
      setExcelFile(null);
      setParsedQuestions([]);
      setUploadErrors([]);
      setPreviewOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to upload Excel file");
    }
  };

  const clearExcelData = () => {
    setExcelFile(null);
    setParsedQuestions([]);
    setUploadErrors([]);
  };

  const downloadTemplate = () => {
    // Correct header order
    const templateData = [
      [
        "course_id",
        "course_section_id",
        "question_text",
        "option_A",
        "option_B",
        "option_C",
        "option_D",
        "correct_answer",
      ],
      [
        "1",
        "10",
        "What is the first letter of the Arabic alphabet?",
        "Alif",
        "Baa",
        "Taa",
        "Thaa",
        "A",
      ],
      [
        "1",
        "10",
        "Which of the following is a vowel in Arabic?",
        "Alif",
        "Baa",
        "Taa",
        "Thaa",
        "A",
      ],
      [
        "1",
        "10",
        "How many letters are in the Arabic alphabet?",
        "26",
        "28",
        "30",
        "32",
        "B",
      ],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    ws["!cols"] = [
      { width: 10 }, // course_id
      { width: 18 }, // course_section_id
      { width: 40 }, // question_text
      { width: 20 }, // option_A
      { width: 20 }, // option_B
      { width: 20 }, // option_C
      { width: 20 }, // option_D
      { width: 15 }, // correct_answer
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Quiz Questions Template");
    XLSX.writeFile(wb, "quiz_questions_template.xlsx");
  };

  const initialValues = {
    course_id: "",
    questions: [
      {
        question_text: "",
        options: { A: "", B: "", C: "", D: "" },
        correct_answer: "",
        course_section_id: "",
      },
    ],
    course_section_id: "",
  };

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    createQuestions(values, {
      onSuccess: () => {
        resetForm();
        setSubmitting(false);
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  const handleCourseChange = (e, setFieldValue) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    setFieldValue("course_id", courseId);
    setFieldValue("course_section_id", ""); // Reset course section when course changes
  };

  const handleCourseSectionChange = (e, setFieldValue) => {
    setFieldValue("course_section_id", e.target.value);
  };

  const handleQuestionChange = (setFieldValue, values) => {
    const newQuestion = {
      question_text: "",
      options: { A: "", B: "", C: "", D: "" },
      correct_answer: "",
      course_section_id: "",
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

  // Fetch all courses and their sections for the modal
  const fetchAllCoursesAndSections = async () => {
    setLoadingIds(true);
    try {
      const token = localStorage.getItem("token") || "";
      // Fetch all courses with auth
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/?page_size=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const courses = data?.results || [];
      setAllCourses(courses);
      // Fetch sections for each course in parallel with auth
      const sectionsMap = {};
      const sectionFetches = courses.map(async (course) => {
        try {
          const secRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-sections/?course=${course.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const secData = await secRes.json();
          sectionsMap[course.id] = secData?.results || [];
        } catch (e) {
          sectionsMap[course.id] = [];
          toast.error(`Failed to fetch sections for course ID ${course.id}`);
        }
      });
      await Promise.all(sectionFetches);
      setSectionsByCourse(sectionsMap);
    } catch (e) {
      toast.error("Failed to fetch courses or sections");
    }
    setLoadingIds(false);
  };

  const handleShowIdModal = async () => {
    setShowIdModal(true);
    if (allCourses.length === 0) {
      await fetchAllCoursesAndSections();
    }
  };
  const handleCloseIdModal = () => setShowIdModal(false);

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Set Quiz Question(s)
      </h2>

      {/* Excel Upload Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
        <div className="text-center">
          <FileSpreadsheet className="mx-auto text-blue-500 text-4xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Upload Questions via Excel
          </h3>
          <MuiButton
            onClick={handleShowIdModal}
            startIcon={<Info />}
            variant="outlined"
            color="info"
            className="mb-2"
          >
            Show Course & Section IDs
          </MuiButton>
          <p className="text-sm text-gray-600 mb-4">
            Upload an Excel file with questions. <br />
            <b>Expected header order:</b> course_id, course_section_id,
            question_text, option_A, option_B, option_C, option_D,
            correct_answer
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <MuiButton
              onClick={downloadTemplate}
              variant="outlined"
              startIcon={<FileSpreadsheet />}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Download Template
            </MuiButton>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
            />
            <label htmlFor="excel-upload">
              <MuiButton
                component="span"
                startIcon={<Upload />}
                disabled={isProcessingExcel}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessingExcel ? "Processing..." : "Choose Excel File"}
              </MuiButton>
            </label>

            {excelFile && (
              <>
                <Chip
                  label={excelFile.name}
                  onDelete={clearExcelData}
                  color="primary"
                  variant="outlined"
                />
                <MuiButton
                  startIcon={<Eye />}
                  onClick={() => setPreviewOpen(true)}
                  disabled={parsedQuestions.length === 0}
                  variant="outlined"
                >
                  Preview ({parsedQuestions.length} questions)
                </MuiButton>
                <MuiButton
                  onClick={handleExcelSubmit}
                  disabled={parsedQuestions.length === 0 || isCreatingQuestions}
                  color="secondary"
                >
                  {isCreatingQuestions ? "Uploading..." : "Upload Questions"}
                </MuiButton>
              </>
            )}
          </div>

          {/* Error Display */}
          {uploadErrors.length > 0 && (
            <Alert severity="error" className="mt-4">
              <div>
                <strong>Upload Errors:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {uploadErrors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </Alert>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Manual Form */}
      <h3 className="text-xl font-semibold mb-4 text-center">
        Add Questions Manually
      </h3>

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
            <div>
              <label
                htmlFor="course_section_id"
                className="block md:text-lg font-medium mb-2"
              >
                Select Course section
              </label>
              {sectionLoading ? (
                "Loading sections..."
              ) : (
                <Field
                  as="select"
                  id="course_section_id"
                  name="course_section_id"
                  onChange={(e) => handleCourseSectionChange(e, setFieldValue)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  disabled={sectionLoading || csFetching || !selectedCourseId}
                >
                  <option value="">Select a course section</option>
                  {CourseSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </Field>
              )}
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
                    <Editor
                      type="text"
                      id={`questions[${index}].question_text`}
                      name={`questions[${index}].question_text`}
                      className="w-full h-40 mb-24 md:mb-12 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
                          <Editor
                            type="text"
                            id={`questions[${index}].options.${key}`}
                            name={`questions[${index}].options.${key}`}
                            className="w-full -mb-4 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
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

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <div className="flex justify-between items-center">
            <Typography variant="h6">Preview Questions from Excel</Typography>
            <MuiButton onClick={() => setPreviewOpen(false)} startIcon={<X />}>
              Close
            </MuiButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Options</TableCell>
                  <TableCell>Correct Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedQuestions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell>{question.question_text}</TableCell>
                    <TableCell>
                      {Object.entries(question.options).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={question.correct_answer}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setPreviewOpen(false)}>Close</MuiButton>
          <MuiButton
            onClick={handleExcelSubmit}
            color="primary"
            disabled={isCreatingQuestions}
          >
            {isCreatingQuestions ? "Uploading..." : "Upload Questions"}
          </MuiButton>
        </DialogActions>
      </Dialog>

      {/* Modal for showing course and section IDs */}
      <Dialog
        open={showIdModal}
        onClose={handleCloseIdModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Course & Section IDs</DialogTitle>
        <DialogContent>
          {loadingIds ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course ID</TableCell>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Section ID</TableCell>
                    <TableCell>Section Title</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allCourses.map((course) =>
                    sectionsByCourse[course.id]?.length > 0 ? (
                      sectionsByCourse[course.id].map((section, idx) => (
                        <TableRow key={course.id + "-" + section.id}>
                          {idx === 0 && (
                            <TableCell
                              rowSpan={sectionsByCourse[course.id].length}
                            >
                              {course.id}
                            </TableCell>
                          )}
                          {idx === 0 && (
                            <TableCell
                              rowSpan={sectionsByCourse[course.id].length}
                            >
                              {course.name}
                            </TableCell>
                          )}
                          <TableCell>{section.id}</TableCell>
                          <TableCell>{section.title}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key={course.id + "-no-section"}>
                        <TableCell>{course.id}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell colSpan={2} style={{ color: "#888" }}>
                          No sections
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseIdModal}>Close</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddingQuiz;
