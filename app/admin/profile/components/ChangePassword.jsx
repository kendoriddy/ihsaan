"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import { usePost } from "@/hooks/useHttp/useHttp";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const passwordSchema = Yup.object({
  current_password: Yup.string().required("Old password is required"),
  new_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords do not match")
    .required("Confirm your password"),
});

const ChangePassword = () => {
  const router = useRouter();
  const { mutate: changePassword, isLoading } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-profile/change_password/`,
    {
      onSuccess: () => {
        Swal.fire({
          title: "Password updated successfully",
          icon: "success",
          customClass: { confirmButton: "my-confirm-btn" },
        });
        router.push("/login");
      },
      onError: (error) => {
        Swal.fire({
          title: error.response?.data?.message || "Failed to update password",
          icon: "error",
          customClass: { confirmButton: "my-confirm-btn" },
        });
      },
    }
  );

  const initialValues = {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };

  const handleSubmit = (values, { resetForm }) => {
    changePassword(values, {
      onSuccess: () => resetForm(),
    });
  };

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={passwordSchema}
      onSubmit={handleSubmit}
      validateOnBlur
      validateOnChange
    >
      {({ errors, touched, isValid }) => (
        <Form className="pt-4 space-y-3">
          {/* Current Password */}
          <div className="flex items-center gap-2 relative">
            <Field
              type={showCurrent ? "text" : "password"}
              name="current_password"
              placeholder="Current Password"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded max-w-[300px]"
            />
            <span
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute left-64 md:left-1/4 cursor-pointer"
            >
              {showCurrent ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          {touched.current_password && errors.current_password && (
            <p className="text-red-500 text-sm">{errors.current_password}</p>
          )}

          {/* New Password */}
          <div className="flex items-center gap-2 relative">
            <Field
              type={showNew ? "text" : "password"}
              name="new_password"
              placeholder="New Password"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded max-w-[300px]"
            />
            <span
              onClick={() => setShowNew(!showNew)}
              className="absolute left-64 md:left-1/4 cursor-pointer"
            >
              {showNew ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          {touched.new_password && errors.new_password && (
            <p className="text-red-500 text-sm">{errors.new_password}</p>
          )}

          {/* Confirm Password */}
          <div className="flex items-center gap-2 relative">
            <Field
              type={showConfirm ? "text" : "password"}
              name="confirm_password"
              placeholder="Confirm Password"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded max-w-[300px]"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute left-64 md:left-1/4 cursor-pointer"
            >
              {showConfirm ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          {touched.confirm_password && errors.confirm_password && (
            <p className="text-red-500 text-sm">{errors.confirm_password}</p>
          )}

          {/* Submit */}
          <div className="flex py-4">
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className={`py-4 ${
                !isValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
