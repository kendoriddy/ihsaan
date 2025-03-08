"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { fetchTutors } from "@/utils/redux/slices/tutorSlice";
import { useDelete, usePost, usePut, usePut2 } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import { Tabs, Tab } from "@mui/material";

const TutorApplication = () => {
  const currentRoute = usePathname();
  const dispatch = useDispatch();

  const {
    tutors: fetchedTutors,
    pagination,
    status,
  } = useSelector((state) => state.tutor);

  const [tutors, setTutors] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [isModalClose, setIsModalClose] = useState(true);
  const [tutorToEdit, setTutorToEdit] = useState(null);
  const [modalContent, setModalContent] = useState("addTutor");
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [tutorToToggle, setTutorToToggle] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(
    tutorToEdit?.tutor_application_status || "PENDING"
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const handleViewTutor = (tutor) => {
    setSelectedTutor(tutor);
    setSelectedStatus(tutor.tutor_application_status);
    setIsViewModalOpen(true);
  };

  // Function to fetch tutors based on status
  const fetchTutorsByStatus = (status) => {
    let statusFilter;

    if (status === "pending") statusFilter = "PENDING";
    else if (status === "approved") statusFilter = "APPROVED";
    else if (status === "declined") statusFilter = "REJECTED";

    const params = { page: 1, pageSize: 10 };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    dispatch(fetchTutors(params));
  };

  // Fetch tutors on tab change
  useEffect(() => {
    fetchTutorsByStatus(selectedTab);
  }, [selectedTab]);

  const tutorApplicationStatusRef = useRef();

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleActiveStatus = (tutor) => {
    setTutorToToggle(tutor);
    setIsActiveModalOpen(true);
  };

  const { mutate: updateApplicationActiveStatus } = usePut("/users", {
    onSuccess: () => dispatch(fetchTutors({ page: 1, pageSize: 10 })),
  });

  const handleConfirmToggleActiveStatus = async () => {
    const updateStatusPromise = new Promise((resolve, reject) => {
      updateApplicationActiveStatus(
        {
          id: `${tutorToToggle.id}/activate-deactivate/`,
          data: {
            is_active: !tutorToToggle.is_active,
          },
        },
        {
          onSuccess: () => {
            setIsModalClose(true);
            toast.success(
              `Tutor has been ${
                tutorToToggle.is_active ? "deactivated" : "activated"
              }`
            );
            setIsActiveModalOpen(false);
          },
          onError: (error) => {
            console.error("Failed to update status:", error);
            setIsLoading(false);
            toast.error(error.response.data.detail || "An error occurred");
            toast.error(
              error.response.data.tutor_application_status[0]
                ? error.response.data.tutor_application_status[0]
                : error.response.data.detail || "An error occurred"
            );
            reject(error);
          },
        }
      );
    });
    try {
      await updateStatusPromise;
    } catch (error) {
      console.error("Caught error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { mutate: addTutor } = usePost("/tutors", {
    onSuccess: () => dispatch(fetchTutors({ page: 1, pageSize: 10 })),
  });

  const { mutate: deleteTutor } = useDelete("/tutors", {
    onSuccess: () => dispatch(fetchTutors({ page: 1, pageSize: 10 })),
  });

  const { mutate: updateApplicationStatus } = usePut2({
    onSuccess: () => dispatch(fetchTutors({ page: 1, pageSize: 10 })),
  });

  useEffect(() => {
    dispatch(fetchTutors({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (fetchedTutors) {
      setTutors(fetchedTutors);
    }
  }, [fetchedTutors]);

  const handleEditTutorBtn = (tutor) => {
    setModalContent("editTutor");
    setTutorToEdit(tutor);
    setIsModalClose(false);
  };

  useEffect(() => {
    if (tutorToEdit && tutorApplicationStatusRef.current) {
      tutorApplicationStatusRef.current.value =
        tutorToEdit.tutor_application_status;
    }
  }, [tutorToEdit]);

  const resetForm = () => {
    if (tutorApplicationStatusRef.current) {
      tutorApplicationStatusRef.current.value = "PENDING";
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      tutor_application_status: selectedStatus,
    };

    if (selectedStatus === "REJECTED") {
      data.tutor_rejection_reason = rejectionReason;
    }

    const token = localStorage.getItem("token");
    console.log(selectedTutor, "selected Tutor:");

    const updateStatusPromise = new Promise((resolve, reject) => {
      updateApplicationStatus(
        {
          url: `https://ihsaanlms.onrender.com/api/admin/tutor/application/${tutorToEdit?.id}/update/`,
          data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          onSuccess: () => {
            setIsModalClose(true);
            toast.success("Status updated successfully!");
            resetForm();
            resolve();
          },
          onError: (error) => {
            console.error("Failed to update status:", error);
            setIsLoading(false);
            toast.error(error.response.data.detail || "An error occurred");
            toast.error(
              error.response.data.tutor_application_status[0]
                ? error.response.data.tutor_application_status[0]
                : error.response.data.detail || "An error occurred"
            );
            reject(error);
          },
        }
      );
    });

    try {
      await updateStatusPromise;
    } catch (error) {
      console.error("Caught error:", error);
    } finally {
      setIsLoading(false);
      setRejectionReason("");
      setSelectedStatus("");
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchTutors({ page: newPage, pageSize: pagination.pageSize }));
  };

  console.log(selectedStatus, "zzzz");
  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        {/* Main body */}
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (minWidth: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          <div className="p-4">
            {/* Top */}
            {/* <div className="flex justify-between items-center">
              <div className="text-lg font-bold"></div>
              <div
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                onClick={handleAddTutorBtn}
              >
                Add A Tutor
              </div>
            </div> */}

            {/* Tabs */}
            <Tabs
              value={selectedTab}
              onChange={(e, newValue) => setSelectedTab(newValue)}
            >
              <Tab label="All" value="all" />
              <Tab label="Pending" value="pending" />
              <Tab label="Approved" value="approved" />
              <Tab label="Declined" value="declined" />
            </Tabs>

            {/* Table */}
            <div className="mt-4 flex-1 overflow-y-scroll relative py-4">
              <div className="p-2 font-bold  bg-white">Tutor List</div>
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Tutor Name</th>
                    <th className=" border px-4 py-2">Email</th>
                    <th className=" border px-4 py-2">Gender </th>
                    <th className=" border px-4 py-2">
                      Highest Qualification{" "}
                    </th>
                    <th className=" border px-4 py-2">Professional Bio</th>
                    <th className=" border px-4 py-2">Application Status</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {status === "loading" ? (
                    <h4 className="mt-4">Loading...</h4>
                  ) : tutors.length === 0 ? (
                    <h4 className="mt-4">No data available at the moment</h4>
                  ) : (
                    tutors.map((tutor, index) => (
                      <tr
                        key={tutor.id}
                        className="even:bg-gray-100 hover:bg-gray-200"
                      >
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {tutor.user_details.first_name +
                            " " +
                            tutor.user_details.last_name}
                        </td>
                        <td className="border px-4 py-2">
                          {tutor.user_details.email}
                        </td>
                        <td className="border px-4 py-2">{tutor.gender}</td>
                        <td className="border px-4 py-2">
                          {tutor.highest_qualification}
                        </td>
                        <td className="border px-4 py-2">
                          {tutor.professional_bio}
                        </td>
                        <td className="border px-4 py-2">
                          <td className="border px-4 py-2">
                            <button
                              onClick={() => handleEditTutorBtn(tutor)}
                              className={`${
                                tutor.tutor_application_status === "APPROVED"
                                  ? "bg-green-500"
                                  : tutor.tutor_application_status ===
                                    "REJECTED"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              } text-white px-4 py-2 rounded-full`}
                            >
                              {tutor.tutor_application_status}
                            </button>
                          </td>
                        </td>
                        <td className="border px-4 py-2">
                          <div className="flex gap-2">
                            {/* View Button */}
                            <button
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                              onClick={() => handleViewTutor(tutor)}
                            >
                              View
                            </button>
                            {/* <button
                            className={`px-3 py-1 rounded-md text-white font-medium transition duration-300 ${
                              tutor.is_active
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-600 hover:bg-gray-700"
                            }`}
                            onClick={() => handleToggleActiveStatus(tutor)}
                          >
                            {tutor.is_active ? "Active" : "Inactive"}
                          </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination Component */}
              <div className="flex justify-center mt-4">
                <Pagination
                  count={pagination?.totalPages || 1}
                  page={pagination?.currentPage || 1}
                  onChange={(event, value) => handlePageChange(value)}
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Modal */}
        <section
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
            isModalClose && "hidden"
          }`}
        >
          <div className="w-screen h-screen flex justify-center items-center  p-4  ">
            {/* Add Tutor */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "addTutor" ? "block" : "hidden"
              }`}
            >
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Add Tutor</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}
                  >
                    Close
                  </div>
                </div>
                <Divider />
              </div>
            </div>

            {/* Edit Tutor */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "editTutor" ? "block" : "hidden"
              }`}
            >
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Edit Tutor Status</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}
                  >
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form onSubmit={handleStatusUpdate}>
                <div className="py-3 px-3">
                  <select
                    ref={tutorApplicationStatusRef}
                    defaultValue={tutorToEdit?.tutor_application_status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {tutorToEdit?.tutor_application_status === "PENDING" ? (
                      <>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </>
                    ) : (
                      <option value={tutorToEdit?.tutor_application_status}>
                        {tutorToEdit?.tutor_application_status
                          .charAt(0)
                          .toUpperCase() +
                          tutorToEdit?.tutor_application_status
                            .slice(1)
                            .toLowerCase()}
                      </option>
                    )}
                  </select>
                  {selectedStatus === "REJECTED" && (
                    <div className="py-3 px-3">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter the reason for rejection"
                      />
                    </div>
                  )}
                </div>

                {tutorToEdit?.tutor_application_status === "PENDING" && (
                  <div className="flex justify-center py-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      {isLoading ? "Loading..." : "Update Status"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Modal for activating/deactivating tutor */}
        {isActiveModalOpen && (
          <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-[400px] rounded p-4">
              <div className="text-lg font-bold">
                {tutorToToggle.is_active ? "Deactivate" : "Activate"} Tutor
              </div>
              <div className="py-4">
                Are you sure you want to{" "}
                {tutorToToggle.is_active ? "deactivate" : "activate"} this
                tutor?
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsActiveModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleConfirmToggleActiveStatus}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Confirm"}
                </button>
              </div>
            </div>
          </section>
        )}

        {isViewModalOpen && selectedTutor && (
          <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-[500px] rounded p-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Tutor Details</h2>
                <button
                  className="text-red-600 hover:text-blue-600 transition-all duration-300"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
              <Divider />

              {/* Tutor Details */}
              <div className="py-4">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Application Status
                      </td>
                      <td className="border px-4 py-2">{selectedStatus}</td>
                    </tr>
                    {selectedTutor.tutor_application_status && (
                      <tr>
                        <td className="border px-4 py-2 font-semibold">
                          Reason for rejection
                        </td>
                        <td className="border px-4 py-2">
                          {selectedTutor.tutor_rejection_reason}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-gray-100">
                      <td className="border px-4 py-2 font-semibold">Name</td>
                      <td className="border px-4 py-2">
                        {selectedTutor.first_name} {selectedTutor.last_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Email</td>
                      <td className="border px-4 py-2">
                        {selectedTutor.email}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border px-4 py-2 font-semibold">Gender</td>
                      <td className="border px-4 py-2">
                        {selectedTutor.gender}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Qualification
                      </td>
                      <td className="border px-4 py-2">
                        {selectedTutor.highest_qualification}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Country
                      </td>
                      <td className="border px-4 py-2">
                        {selectedTutor.country}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Date of Birth
                      </td>
                      <td className="border px-4 py-2">
                        {selectedTutor.date_of_birth}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Marital Status
                      </td>
                      <td className="border px-4 py-2">
                        {selectedTutor.marital_status}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border px-4 py-2 font-semibold">
                        Experience
                      </td>
                      <td className="border px-4 py-2">
                        {selectedTutor.years_of_experience || "-"} years
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Professional Bio
                      </td>
                      <td className="border px-4 py-2">
                        {selectedTutor.professional_bio}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Additional Info
                      </td>
                      <td className="border px-4 py-2">
                        {selectedTutor.additional_info}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TutorApplication;
