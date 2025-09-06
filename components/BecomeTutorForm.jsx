import React, { useState } from "react";
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
const tejweedOptions = [
  { key: "Beginner", value: "BEGINNER" },
  { key: "Intermediate", value: "INTERMEDIATE" },
  { key: "Expert", value: "EXPERT" },
];
const sectOptions = [
  { key: "Sunni", value: "SUNNI" },
  { key: "Shia", value: "SHIA" },
  { key: "Sufi", value: "SUFI" },
  { key: "Ahmadiyya", value: "AHMADIYYA" },
  { key: "Others", value: "OTHERS" },
];
const ajzaaOptions = Array.from({ length: 30 }, (_, i) => ({
  key: `${i + 1}`,
  value: i + 1,
}));

const initialValues = {
  // Normal tutor fields
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
  // Qur'an tutor fields
  display_profile_pic: true,
  ajzaa_memorized: "",
  tejweed_level: "",
  religion_sect: "",
  tutor_summary: "",
  languages: "",
  become_quran_tutor: false,
};

export default function BecomeTutorForm({ onSubmit, isLoading }) {
  const [showQuranFields, setShowQuranFields] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        // Remove extra fields if not becoming a Quran tutor
        const payload = { ...values };
        if (!values.become_quran_tutor) {
          delete payload.display_profile_pic;
          delete payload.ajzaa_memorized;
          delete payload.tejweed_level;
          delete payload.religion_sect;
          delete payload.tutor_summary;
          delete payload.languages;
        }
        onSubmit(payload);
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
          <FormikControl
            name="gender"
            control="select"
            options={genderOptions}
            placeholder="Gender"
          />

          {/* Become Quran Tutor toggle */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="become_quran_tutor"
              checked={values.become_quran_tutor}
              onChange={() => {
                setFieldValue("become_quran_tutor", !values.become_quran_tutor);
                setShowQuranFields(!values.become_quran_tutor);
              }}
            />
            <label htmlFor="become_quran_tutor" className="font-medium">
              Do you want to become a Qur'an tutor?
            </label>
          </div>

          {/* Extra Qur'an tutor fields */}
          {values.become_quran_tutor && (
            <div className="border rounded p-4 mt-2 bg-gray-50">
              <div className="font-semibold mb-2">Qur'an Tutor Details</div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <FormikControl
                    name="ajzaa_memorized"
                    control="select"
                    options={ajzaaOptions}
                    placeholder="Number of Ajzaa memorized"
                  />
                  <FormikControl
                    name="tejweed_level"
                    control="select"
                    options={tejweedOptions}
                    placeholder="Tejweed Level"
                  />
                </div>
                <FormikControl
                  name="religion_sect"
                  control="select"
                  options={sectOptions}
                  placeholder="Religion Sect"
                />
                <FormikControl
                  name="tutor_summary"
                  control="textarea"
                  placeholder="Short Bio (100–200 words)"
                  minRows={4}
                  maxLength={2000}
                />
                <FormikControl
                  name="languages"
                  placeholder="Languages (comma separated)"
                />
                {/* Photo upload */}
                <FormikControl
                  name="profile_picture"
                  control="imageUpload"
                  placeholder="Upload your photo"
                />
                <div className="flex items-center gap-2 mt-2">
                  <label>Display Profile Picture Publicly?</label>
                  <input
                    type="checkbox"
                    checked={values.display_profile_pic}
                    onChange={() =>
                      setFieldValue(
                        "display_profile_pic",
                        !values.display_profile_pic
                      )
                    }
                  />
                  <span>
                    {values.display_profile_pic ? "Yes" : "No (show avatar)"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <AuthButton
              text="Submit"
              isLoading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
