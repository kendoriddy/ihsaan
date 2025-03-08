"use client";

import RequireAuth from "@/app/lib/ReuquireAuth";
import DashboardSidebar from "@/components/DashboardSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import { allPossibleQualifications } from "@/utils/utilFunctions";
import { WavingHand } from "@mui/icons-material";
import { Modal, Box, TextField, Button } from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Page = () => {
  const currentRoute = usePathname();
  const userFromRedux = useSelector(currentlyLoggedInUser);
  const user =
    typeof window !== "undefined"
      ? localStorage.getItem("user")
      : userFromRedux;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApplicationData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://ihsaanlms.onrender.com/api/tutor/application/update/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching application data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditApplicationBtn = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const qualificationsList = allPossibleQualifications.map((qualification) => {
    return {
      key: qualification,
      value: qualification.toLowerCase().replace(/\s+/g, "-"),
    };
  });

  const yearsOfExperienceOptions = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
  }));

  const fieldConfig = {
    first_name: {
      editable: false,
      visible: true,
      label: "First Name",
      type: "text",
    },
    last_name: {
      editable: false,
      visible: true,
      label: "Last Name",
      type: "text",
    },
    email: { editable: false, visible: true, label: "Email", type: "text" },
    country: { editable: false, visible: true, label: "Country", type: "text" },
    years_of_experience: {
      editable: true,
      visible: true,
      label: "Total Years of Experience",
      type: "select",
      options: yearsOfExperienceOptions.map((option) => option.value),
    },
    professional_bio: {
      editable: true,
      visible: true,
      label: "Professional Bio",
      type: "textarea",
    },
    additional_info: {
      editable: true,
      visible: true,
      label: "Additional Info",
      type: "textarea",
    },
    skills: { editable: true, visible: true, label: "Skills", type: "text" },
    highest_qualification: {
      editable: true,
      visible: true,
      label: "Highest Qualification",
      type: "select",
      options: qualificationsList.map((qualification) =>
        qualification.key.toLowerCase()
      ),
    },
    religion: {
      editable: true,
      visible: true,
      label: "Religion",
      type: "select",
      options: ["islam", "christain", "others"],
    },
    gender: {
      editable: false,
      visible: true,
      label: "Gender",
      type: "select",
      options: ["male", "female", "others"],
    },
    marital_status: {
      editable: true,
      visible: true,
      label: "Marital Status",
      type: "select",
      options: ["single", "married", "divorced", "widowed"],
    },
    date_of_birth: {
      editable: true,
      visible: true,
      label: "Date of Birth",
      type: "date",
    },
    preferred_mentee_gender: {
      editable: true,
      visible: true,
      label: "Preferred Mentee Gender",
      type: "select",
      options: ["Male", "Female", "No Preference"],
    },
    mentorship_areas: {
      editable: true,
      visible: true,
      label: "Mentorship Areas",
      type: "textarea",
    },
    tutor_application_status: {
      editable: false,
      visible: false,
      label: "Tutor Application Status",
      type: "select",
      options: ["PENDING", "APPROVED", "REJECTED"],
    },
    tutor_rejection_reason: {
      editable: false,
      visible: true,
      label: "Reason for Rejection",
      type: "textarea",
    },
    is_active: {
      editable: false,
      visible: false,
      label: "Is Active?",
      type: "checkbox",
    },
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        "https://ihsaanlms.onrender.com/api/tutor/application/update/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Application updated successfully:", response.data);
      fetchApplicationData();
      handleClose();
    } catch (error) {
      console.error(
        "Error updating application:",
        error.response?.data || error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewApplication = () => {
    console.log("clicked");
  };

  return (
    <RequireAuth>
      <Header />
      <main className=" py-2 flex">
        <DashboardSidebar currentRoute={currentRoute} />

        <section className="flex flex-col md:flex-row p-4 justify-self-center flex-1 min-h-screen">
          <div className="px-4  w-full py-8 lg:py-0">
            {/* Waving Hand */}
            <div className="flex items-center justify-between">
              <div className="text-sm my-3">
                Welcome <span className="text-lg">{user.first_name}</span>{" "}
                <WavingHand sx={{ color: "blue", fontSize: "2rem" }} />
              </div>
              <div>
                <button
                  className={`px-3 py-1 rounded-md text-white font-medium transition duration-300 bg-primary hover:bg-[#f34103]`}
                  onClick={handleCreateNewApplication}
                >
                  Create new application
                </button>
              </div>
            </div>

            {/*  Table */}
            <div className="flex-1 max-h-[500px] overflow-y-scroll relative">
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Application type</th>
                    <th className=" border px-4 py-2">Email</th>
                    <th className=" border px-4 py-2">Gender </th>
                    <th className=" border px-4 py-2">
                      Highest Qualification{" "}
                    </th>
                    <th className=" border px-4 py-2">Years of Experience</th>
                    <th className=" border px-4 py-2">Application Status</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                {formData && (
                  <tbody>
                    <tr className="even:bg-gray-100 hover:bg-gray-200">
                      <td className="border px-4 py-2">1</td>
                      <td className="border px-4 py-2">Tutor application</td>
                      <td className="border px-4 py-2">{formData.email}</td>
                      <td className="border px-4 py-2">{formData.gender}</td>
                      <td className="border px-4 py-2">
                        {formData.highest_qualification.toUpperCase() || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {formData.years_of_experience || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className={`${
                            formData.tutor_application_status === "ACCEPTED"
                              ? "bg-green-500"
                              : formData.tutor_application_status === "REJECTED"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          } text-white px-4 py-2 rounded-full`}
                        >
                          {formData.tutor_application_status}
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className={`px-3 py-1 rounded-md text-white font-medium transition duration-300 bg-primary hover:bg-[#f34103]`}
                          onClick={handleEditApplicationBtn}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box className="bg-white p-6 rounded-lg overflow-scroll md:w-[60%] h-[90%] mx-auto mt-20">
          <h2 className="text-lg font-semibold mb-4">Edit Application</h2>

          {formData && (
            <div className="space-y-4">
              {Object.entries(fieldConfig)
                .filter(([key, config]) => config.visible)
                .map(([key, config]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {config.label}
                    </label>

                    {config.type === "text" ||
                    config.type === "number" ||
                    config.type === "date" ? (
                      <input
                        type={config.type}
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                        readOnly={!config.editable}
                      />
                    ) : config.type === "textarea" ? (
                      <textarea
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                        rows="3"
                        readOnly={!config.editable}
                      />
                    ) : config.type === "select" ? (
                      <select
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                        readOnly={!config.editable}
                      >
                        <option value="">Select...</option>
                        {config.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : config.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        name={key}
                        checked={formData[key] || false}
                        onChange={handleChange}
                        className="mt-1"
                        readOnly={!config.editable}
                      />
                    ) : null}
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleClose}
              className="mr-2 px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </Box>
      </Modal>
    </RequireAuth>
  );
};

export default Page;
