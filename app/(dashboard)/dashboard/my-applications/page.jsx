"use client";

import RequireAuth from "@/app/lib/ReuquireAuth";
import DashboardSidebar from "@/components/DashboardSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import {
  allPossibleQualifications,
  formatQualification,
} from "@/utils/utilFunctions";
import { WavingHand } from "@mui/icons-material";
import {
  Modal,
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseurl } from "@/hooks/useHttp/api";
import EditApplication from "@/components/my-applications/EditApplication";
import TutorForm from "@/components/my-applications/TutorForm";
import StudentForm from "@/components/my-applications/StudentForm";
import clsx from "clsx";

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

  const [formOpen, setFormOpen] = useState(false);
  const [applicationType, setApplicationType] = useState("");
  const [userApplications, setUserApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState();
  const [quranTutorApp, setQuranTutorApp] = useState(null);
  const [quranTutorAppLoading, setQuranTutorAppLoading] = useState(false);

  const handleCreateApplication = () => {
    if (userRoles?.includes("TUTOR")) {
      handleApplicationTypeSelect("Tutor Application");
    } else if (userRoles?.includes("STUDENT")) {
      handleApplicationTypeSelect("Student Application");
    }
  };

  const userRoles = useSelector((state) => state.user.user.roles);

  const handleFormClose = () => {
    setFormOpen(false);
    setApplicationType("");
  };

  const handleApplicationTypeSelect = (applicationType) => {
    setApplicationType(applicationType);
    setFormOpen(true);
  };

  const fetchApplicationData = async () => {
    try {
      setIsLoading(true);

      let endpoint = userRoles.includes("TUTOR")
        ? "/tutor/applications/list/"
        : "/student/applications/list/";

      const response = await baseurl.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUserApplications(response.data.results);
    } catch (error) {
      console.error("Error fetching application data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchQuranTutorApp() {
      setQuranTutorAppLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://api.ihsaanacademia.com/api/my-quran-tutor-application/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setQuranTutorApp(data);
        }
      } catch (err) {
        // ignore
      } finally {
        setQuranTutorAppLoading(false);
      }
    }
    fetchQuranTutorApp();
  }, []);

  useEffect(() => {
    fetchApplicationData();
  }, [userRoles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditApplicationBtn = (application) => {
    setSelectedApplication(application);
    setOpen(true);
  };
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

  const getStatusColor = (status) =>
    clsx("text-white px-4 py-2 rounded-full text-xs font-bold", {
      "bg-green-500":
        status?.toUpperCase() === "ACCEPTED" ||
        status?.toUpperCase() === "APPROVED",
      "bg-yellow-500": status?.toUpperCase() === "PENDING",
      "bg-red-500": status?.toUpperCase() === "REJECTED",
      "bg-gray-400": !["ACCEPTED", "APPROVED", "PENDING", "REJECTED"].includes(
        status?.toUpperCase()
      ),
    });

  return (
    <RequireAuth>
      <Header />
      <main className="py-2 flex flex-col md:flex-row">
        <DashboardSidebar currentRoute={currentRoute} />
        <section className="flex-1 p-4 min-h-screen overflow-hidden">
          <div className="w-full">
            {/* 1. mt-12 on mobile pushes text below sidebar toggle.
                2. items-end and flex-col sm:flex-row keeps alignment clean.
            */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-12 md:mt-0 mb-6 gap-4">
              <div className="text-sm">
                Welcome{" "}
                <span className="text-lg font-semibold">
                  {user?.first_name}
                </span>{" "}
                <WavingHand sx={{ color: "blue", fontSize: "1.5rem" }} />
              </div>

              {/* Force the button container to align right on mobile and desktop */}
              <div className="w-full sm:w-auto flex justify-end">
                <Button
                  onClick={handleCreateApplication}
                  variant="contained"
                  disabled={
                    !userRoles?.includes("TUTOR") &&
                    !userRoles?.includes("STUDENT")
                  }
                  className="px-4 py-2 rounded-md text-white font-medium transition duration-300 bg-primary hover:bg-[#f34103] w-auto"
                >
                  Create new application
                </Button>
              </div>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              <div className="min-w-[800px]">
                <table className="table-auto w-full text-left border-collapse">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr className="text-red-600">
                      <th className="px-4 py-3 border-b">#</th>
                      <th className="px-4 py-3 border-b">Application type</th>
                      <th className="px-4 py-3 border-b">Name</th>
                      <th className="px-4 py-3 border-b">Gender</th>
                      <th className="px-4 py-3 border-b">
                        Highest Qualification
                      </th>
                      <th className="px-4 py-3 border-b">
                        Years of Experience
                      </th>
                      <th className="px-4 py-3 border-b text-center">Status</th>
                      <th className="px-4 py-3 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="8" className="p-10 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      <>
                        {quranTutorApp && (
                          <tr className="border-b even:bg-gray-50 hover:bg-gray-100 transition-colors">
                            <td className="px-4 py-3 font-medium">
                              QURAN-TUTOR
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              Qur'an Tutor Application
                            </td>
                            <td className="px-4 py-3">
                              {quranTutorApp.first_name}{" "}
                              {quranTutorApp.last_name}
                            </td>
                            <td className="px-4 py-3">
                              {quranTutorApp.gender}
                            </td>
                            <td className="px-4 py-3 text-gray-400">-</td>
                            <td className="px-4 py-3">
                              {quranTutorApp.years_of_experience || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={getStatusColor(
                                  quranTutorApp.status || "PENDING"
                                )}
                              >
                                {quranTutorApp.status || "PENDING"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <a
                                href="/dashboard/quran-tutor"
                                className="inline-block px-3 py-1 rounded-md text-white text-sm font-medium transition duration-300 bg-primary hover:bg-[#f34103]"
                              >
                                View Details
                              </a>
                            </td>
                          </tr>
                        )}
                        {userApplications.map((application) => (
                          <tr
                            key={application.id}
                            className="border-b even:bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <td className="px-4 py-3">{application.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {userRoles?.includes("TUTOR")
                                ? "Tutor Application"
                                : "Student Application"}
                            </td>
                            <td className="px-4 py-3">
                              {application.user_details.first_name}{" "}
                              {application.user_details.last_name}
                            </td>
                            <td className="px-4 py-3">{application.gender}</td>
                            <td className="px-4 py-3">
                              {formatQualification(
                                application.highest_qualification
                              ) || "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {application.years_of_experience || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={getStatusColor(
                                  userRoles?.includes("TUTOR")
                                    ? application.tutor_application_status
                                    : application.student_application_status
                                )}
                              >
                                {userRoles?.includes("TUTOR")
                                  ? application.tutor_application_status
                                  : application.student_application_status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                className="px-3 py-1 rounded-md text-white text-sm font-medium transition duration-300 bg-primary hover:bg-[#f34103]"
                                onClick={() =>
                                  handleEditApplicationBtn(application)
                                }
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* View Details Modal */}
      <Modal open={open} onClose={handleClose}>
        <EditApplication
          selectedApplication={selectedApplication}
          handleClose={handleClose}
          userRoles={userRoles}
        />
      </Modal>

      {/* Create Form Modal */}
      <Modal open={formOpen} onClose={handleFormClose}>
        <Box className="modal-box bg-white w-[95%] md:w-[60vw] m-auto h-[90%] overflow-y-auto mt-5 md:mt-[50px] rounded-lg shadow-xl">
          {applicationType === "Tutor Application" ? (
            <TutorForm
              fetchApplicationData={fetchApplicationData}
              handleFormClose={handleFormClose}
            />
          ) : (
            <StudentForm
              fetchApplicationData={fetchApplicationData}
              handleFormClose={handleFormClose}
            />
          )}
        </Box>
      </Modal>
    </RequireAuth>
  );
};

export default Page;
