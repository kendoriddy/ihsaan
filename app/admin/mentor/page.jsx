"use client";

import { useState, useRef } from "react";
import { ADMINCONSTANTS } from "@/constants";
import { v4 as uuidv4, v4 } from "uuid";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Divider from "@mui/material/Divider";

function Page() {
  const currentRoute = usePathname();

  const [mentors, setMentors] = useState(ADMINCONSTANTS.mentors);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [isModalClose, setIsModalClose] = useState(true);
  const [mentorToEdit, setMentorToEdit] = useState(null);

  const [modalContent, setModalContent] = useState("addMentor");

  // refs
  const mentorNameRef = useRef();
  const courseRef = useRef();
  const dateCreatedRef = useRef();
  const earnedRef = useRef();
  const accountStatusRef = useRef();
  const accountRef = useRef();

  const editMentorNameRef = useRef();
  const editCourseRef = useRef();
  const editDateCreatedRef = useRef();
  const editEarnedRef = useRef();
  const editAccountStatusRef = useRef();
  const editAccountRef = useRef();

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddMentorBtn = () => {
    setModalContent("addMentor");
    setIsModalClose(false);
  };

  const handleEditMentorBtn = (id) => {
    setModalContent("editMentor");
    setIsModalClose(false);
    const mentor = mentors.find((mentor) => mentor.id === id);
    setMentorToEdit(mentor);
  };

  const deleteMentor = (id) => {
    const newMentors = mentors.filter((mentor) => mentor.id !== id);
    setMentors(newMentors);
  };

  // Add Mentor
  const addMentor = (e) => {
    e.preventDefault();
    const newMentor = {
      id: uuidv4(),
      name: mentorNameRef.current.value,
      course: courseRef.current.value,
      memeberSince: dateCreatedRef.current.value,
      earned: earnedRef.current.value,
      accountStatus: accountStatusRef.current.value,
      account: accountRef.current.value,
    };
    setMentors([...mentors, newMentor]);
    setIsModalClose(true);
  };

  // Update Mentor
  const updateMentor = (e) => {
    e.preventDefault();
    const newMentor = {
      id: mentorToEdit.id,
      name: editMentorNameRef.current.value,
      course: editCourseRef.current.value,
      memeberSince: editDateCreatedRef.current.value,
      earned: editEarnedRef.current.value,
      accountStatus: editAccountStatusRef.current.value,
      account: editAccountRef.current.value,
    };
    const newMentors = mentors.map((mentor) =>
      mentor.id === mentorToEdit.id ? newMentor : mentor
    );
    setMentors(newMentors);
    setIsModalClose(true);
  };

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
        {/* Main Body */}
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}>
          {/*  */}
          <div className="p-4">
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold"></div>
              <div
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                onClick={handleAddMentorBtn}>
                Add A Mentor
              </div>
            </div>
            {/*  Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4">
              <div className="p-2 font-bold  bg-white">Mentor List</div>
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Mentor Name</th>
                    <th className=" border px-4 py-2">Course</th>
                    <th className=" border px-4 py-2">Member Since</th>
                    <th className=" border px-4 py-2">Earned (₦) </th>
                    <th className=" border px-4 py-2">Account Status</th>
                    <th className=" border px-4 py-2">Account</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mentors.map((mentor, index) => (
                    <tr
                      key={mentor.id}
                      className="even:bg-gray-100 hover:bg-gray-200">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{mentor.name}</td>
                      <td className="border px-4 py-2">{mentor.course}</td>
                      <td className="border px-4 py-2">
                        {mentor.memeberSince}
                      </td>
                      <td className="border px-4 py-2">
                        {Number(mentor?.earned).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {mentor.accountStatus}
                      </td>
                      <td className="border px-4 py-2">{mentor.account}</td>
                      <td className="border px-4 py-2">
                        <div className="flex gap-2">
                          <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleEditMentorBtn(mentor.id)}>
                            Edit
                          </span>
                          <span
                            className="text-red-600 hover:underline cursor-pointer"
                            onClick={() => deleteMentor(mentor.id)}>
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
          }`}>
          <div className="w-screen h-screen flex justify-center items-center  p-4  ">
            {/* Add Mentor */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "addMentor" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Add Mentor</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form action="#" className="p-4" onSubmit={(e) => addMentor(e)}>
                {/* Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="mentorName"
                    id="mentorName"
                    placeholder="Mentor Name"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={mentorNameRef}
                  />
                </div>
                {/* Course */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="course"
                    id="course"
                    placeholder="Course"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={courseRef}
                  />
                </div>

                {/* Date created */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="date"
                    name="dateCreated"
                    id="dateCreated"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={dateCreatedRef}
                  />
                </div>
                {/* Earned */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="number"
                    name="earned"
                    id="earned"
                    placeholder="Amount Earned"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={earnedRef}
                  />
                </div>
                {/* Account Status */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <select
                    name="accountStatus"
                    id="accountStatus"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={accountStatusRef}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {/* Account */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="account"
                    id="account"
                    placeholder="Account"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={accountRef}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Add Mentor
                  </button>
                </div>
              </form>
            </div>

            {/* Edit Mentor */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "editMentor" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Edir Mentor</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form
                action="#"
                className="p-4"
                onSubmit={(e) => updateMentor(e)}>
                {/* Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="mentorName"
                    id="mentorName"
                    placeholder="Mentor Name"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={mentorToEdit?.name}
                    ref={editMentorNameRef}
                  />
                </div>
                {/* Course */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="course"
                    id="course"
                    placeholder="Course"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={mentorToEdit?.course}
                    ref={editCourseRef}
                  />
                </div>

                {/* Date created */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="date"
                    name="dateCreated"
                    id="dateCreated"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={mentorToEdit?.memeberSince}
                    ref={editDateCreatedRef}
                  />
                </div>
                {/* Earned */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="number"
                    name="earned"
                    id="earned"
                    placeholder="Amount Earned"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={mentorToEdit?.earned}
                    ref={editEarnedRef}
                  />
                </div>
                {/* Account Status */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <select
                    name="accountStatus"
                    id="accountStatus"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={mentorToEdit?.accountStatus}
                    ref={editAccountStatusRef}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {/* Account */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="account"
                    id="account"
                    placeholder="Account"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={mentorToEdit?.account}
                    ref={editAccountRef}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Update Mentor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
