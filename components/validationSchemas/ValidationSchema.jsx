import { DescriptionSharp } from "@mui/icons-material";
import { strict } from "assert";
import { string, object, array, number, mixed, bool, ref } from "yup";
import * as Yup from "yup";

export const LoginSchema = object({
  email: string().email("Enter  Valid Email").required("Required"),
  password: string().required("Required"),
});
export const accountSchema = object({
  email: string().email("Enter  Valid Email").required("Required"),
  role: string().required("Required"),
});

export const catSchema = object({
  name: string().required("Required"),
});

export const newsLetterSchema = Yup.object().shape({
  email: Yup.string().email("Enter  Valid Email").required("Email is Required"),
  firstname: Yup.string(),
  lastname: Yup.string(),
  category: Yup.string(),
  country: Yup.string(),
});

export const faqSchema = object({
  question: string().required("Required"),
  answer: string().required("Required"),
});

export const quoteSchema = object({
  quote_author: string().required("Required"),
  content: string().required("Required"),
});

export const addBlog = object({
  title: string().required("Required"),
  category: string().required("Required"),
  author: string().required("Required"),
  content: string().required("Required"),
  blogimageurl: string().url("Must be a link"),
});

export const blogCommentSchema = object({
  name: string().required("Required"),
  email: string().email("Enter  Valid Email").required("Required"),
  comment: string().required("Required"),
});

export const registerSchema = object({
  first_name: string().required("Required"),
  last_name: string().required("Required"),
  email: string().email("Enter  Valid Email").required("Required"),
  password: string()
    .required("Required")
    .min(8, "Password too short")
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&$])/, "Must contain at least one special character"),
  confirm_password: string()
    .oneOf([ref("password"), null], "Passwords must match")
    .required("Password is required"),
});

export const ForgotPasswordSchema = object({
  email: string().email("Enter  Valid Email").required("Required"),
});

export const ResetPasswordSchema = object({
  password: string()
    .required("Required")
    .min(8, "Password too short")
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&$])/, "Must contain at least one special character"),
  confirm_password: string()
    .oneOf([ref("password"), null], "Passwords must match")
    .required("Password is required"),
});

export const ChangePasswordSchema = object({
  old_password: string().required("Required"),
  new_password: string()
    .required("Required")
    .min(8, "Password too short")
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&$])/, "Must contain at least one special character"),
  confirm_password: string()
    .oneOf([ref("password"), null], "Passwords must match")
    .required("Password is required"),
});

export const addQuizSchema = Yup.object().shape({
  course_id: Yup.string().required("Course is required"),
  questions: Yup.array().of(
    Yup.object().shape({
      question_text: Yup.string().required("Question text is required"),
      options: Yup.object().test(
        "at-least-two-options",
        "At least two options are required",
        (options) => Object.values(options).filter(Boolean).length >= 2
      ),
      correct_answer: Yup.string()
        .test(
          "match-options",
          "Correct answer must be one of the available options",
          function (value) {
            const options = this.parent.options;
            return value && options[value] !== undefined;
          }
        )
        .required("Correct answer is required"),
    })
  ),
});

export const addAssignmentSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  type: Yup.string()
    .oneOf(["INDIVIDUAL", "GROUP", "TEST", "EXAMINATION"])
    .required("Type is required"),
  question_type: Yup.string()
    .oneOf(["FILE_UPLOAD", "MANUAL", "MCQ"])
    .required("Question type is required"),
  max_score: Yup.number()
    .min(0, "Max score must be positive")
    .required("Max score is required"),
  passing_score: Yup.number()
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score cannot exceed 100")
    .required("Passing score is required"),
  course: Yup.number().required("Course is required"),
  term: Yup.string().required("Term is required"),
  max_attempts: Yup.number()
    .min(1, "Must allow at least 1 attempt")
    .required("Max attempts is required"),
  mcq_question_count: Yup.number().when("question_type", {
    is: "MCQ",
    then: (schema) =>
      schema
        .min(3, "You must allow at least three questions")
        .required("Number of questions is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  mcq_duration: Yup.string().when("question_type", {
    is: "MCQ",
    then: (schema) => schema.required("Quiz duration is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const manualGradingSchema = Yup.object({
  assessment: Yup.string().required("Level is required"),
  student: Yup.string(),
  group: Yup.string(),
  score: Yup.string(),
  is_published: Yup.boolean().required("Publishing status required"),
  feedback: Yup.string().required("Reason is require"),
}).test(
  "student-or-group",
  "Either student or group is required",
  function (value) {
    return !!value.student || !!value.group;
  }
);

export const academicYearSchema = Yup.object({
  year: Yup.string().required("Year is required"),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date().required("End date is required"),
});

export const termSchema = Yup.object({
  session_id: Yup.number().required("Academic session is required"),
  name: Yup.string().required("Name is required"),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date().required("End date is required"),
});

export const manualGradeReasonSchema = Yup.object().shape({
  name: Yup.string().required("Reason name is required"),
  description: Yup.string().required("Reason description is required"),
});

export const categorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  frequency: Yup.string()
    .oneOf(["DAILY", "WEEKLY", "MONTHLY"], "Invalid frequency")
    .required("Frequency is required"),
});

export const bulkUploadSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  csv_file: Yup.mixed()
    .required("CSV file is required")
    .test("fileType", "Only CSV files are allowed", (value) => {
      if (!value) return false;
      return value.type === "text/csv" || value.name.endsWith(".csv");
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB
    }),
});