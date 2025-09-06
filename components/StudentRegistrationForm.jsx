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
  { key: "Male", value: "male" },
  { key: "Female", value: "female" },
];

const programmeOptions = [
  { key: "Nahu Programme", value: "nahu" },
  { key: "Primary Programme", value: "primary" },
  { key: "Secondary Programme", value: "secondary" },
];

const getProgrammeDisplayName = (programme) => {
  switch (programme) {
    case "nahu":
      return "Nahu Programme";
    case "primary":
      return "Primary Programme";
    case "secondary":
      return "Secondary Programme";
    default:
      return "Programme";
  }
};

const getProgrammeOptions = (selectedProgramme) => {
  if (selectedProgramme) {
    // If a specific programme is selected, only show that option
    return programmeOptions.filter(
      (option) => option.value === selectedProgramme
    );
  }
  // If no specific programme, show all options
  return programmeOptions;
};

const initialValues = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  phone_number: "",
  country_of_origin: "",
  country_of_residence: "",
  gender: "",
  programme: "",
  date_of_birth: "",
  additional_info: "",
};

export default function StudentRegistrationForm({
  onSubmit,
  isLoading,
  selectedProgramme = "",
}) {
  // Set the programme value if provided
  const formInitialValues = {
    ...initialValues,
    programme: selectedProgramme || initialValues.programme,
  };

  return (
    <Formik
      initialValues={formInitialValues}
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
            <FormikControl
              name="middle_name"
              placeholder="Middle Name (optional)"
            />
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

          <div className="flex gap-2">
            <FormikControl
              name="country_of_origin"
              control="select"
              options={countryOptions}
              placeholder="Country of Origin"
            />
            <FormikControl
              name="country_of_residence"
              control="select"
              options={countryOptions}
              placeholder="Country of Residence"
            />
          </div>

          <div className="flex gap-2">
            <FormikControl
              name="gender"
              control="select"
              options={genderOptions}
              placeholder="Gender"
            />
            <FormikControl
              name="programme"
              control="select"
              options={getProgrammeOptions(selectedProgramme)}
              placeholder={
                selectedProgramme
                  ? `${getProgrammeDisplayName(
                      selectedProgramme
                    )} (Pre-selected)`
                  : "Select Programme"
              }
              disabled={!!selectedProgramme}
            />
          </div>

          <FormikControl
            name="date_of_birth"
            control="date"
            placeholder="Date of Birth"
          />

          <FormikControl
            name="additional_info"
            control="textarea"
            placeholder="Additional Information (optional)"
            minRows={3}
            maxLength={500}
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
