import React from "react";
import { Formik, Form } from "formik";
import FormikControl from "./validation/FormikControl";
import AuthButton from "./AuthButton";
import { countryNames } from "@/utils/utilFunctions";

const countryOptions = countryNames.map((country) => ({
  key: country,
  value: country,
}));

const genderOptions = [
  { key: "Male", value: "MALE" },
  { key: "Female", value: "FEMALE" },
];

// Programme selection is now handled by the Header component

const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  phone_number: "",
  country: "",
  gender: "",
  date_of_birth: "",
};

export default function StudentRegistrationForm({ onSubmit, isLoading }) {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        // Submit the form data with programme information
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div className="flex gap-2">
            <FormikControl name="first_name" placeholder="First Name" />
            <FormikControl name="last_name" placeholder="Last Name" />
          </div>

          <FormikControl name="email" placeholder="Email address" />

          <FormikControl
            name="password"
            type="password"
            placeholder="Password"
          />

          <FormikControl
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
          />

          <FormikControl name="phone_number" placeholder="Phone Number" />

          <FormikControl
            name="country"
            control="select"
            options={countryOptions}
            placeholder="Country"
          />

          <FormikControl
            name="gender"
            control="select"
            options={genderOptions}
            placeholder="Gender"
          />

          <FormikControl
            name="date_of_birth"
            control="date"
            placeholder="Date of Birth"
          />

          <div className="flex justify-end mt-4">
            <AuthButton
              text="Register as Student"
              isLoading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
