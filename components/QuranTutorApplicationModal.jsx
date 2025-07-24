import React, { useEffect, useState } from "react";
import Modal from "./validation/Modal";
import FormikControl from "./validation/FormikControl";
import { Formik, Form } from "formik";
import AuthButton from "./AuthButton";
import { countryNames } from "@/utils/utilFunctions";
import { toast } from "react-toastify";

const ajzaaOptions = Array.from({ length: 30 }, (_, i) => ({
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

const initialValues = {
  first_name: "",
  middle_name: "",
  last_name: "",
  phone_number: "",
  country_of_origin: "",
  country_of_residence: "",
  gender: "",
  display_profile_pic: true,
  ajzaa_memorized: "",
  tejweed_level: "",
  religion_sect: "",
  tutor_summary: "",
  languages: "",
  years_of_experience: "",
};

const validate = (values) => {
  const errors = {};
  if (!values.first_name) errors.first_name = "Required";
  if (!values.last_name) errors.last_name = "Required";
  if (!values.phone_number) errors.phone_number = "Required";
  if (!values.country_of_origin) errors.country_of_origin = "Required";
  if (!values.country_of_residence) errors.country_of_residence = "Required";
  if (!values.gender) errors.gender = "Required";
  if (!values.ajzaa_memorized) errors.ajzaa_memorized = "Required";
  if (!values.tejweed_level) errors.tejweed_level = "Required";
  if (!values.religion_sect) errors.religion_sect = "Required";
  if (!values.tutor_summary) errors.tutor_summary = "Required";
  if (!values.languages) errors.languages = "Required";
  if (!values.years_of_experience) errors.years_of_experience = "Required";
  return errors;
};

const QuranTutorApplicationModal = ({ isOpen, handleClose }) => {
  const [preview, setPreview] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [userData, setUserData] = useState({});
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("");
  const [readonlyFields, setReadonlyFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // Get userFullData from localStorage
        const userFullData =
          JSON.parse(localStorage.getItem("userFullData")) || {};
        setUserData(userFullData);
        // Mark fields as readonly if present in userFullData
        const ro = {};
        [
          // Always readonly if present:
          "first_name",
          "last_name",
          "middle_name",
          "phone_number",
          "country_of_origin",
          // country_of_residence and gender are always editable
          "ajzaa_memorized",
          "tejweed_level",
          "religion_sect",
          "languages",
          "years_of_experience",
        ].forEach((key) => {
          // Only first_name, last_name, gender should be readonly if present
          if (
            ["first_name", "last_name", "gender"].includes(key) &&
            userFullData[key]
          )
            ro[key] = true;
          else ro[key] = false;
        });
        // Override: country_of_residence and all others are always editable
        ro.country_of_residence = false;
        ro.gender = !!userFullData.gender; // gender readonly if present
        setReadonlyFields(ro);
        // Fetch existing application
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://ihsaanlms.onrender.com/api/my-quran-tutor-application/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const appData = await res.json();
          setApplication(appData);
          if (appData.status) setStatus(appData.status);
        }
      } catch (err) {
        setError("Failed to load application data.");
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) fetchData();
  }, [isOpen]);

  // Compose initial values
  const getInitialValues = () => {
    return {
      ...initialValues,
      ...application,
      ...userData,
    };
  };
  console.log(application, "dapply::");

  // On submit: POST or PATCH
  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    console.log("hereee");
    try {
      const token = localStorage.getItem("token");
      const method = application ? "PATCH" : "POST";
      const url = "https://ihsaanlms.onrender.com/api/apply-quran-tutor/";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to submit application");
      const updated = await res.json();
      toast.success("Application successful");
      // Update userFullData in localStorage with updated keys only
      if (method === "PATCH" && updated) {
        const userFullData =
          JSON.parse(localStorage.getItem("userFullData")) || {};
        const keysToUpdate = [
          "first_name",
          "last_name",
          "middle_name",
          "phone_number",
          "country_of_origin",
          "country_of_residence",
          "gender",
          "ajzaa_memorized",
          "tejweed_level",
          "religion_sect",
          "tutor_summary",
          "languages",
          "years_of_experience",
        ];
        keysToUpdate.forEach((key) => {
          if (key in updated) userFullData[key] = updated[key];
        });
        localStorage.setItem("userFullData", JSON.stringify(userFullData));
      }
      handleClose();
    } catch (err) {
      console.log(err, "error::");
      toast.error(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Qur'an Tutor Application"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <Formik
          initialValues={getInitialValues()}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="flex flex-col gap-4">
              {status && (
                <div className="mb-2 text-sm font-semibold text-blue-700">
                  Application Status: {status}
                </div>
              )}
              <div className="flex gap-2">
                <FormikControl
                  name="first_name"
                  placeholder="First Name"
                  readOnly={!!readonlyFields.first_name}
                />
                <FormikControl
                  name="middle_name"
                  placeholder="Middle Name (optional)"
                  readOnly={!!readonlyFields.middle_name}
                />
                <FormikControl
                  name="last_name"
                  placeholder="Last Name"
                  readOnly={!!readonlyFields.last_name}
                />
              </div>
              <FormikControl
                name="phone_number"
                placeholder="Phone Number"
                readOnly={!!readonlyFields.phone_number}
              />
              <div className="flex gap-2">
                <FormikControl
                  name="country_of_origin"
                  control="select"
                  options={countryOptions}
                  placeholder="Country of Origin"
                  readOnly={!!readonlyFields.country_of_origin}
                />
                <FormikControl
                  name="country_of_residence"
                  control="select"
                  options={countryOptions}
                  placeholder="Country of Residence"
                  readOnly={false}
                />
              </div>
              <FormikControl
                name="gender"
                control="select"
                options={genderOptions}
                placeholder="Gender"
                readOnly={!!readonlyFields.gender}
                onChange={(e) => {
                  setFieldValue("gender", e.target.value);
                  setSelectedGender(e.target.value);
                  if (e.target.value === "male")
                    setFieldValue("display_profile_pic", true);
                }}
              />
              <FormikControl
                name="ajzaa_memorized"
                control="select"
                options={ajzaaOptions}
                placeholder="Number of Ajzaa memorized"
                readOnly={!!readonlyFields.ajzaa_memorized}
              />
              <FormikControl
                name="tejweed_level"
                control="select"
                options={tejweedOptions}
                placeholder="Tejweed Level"
                readOnly={!!readonlyFields.tejweed_level}
              />
              <FormikControl
                name="religion_sect"
                control="select"
                options={sectOptions}
                placeholder="Religion Sect"
                readOnly={!!readonlyFields.religion_sect}
              />
              <FormikControl
                name="tutor_summary"
                control="textarea"
                placeholder="Short Bio (100–200 words)"
                minRows={4}
                maxLength={2000}
                readOnly={!!readonlyFields.tutor_summary}
              />
              <FormikControl
                name="languages"
                placeholder="Languages (comma separated)"
                readOnly={!!readonlyFields.languages}
              />
              <FormikControl
                name="years_of_experience"
                placeholder="Years of Experience"
                type="number"
                readOnly={!!readonlyFields.years_of_experience}
              />
              <div className="flex items-center gap-2">
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
                  disabled={!!readonlyFields.display_profile_pic}
                />
                <span>
                  {values.display_profile_pic ? "Yes" : "No (show avatar)"}
                </span>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
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
                  text={application ? "Update" : "Submit"}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};

export default QuranTutorApplicationModal;
