"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { fetchTutors } from "@/utils/redux/slices/tutorSlice";
import { useDelete, usePost, usePut } from "@/hooks/useHttp/useHttp";
import { toast } from "react-toastify";

const TutorApplication = () => {
  const currentRoute = usePathname();
  const dispatch = useDispatch();

  const {
    tutors: fetchedTutors,
    status,
    pagination,
  } = useSelector((state) => state.tutor);

  const [tutors, setTutors] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [isModalClose, setIsModalClose] = useState(true);
  const [tutorToEdit, setTutorToEdit] = useState(null);
  const [modalContent, setModalContent] = useState("addTutor");
  const [isLoading, setIsLoading] = useState(false);

  const tutorApplicationStatusRef = useRef();

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { mutate: addTutor } = usePost("/tutors", {
    onSuccess: () => dispatch(fetchTutors({ page: 1, pageSize: 10 })),
  });

  const { mutate: deleteTutor } = useDelete("/tutors", {
    onSuccess: () => dispatch(fetchTutors({ page: 1, pageSize: 10 })),
  });

  const { mutate: updateApplicationStatus } = usePut("/update-tutor-status", {
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

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Wrap mutate in a Promise to handle errors properly
    const updateStatusPromise = new Promise((resolve, reject) => {
      updateApplicationStatus(
        {
          id: `${tutorToEdit.id}/`,
          data: {
            tutor_application_status: tutorApplicationStatusRef.current.value,
          },
        },
        {
          onSuccess: () => {
            setIsModalClose(true);
            resolve();
          },
          onError: (error) => {
            console.error("Failed to update status:", error);
            toast.error(
              error.response.data.tutor_application_status[0] ||
                "An error occurred"
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

  const handlePageChange = (newPage) => {
    dispatch(fetchTutors({ page: newPage, pageSize: pagination.pageSize }));
  };

  console.log(fetchedTutors, "zzzz", tutors);
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
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold"></div>
              <div
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                // onClick={handleAddTutorBtn}
              >
                Add A Tutor
              </div>
            </div>
            {/* Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4">
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
                  {tutors.map((tutor, index) => (
                    <tr
                      key={tutor.id}
                      className="even:bg-gray-100 hover:bg-gray-200"
                    >
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {tutor.first_name + " " + tutor.last_name}
                      </td>
                      <td className="border px-4 py-2">{tutor.email}</td>
                      <td className="border px-4 py-2">{tutor.gender}</td>
                      <td className="border px-4 py-2">
                        {tutor.highest_qualification}
                      </td>
                      <td className="border px-4 py-2">
                        {tutor.professional_bio}
                      </td>
                      <td className="border px-4 py-2">
                        {tutor.tutor_application_status}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex gap-2">
                          <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleEditTutorBtn(tutor)}
                          >
                            Edit
                          </span>
                          <span
                            className="text-red-600 hover:underline cursor-pointer"
                            onClick={() => deleteTutor(tutor.id)}
                          >
                            {" "}
                            Delete
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <div className="text-lg font-bold">Edir Tutor</div>
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
                    className="w-full p-2 border rounded"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    {isLoading ? "Loading..." : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TutorApplication;
