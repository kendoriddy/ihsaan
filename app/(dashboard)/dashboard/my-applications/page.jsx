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
  Menu,
  MenuItem,
} from "@mui/material";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseurl } from "@/hooks/useHttp/api";
import EditApplication from "@/components/my-applications/EditApplication";
import TutorForm from "@/components/my-applications/TutorForm";
import StudentForm from "@/components/my-applications/StudentForm";

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

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const userRoles = useSelector((state) => state.user.user.roles);

  console.log(userRoles, "user roles:");

  const handleFormClose = () => {
    setFormOpen(false);
    setApplicationType("");
  };

  const handleApplicationTypeSelect = (applicationType) => {
    setApplicationType(applicationType);
    // setFormData({});
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
      console.log(response.data, "user data:");
      setUserApplications(response.data.results);
    } catch (error) {
      console.error("Error fetching application data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    console.log(application, "user application:");
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
                <Button
                  aria-controls="application-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  className="px-3 py-1 rounded-md text-white font-medium transition duration-300 bg-primary hover:bg-[#f34103]"
                >
                  Create new application
                </Button>
                <Menu
                  id="application-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {userRoles?.includes("TUTOR") && (
                    <MenuItem
                      onClick={() =>
                        handleApplicationTypeSelect("Tutor Application")
                      }
                    >
                      Tutor Application
                    </MenuItem>
                  )}
                  {userRoles?.includes("STUDENT") && (
                    <MenuItem
                      onClick={() =>
                        handleApplicationTypeSelect("Student Application")
                      }
                    >
                      Student Application
                    </MenuItem>
                  )}
                </Menu>
              </div>
            </div>

            {/*  Table */}
            <div className="flex-1 max-h-[500px] overflow-y-scroll relative">
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Application type</th>
                    <th className=" border px-4 py-2">Name</th>
                    <th className=" border px-4 py-2">Gender </th>
                    <th className=" border px-4 py-2">
                      Highest Qualification{" "}
                    </th>
                    <th className=" border px-4 py-2">Years of Experience</th>
                    <th className=" border px-4 py-2">Application Status</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                {isLoading
                  ? "Loading..."
                  : userApplications && (
                      <tbody>
                        {userApplications.map((application, index) => (
                          <tr
                            key={application.id}
                            className="even:bg-gray-100 hover:bg-gray-200"
                          >
                            <td className="border px-4 py-2">
                              {application.id}
                            </td>
                            <td className="border px-4 py-2">
                              {userRoles?.includes("TUTOR")
                                ? "Tutor Application"
                                : "Student Application"}
                            </td>
                            <td className="border px-4 py-2">
                              {application.user_details.first_name +
                                " " +
                                application.user_details.last_name}
                            </td>
                            <td className="border px-4 py-2">
                              {application.gender}
                            </td>
                            <td className="border px-4 py-2">
                              {formatQualification(
                                application.highest_qualification
                              ) || "N/A"}
                            </td>
                            <td className="border px-4 py-2">
                              {application.years_of_experience || "N/A"}
                            </td>
                            <td className="border px-4 py-2">
                              <button
                                className={`${
                                  application.tutor_application_status ===
                                    "APPROVED" ||
                                  application.student_application_status ===
                                    "APPROVED"
                                    ? "bg-green-500"
                                    : application.tutor_application_status ===
                                        "REJECTED" ||
                                      application.student_application_status ===
                                        "REJECTED"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                } text-white px-4 py-2 rounded-full`}
                              >
                                {userRoles?.includes("TUTOR")
                                  ? application.tutor_application_status
                                  : application.student_application_status}
                              </button>
                            </td>

                            <td className="border px-4 py-2">
                              <button
                                className={`px-3 py-1 rounded-md text-white font-medium transition duration-300 bg-primary hover:bg-[#f34103]`}
                                onClick={() =>
                                  handleEditApplicationBtn(application)
                                }
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <EditApplication
          selectedApplication={selectedApplication}
          handleClose={handleClose}
          userRoles={userRoles}
        />
      </Modal>

      {/* Modal for form submission */}
      <Modal open={formOpen} onClose={handleFormClose}>
        <Box className="modal-box bg-white w-full md:w-[60vw] m-auto h-[90%] overflow-scroll mt-5 md:mt-[50px] rounded">
          {applicationType === "Tutor Application" ? (
            <TutorForm
              fetchApplicationData={fetchApplicationData}
              handleFormClose={handleFormClose}
              handleMenuClose={handleMenuClose}
            />
          ) : (
            <StudentForm
              fetchApplicationData={fetchApplicationData}
              handleFormClose={handleFormClose}
              handleMenuClose={handleMenuClose}
            />
          )}
        </Box>
      </Modal>
    </RequireAuth>
  );
};

export default Page;
