import React from "react";
import FormikControl from "@/components/validation/FormikControl";
import { Form, Formik } from "formik";
import AuthButton from "@/components/AuthButton";
const sample = () => {
  const intialValues = {
    first_name: "",
    middle_name: "",
    last_name: "",
    professional_summary: "",
    date_of_birth: "",
    gender: "",
    email: "",
    number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    company: "",
    job_role: "",
    academic_qualification: "",
    certificate: "",
    institution: "",
    personal_qualification: "",
    certificate_link: "",
    preferred_mentoring_field: "",
    monthly_rate: "",
    one_time_feild: "",
    languages: "",
    marital_status: "",
    linkedIN_url: "",
    link_to_cv: "",
    profile_page: "",
  };

  const options = [
    {
      key: "Male",
      value: "male",
    },
    {
      key: "Female",
      value: "female",
    },
  ];

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <>
      <Formik
        initialValues={intialValues}
        // validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => {
          return (
            <Form>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-4">
                    <FormikControl name="first_name" placeholder="First Name" />
                  </div>
                  <div className="col-span-4">
                    <FormikControl
                      name="middle_name"
                      placeholder="Middle Name"
                    />
                  </div>
                  <div className="col-span-4">
                    <FormikControl name="last_name" placeholder="Last Name" />
                  </div>
                </div>

                <div>
                  <FormikControl
                    multiline
                    minRows={6}
                    name="professional_summary"
                    placeholder="Professional Summart"
                  />
                </div>

                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <FormikControl control="date" name="date_of_birth" />
                  </div>
                  <div className="col-span-6">
                    <FormikControl
                      control="select"
                      name="gender"
                      placeholder="Switch category"
                      options={options}
                    />
                  </div>
                </div>

                <div>
                  <AuthButton
                    text="Save"
                    // isLoading={isLoading}
                    // disabled={isLoading}
                    // onClick={handleSubmit}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default sample;
