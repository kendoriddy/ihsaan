"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerSchema } from "@/components/validationSchemas/ValidationSchema";
import FormikControl from "@/components/validation/FormikControl";
import { Formik, Form } from "formik";
import { usePost } from "@/hooks/useHttp/useHttp";

const RegistrationModal = ({ isOpen, onClose, onSuccess }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    roles: ["STUDENT"], // Default role for course purchases
  };

  const { mutate, isLoading } = usePost("/auth/register", {
    onSuccess: (response) => {
      toast.success(
        "Registration successful! Please verify your email by clicking the link sent to your mail."
      );
      onSuccess && onSuccess();
      onClose();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.email
        ? error.response.data.email.join(", ")
        : "Registration failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (values) => {
    const { first_name, last_name, email, password, roles } = values;
    const payload = {
      first_name,
      last_name,
      email,
      password,
      roles,
    };
    mutate(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h3>
          <p className="text-gray-600">
            Register to complete your purchase and access your courses
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <FormikControl
                    name="first_name"
                    placeholder="First Name"
                    className="w-full"
                  />
                  <FormikControl
                    name="last_name"
                    placeholder="Last Name"
                    className="w-full"
                  />
                </div>

                {/* Email */}
                <FormikControl
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full"
                />

                {/* Password */}
                <div className="relative">
                  <FormikControl
                    name="password"
                    type={showPassword ? "password" : "text"}
                    placeholder="Password"
                    className="w-full pr-12"
                  />
                  <InputAdornment
                    position="end"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <FormikControl
                    name="confirm_password"
                    type={showConfirmPassword ? "password" : "text"}
                    placeholder="Confirm Password"
                    className="w-full pr-12"
                  />
                  <InputAdornment
                    position="end"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Register as:
                  </label>
                  <select
                    value={values.roles[0] || "STUDENT"}
                    onChange={(e) => setFieldValue("roles", [e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="USER">User</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{" "}
                  <a
                    href="/terms-of-service"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegistrationModal;
