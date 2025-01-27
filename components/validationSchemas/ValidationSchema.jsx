import { string, object, array, number, mixed, bool, ref } from "yup";

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
