"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents } from "@/utils/redux/slices/studentSlice";
import { useDelete, usePost, usePut, usePut2 } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import { Tabs, Tab } from "@mui/material";
import { formatQualification } from "@/utils/utilFunctions";

const StudentApplication = () => {
  const currentRoute = usePathname();
  const dispatch = useDispatch();

  const {
    students: fetchedStudents,
    status,
    pagination,
  } = useSelector((state) => state.student);

  const [students, setStudents] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [isModalClose, setIsModalClose] = useState(true);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [modalContent, setModalContent] = useState("addStudent");
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [studentToToggle, setStudentToToggle] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(
    studentToEdit?.student_application_status || "PENDING"
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setSelectedStatus(student.student_application_status);
    setIsViewModalOpen(true);
  };

  // Function to fetch students based on status
  const fetchStudentsByStatus = (status) => {
    let statusFilter;
    let endpoint = "/admin/all-student-applications/";

    if (status === "pending") statusFilter = "PENDING";
    else if (status === "approved") statusFilter = "APPROVED";
    else if (status === "declined") statusFilter = "REJECTED";
    else if (status === "recuring") {
      endpoint = "/admin/recuring-student-application/";
      statusFilter = null;
    }

    const params = { page: 1, pageSize: 10 };

    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter;
    }

    dispatch(fetchStudents({ ...params, endpoint }));
  };

  // Fetch students on tab change
  useEffect(() => {
    fetchStudentsByStatus(selectedTab);
  }, [selectedTab]);

  const studentApplicationStatusRef = useRef(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleActiveStatus = (student) => {
    setStudentToToggle(student);
    setIsActiveModalOpen(true);
  };

  const { mutate: updateApplicationActiveStatus } = usePut("/users", {
    onSuccess: () => dispatch(fetchStudents({ page: 1, pageSize: 10 })),
  });

  const handleConfirmToggleActiveStatus = async () => {
    const updateStatusPromise = new Promise((resolve, reject) => {
      updateApplicationActiveStatus(
        {
          id: `${studentToToggle.id}/activate-deactivate/`,
          data: {
            is_active: !studentToToggle.is_active,
          },
        },
        {
          onSuccess: () => {
            setIsModalClose(true);
            toast.success(
              `Student has been ${
                studentToToggle.is_active ? "deactivated" : "activated"
              }`
            );
            setIsActiveModalOpen(false);
          },
          onError: (error) => {
            console.error("Failed to update status:", error);
            setIsLoading(false);
            toast.error(error.response.data.detail || "An error occurred");
            toast.error(
              error.response.data.student_application_status[0]
                ? error.response.data.student_application_status[0]
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

  const { mutate: addStudent } = usePost("/students", {
    onSuccess: () => dispatch(fetchStudents({ page: 1, pageSize: 10 })),
  });

  const { mutate: deleteStudent } = useDelete("/students", {
    onSuccess: () => dispatch(fetchStudents({ page: 1, pageSize: 10 })),
  });

  const { mutate: updateApplicationStatus } = usePut2({
    onSuccess: () => fetchStudentsByStatus(selectedTab),
  });

  // useEffect(() => {
  //   dispatch(fetchStudents({ page: 1, pageSize: 10 }));
  // }, [dispatch]);

  useEffect(() => {
    if (fetchedStudents) {
      setStudents(fetchedStudents);
    }
  }, [fetchedStudents]);

  const handleEditStudentBtn = (student) => {
    setModalContent("editStudent");
    setStudentToEdit(student);
    setIsModalClose(false);
  };

  useEffect(() => {
    if (studentToEdit && studentApplicationStatusRef.current) {
      studentApplicationStatusRef.current.value =
        studentToEdit.student_application_status;
    }
  }, [studentToEdit]);

  const resetForm = () => {
    if (studentApplicationStatusRef.current) {
      studentApplicationStatusRef.current.value = "PENDING";
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      student_application_status: selectedStatus,
    };

    if (selectedStatus === "REJECTED") {
      data.student_rejection_reason = rejectionReason;
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
    }

    const updateStatusPromise = new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
      updateApplicationStatus(
        {
          url: `https://ihsaanlms.onrender.com/api/admin/student/application/${studentToEdit?.id}/update/`,
          data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          onSuccess: () => {
            setIsModalClose(true);
            toast.success("Successful!");
            resetForm();
            resolve();
          },
          onError: (error) => {
            console.error("Failed to update status:", error);
            setIsLoading(false);
            toast.error(error.response.data.detail || "An error occurred");
            toast.error(
              error.response.data.student_application_status[0]
                ? error.response.data.student_application_status[0]
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
    dispatch(fetchStudents({ page: newPage, pageSize: pagination.pageSize }));
  };

  console.log(selectedStatus, "zzzz", students);
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
                onClick={handleaddStudentBtn}
              >
                Add A Student
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
              <Tab label="Recuring" value="recuring" />
            </Tabs>

            {/* Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4">
              <div className="p-2 font-bold  bg-white">Student List</div>
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Student Name</th>
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
                <tbody>
                  {status === "loading" ? (
                    <h4 className="mt-4">Loading...</h4>
                  ) : students.length === 0 ? (
                    <h4 className="mt-4">No data available at the moment</h4>
                  ) : (
                    students.map((student, index) => (
                      <tr
                        key={index}
                        className="even:bg-gray-100 hover:bg-gray-200"
                      >
                        <td className="border px-4 py-2">{student.id}</td>
                        <td className="border px-4 py-2">
                          {student.user_details.first_name +
                            " " +
                            student.user_details.last_name}
                        </td>
                        <td className="border px-4 py-2">
                          {student.user_details.email}
                        </td>
                        <td className="border px-4 py-2">{student.gender}</td>
                        <td className="border px-4 py-2">
                          {formatQualification(student.highest_qualification)}
                        </td>
                        <td className="border px-4 py-2">
                          {student.years_of_experience}
                        </td>
                        <td className="border px-4 py-2">
                          <td className="border px-4 py-2">
                            <button
                              onClick={() => handleEditStudentBtn(student)}
                              className={`${
                                student.student_application_status ===
                                "APPROVED"
                                  ? "bg-green-500"
                                  : student.student_application_status ===
                                    "REJECTED"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              } text-white px-4 py-2 rounded-full`}
                            >
                              {student.student_application_status}
                            </button>
                          </td>
                        </td>
                        <td className="border px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              className="bg-primary text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                              onClick={() => handleViewStudent(student)}
                            >
                              View
                            </button>
                            {/* <button
                              className={`px-3 py-1 rounded-md text-white font-medium transition duration-300 ${
                                student.is_active
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-gray-600 hover:bg-gray-700"
                              }`}
                              onClick={() => handleToggleActiveStatus(student)}
                            >
                              {student.is_active ? "Active" : "Inactive"}
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
            {/* Add Student */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "addStudent" ? "block" : "hidden"
              }`}
            >
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Add Student</div>
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

            {/* Edit Student */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "editStudent" ? "block" : "hidden"
              }`}
            >
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Edit Student Status</div>
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
                    ref={studentApplicationStatusRef}
                    defaultValue={studentToEdit?.student_application_status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {studentToEdit?.student_application_status === "PENDING" ? (
                      <>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </>
                    ) : (
                      <option value={studentToEdit?.student_application_status}>
                        {studentToEdit?.student_application_status
                          .charAt(0)
                          .toUpperCase() +
                          studentToEdit?.student_application_status
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

                {studentToEdit?.student_application_status === "PENDING" && (
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

        {/* Modal for activating/deactivating student */}
        {isActiveModalOpen && (
          <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-[400px] rounded p-4">
              <div className="text-lg font-bold">
                {studentToToggle.is_active ? "Deactivate" : "Activate"} Student
              </div>
              <div className="py-4">
                Are you sure you want to{" "}
                {studentToToggle.is_active ? "deactivate" : "activate"} this
                student?
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

        {isViewModalOpen && selectedStudent && (
          <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-[500px] rounded p-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Student Details</h2>
                <button
                  className="text-red-600 hover:text-blue-600 transition-all duration-300"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
              <Divider />

              {/* Student Details */}
              <div className="py-4">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Application Status
                      </td>
                      <td className="border px-4 py-2">{selectedStatus}</td>
                    </tr>
                    {selectedStudent.student_application_status && (
                      <tr>
                        <td className="border px-4 py-2 font-semibold">
                          Reason for rejection
                        </td>
                        <td className="border px-4 py-2">
                          {selectedStudent.student_rejection_reason}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-gray-100">
                      <td className="border px-4 py-2 font-semibold">Name</td>
                      <td className="border px-4 py-2">
                        {selectedStudent.user_details.first_name}{" "}
                        {selectedStudent.user_details.last_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">Email</td>
                      <td className="border px-4 py-2">
                        {selectedStudent.user_details.email}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border px-4 py-2 font-semibold">Gender</td>
                      <td className="border px-4 py-2">
                        {selectedStudent.gender}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Qualification
                      </td>
                      <td className="border px-4 py-2">
                        {selectedStudent.highest_qualification}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Country
                      </td>
                      <td className="border px-4 py-2">
                        {selectedStudent.country}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Date of Birth
                      </td>
                      <td className="border px-4 py-2">
                        {selectedStudent.date_of_birth}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Marital Status
                      </td>
                      <td className="border px-4 py-2">
                        {selectedStudent.marital_status}
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="border px-4 py-2 font-semibold">
                        Experience
                      </td>
                      <td className="border px-4 py-2">
                        {selectedStudent.years_of_experience || "-"} years
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Professional Bio
                      </td>
                      <td className="border px-4 py-2">
                        {selectedStudent.professional_bio}
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-semibold">
                        Additional Info
                      </td>
                      <td className="border px-4 py-2">
                        {selectedStudent.additional_info}
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

export default StudentApplication;
