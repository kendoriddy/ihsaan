"use client";

import {
  countriesList,
  gender,
  maritalStatus,
  qualificationsList,
  religion,
  yearsOfExperienceOptions,
} from "@/utils/utilFunctions";
import { IconButton, InputAdornment, Modal } from "@mui/material";
import React, { useState } from "react";
import FormikControl from "../validation/FormikControl";
import AuthButton from "../AuthButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { baseurl } from "@/hooks/useHttp/api";
import axios from "axios";

const StudentForm = ({
  fetchApplicationData,
  handleFormClose,
  handleMenuClose,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const initialValues = {
    years_of_experience: "",
    country: "",
    professional_bio: "",
    additional_info: "",
    skills: "",
    highest_qualification: "",
    religion: "",
    gender: "",
    marital_status: "",
    date_of_birth: "",
    area_of_specialization: "",
    preferred_mentee_gender: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsCreating(true);

    try {
      const response = await baseurl.post(
        "/student/create-application/",
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Application submitted:", response.data);
      toast.success("Application submitted successfully!");
      fetchApplicationData();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response.data[0] ||
          "Error submitting application. Please try again."
      );
    } finally {
      setIsCreating(false);
      setSubmitting(false);
      handleMenuClose();
      handleFormClose();
    }
  };

  return (
    <div className="px-5 py-2 text-[16px] font-semibold">
      <div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values }) => {
            return (
              <Form>
                <div className="flex justify-between items-center p-4">
                  <h2 className="mb-4">Tutor Application Form</h2>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => {
                      handleMenuClose();
                      handleFormClose();
                    }}
                  >
                    Close
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div>
                    <FormikControl
                      name="highest_qualification"
                      options={qualificationsList}
                      control={"select"}
                      placeholder="Select your highest qualification"
                    />
                  </div>

                  <div>
                    <FormikControl
                      name="years_of_experience"
                      options={yearsOfExperienceOptions}
                      control={"select"}
                      placeholder="Select your years of experience"
                    />
                  </div>

                  <div>
                    <FormikControl
                      name="country"
                      options={countriesList}
                      control={"select"}
                      placeholder="Select your country"
                    />
                  </div>

                  {/* <div>
                    <FormikControl
                      name="professional_bio"
                      placeholder="Enter professional bio"
                      multiline
                      minRows={3}
                    />
                  </div> */}

                  <div>
                    <FormikControl
                      name="additional_info"
                      placeholder="Other info you would like us to know about you(max 250words)"
                      multiline
                      minRows={3}
                      maxLength={250}
                    />
                  </div>

                  <div>
                    <FormikControl
                      name="skills"
                      placeholder="List your skills, separated by comma"
                      multiline
                      minRows={3}
                      maxLength={250}
                    />
                  </div>

                  <div>
                    <FormikControl
                      name="religion"
                      options={religion}
                      control={"select"}
                      placeholder="Religion"
                    />
                  </div>

                  <div>
                    <FormikControl
                      name="gender"
                      options={gender}
                      control={"select"}
                      placeholder="Gender"
                    />
                  </div>

                  <div>
                    <FormikControl
                      name="marital_status"
                      options={maritalStatus}
                      control={"select"}
                      placeholder="Marital status"
                    />
                  </div>

                  <div>
                    <FormikControl
                      name="date_of_birth"
                      control={"date"}
                      placeholder="Input your date of birth"
                    />
                  </div>

                  {/* <div>
                    <FormikControl
                      name="area_of_specialization"
                      placeholder="Areas of specialization"
                    />
                  </div> */}

                  <div className="flex justify-center">
                    <AuthButton
                      text="submit"
                      isLoading={isCreating}
                      disabled={isCreating}
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default StudentForm;
