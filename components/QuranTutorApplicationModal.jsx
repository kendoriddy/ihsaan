import React, { useState } from "react";
import Modal from "./validation/Modal";
import FormikControl from "./validation/FormikControl";
import { Formik, Form } from "formik";
import AuthButton from "./AuthButton";
import { countryNames } from "@/utils/utilFunctions";

const ajazaOptions = Array.from({ length: 30 }, (_, i) => ({
  key: `${i + 1}`,
  value: i + 1,
}));

const genderOptions = [
  { key: "Male", value: "male" },
  { key: "Female", value: "female" },
];

const countryOptions = countryNames.map((country) => ({
  key: country,
  value: country,
}));

const initialValues = {
  first_name: "",
  middle_name: "",
  last_name: "",
  date_of_birth: "",
  country_of_origin: "",
  country_of_residence: "",
  gender: "",
  ajaza_memorized: "",
  profile_picture: null,
  display_face: true,
  bio: "",
};

const validate = (values) => {
  const errors = {};
  if (!values.first_name) errors.first_name = "Required";
  if (!values.last_name) errors.last_name = "Required";
  if (!values.date_of_birth) errors.date_of_birth = "Required";
  if (!values.country_of_origin) errors.country_of_origin = "Required";
  if (!values.country_of_residence) errors.country_of_residence = "Required";
  if (!values.gender) errors.gender = "Required";
  if (!values.ajaza_memorized) errors.ajaza_memorized = "Required";
  if (!values.profile_picture)
    errors.profile_picture = "Profile picture required";
  if (!values.bio) errors.bio = "Required";
  if (
    values.bio &&
    (values.bio.split(" ").length < 20 || values.bio.split(" ").length > 200)
  ) {
    errors.bio = "Bio must be between 20 and 200 words";
  }
  return errors;
};

const QuranTutorApplicationModal = ({ isOpen, handleClose }) => {
  const [preview, setPreview] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");

  return (
    <Modal
      title="Become a Qur'an Tutor"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          // Placeholder for backend integration
          console.log("Qur'an Tutor Application Submitted:", values);
          setSubmitting(false);
          handleClose();
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="flex flex-col gap-4">
            <div className="flex gap-2">
              <FormikControl name="first_name" placeholder="First Name" />
              <FormikControl
                name="middle_name"
                placeholder="Middle Name (optional)"
              />
              <FormikControl name="last_name" placeholder="Last Name" />
            </div>
            <FormikControl
              name="date_of_birth"
              control="date"
              placeholder="Date of Birth"
            />
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
              onChange={(e) => {
                setFieldValue("gender", e.target.value);
                setSelectedGender(e.target.value);
                if (e.target.value === "male")
                  setFieldValue("display_face", true);
              }}
            />
            <FormikControl
              name="ajaza_memorized"
              control="select"
              options={ajazaOptions}
              placeholder="Number of Ajaza memorized"
            />
            <div>
              <label className="block mb-1 font-medium">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFieldValue("profile_picture", file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setPreview(reader.result);
                    reader.readAsDataURL(file);
                  } else {
                    setPreview(null);
                  }
                }}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-full"
                />
              )}
              {errors.profile_picture && touched.profile_picture && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.profile_picture}
                </div>
              )}
            </div>
            {values.gender === "female" && (
              <div className="flex items-center gap-2">
                <label>Do you want your face displayed publicly?</label>
                <input
                  type="checkbox"
                  checked={values.display_face}
                  onChange={() =>
                    setFieldValue("display_face", !values.display_face)
                  }
                />
                <span>{values.display_face ? "Yes" : "No (show avatar)"}</span>
              </div>
            )}
            {values.gender === "male" && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">
                  Males must display their face publicly.
                </label>
              </div>
            )}
            <FormikControl
              name="bio"
              control="textarea"
              placeholder="Short Bio (100–200 words)"
              minRows={4}
              maxLength={2000}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <AuthButton
                text="Submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default QuranTutorApplicationModal;
