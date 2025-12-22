"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import { usePatch } from "@/hooks/useHttp/useHttp";
import Swal from "sweetalert2";
import Divider from "@mui/material/Divider";

const editProfileSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country: Yup.string(),
  religion: Yup.string(),
  gender: Yup.string(),
  marital_status: Yup.string(),
  date_of_birth: Yup.date().max(
    new Date(),
    "Date of birth cannot be in the future"
  ),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const EditProfile = ({ profile, refetch, onClose }) => {
  const { mutate: updateProfile, isLoading } = usePatch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-profile/update_profile/`,
    {
      onSuccess: () => {
        Swal.fire({
          title: "Profile updated successfully",
          icon: "success",
          customClass: { confirmButton: "my-confirm-btn" },
        });
        refetch();
        onClose();
      },
      onError: (error) => {
        Swal.fire({
          title: error?.response?.data?.message || "Failed to update profile",
          icon: "error",
          customClass: { confirmButton: "my-confirm-btn" },
        });
      },
    }
  );

  const initialValues = {
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone_number: profile?.phone_number || "",
    country: profile?.country || "",
    religion: profile?.religion || "",
    gender: profile?.gender || "",
    marital_status: profile?.marital_status || "",
    date_of_birth: profile?.date_of_birth || "",
    email: profile?.email || "",
  };

  const handleSubmit = (values) => {
    updateProfile(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={editProfileSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isValid }) => (
        <Form className="p-4 space-y-4">
          {/* Names */}
          <div className="flex gap-4 flex-col lg:flex-row">
            <Field
              name="first_name"
              placeholder="First Name"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            />
            <Field
              name="last_name"
              placeholder="Last Name"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Date of Birth */}
          <Field
            type="date"
            name="date_of_birth"
            max={new Date().toISOString().split("T")[0]}
            className="w-full bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
          />

          {/* Email & Phone */}
          <div className="flex gap-4 flex-col lg:flex-row">
            <Field
              type="email"
              name="email"
              placeholder="Email Address"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            />
            <Field
              name="phone_number"
              placeholder="Phone Number"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            />
          </div>

          <Divider>Additional Info</Divider>

          {/* Gender & Marital Status */}
          <div className="flex gap-4 flex-col lg:flex-row">
            <Field
              as="select"
              name="gender"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Field>

            <Field
              as="select"
              name="marital_status"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            >
              <option value="">Select Marital Status</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
              <option value="WIDOWED">Widowed</option>
              <option value="OTHERS">Others</option>
            </Field>
          </div>

          {/* Religion & Country */}
          <div className="flex gap-4 flex-col lg:flex-row">
            <Field
              name="religion"
              placeholder="Religion"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            />
            <Field
              name="country"
              placeholder="Country"
              className="flex-1 bg-gray-100 border-b-2 px-2 py-2 rounded focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-[200px]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfile;
