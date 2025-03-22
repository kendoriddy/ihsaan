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

export const newsLetterSchema = object({
  email: string().email("Enter  Valid Email").required("Required"),
});

export const faqSchema = object({
  title: string().required("Required"),
  content: string().required("Required"),
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
    .oneOf(["INDIVIDUAL", "GROUP"])
    .required("Type is required"),
  question_type: Yup.string()
    .oneOf(["FILE_UPLOAD", ""])
    .required("Question type is required"),
  max_score: Yup.number()
    .min(0, "Max score must be positive")
    .required("Max score is required"),
  passing_score: Yup.number()
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score cannot exceed 100")
    .required("Passing score is required"),
  course: Yup.number().required("Course is required"),
  term: Yup.number().required("Term is required"),
  max_attempts: Yup.number()
    .min(1, "Must allow at least 1 attempt")
    .required("Max attempts is required"),
});
