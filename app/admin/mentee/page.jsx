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

  const [mentees, setMentees] = useState(ADMINCONSTANTS.mentees);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [isModalClose, setIsModalClose] = useState(true);
  const [menteeToEdit, setMenteeToEdit] = useState(null);

  const [modalContent, setModalContent] = useState("addMentor");

  // refs
  const menteeNameRef = useRef();
  const courseRef = useRef();
  const dateCreatedRef = useRef();
  const earnedRef = useRef();
  const accountStatusRef = useRef();
  const accountRef = useRef();
  const editMenteeNameRef = useRef();
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

  const handleAddMenteeBtn = () => {
    setModalContent("addMentor");
    setIsModalClose(false);
  };

  const handleEditMenteeBtn = (id) => {
    setModalContent("editMentor");
    setIsModalClose(false);
    const mentee = mentees.find((mentee) => mentee.id === id);
    setMenteeToEdit(mentee);
  };

  const deleteMentor = (id) => {
    const newMentees = mentees.filter((mentee) => mentee.id !== id);
    setMentees(newMentees);
  };

  // Add Mentee
  const addCategory = (e) => {
    e.preventDefault();
    const newMentee = {
      id: uuidv4(),
      name: menteeNameRef.current.value,
      course: courseRef.current.value,
      memeberSince: dateCreatedRef.current.value,
      earned: earnedRef.current.value,
      accountStatus: accountStatusRef.current.value,
      account: accountRef.current.value,
    };
    setMentees([...mentees, newMentee]);
    setIsModalClose(true);
  };

  // Update Mentee
  const updateMentee = (e) => {
    e.preventDefault();
    const newMentee = {
      id: menteeToEdit.id,
      name: editMenteeNameRef.current.value,
      course: editCourseRef.current.value,
      memeberSince: editDateCreatedRef.current.value,
      earned: editEarnedRef.current.value,
      accountStatus: editAccountStatusRef.current.value,
      account: editAccountRef.current.value,
    };
    const newMentees = mentees.map((mentee) =>
      mentee.id === menteeToEdit.id ? newMentee : mentee
    );
    setMentees(newMentees);
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
                onClick={handleAddMenteeBtn}>
                Add A Mentee
              </div>
            </div>
            {/*  Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4">
              <div className="p-2 font-bold  bg-white">Mentee List</div>
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Mentee Name</th>
                    <th className=" border px-4 py-2">Course</th>
                    <th className=" border px-4 py-2">Member Since</th>
                    <th className=" border px-4 py-2">Earned (₦) </th>
                    <th className=" border px-4 py-2">Account Status</th>
                    <th className=" border px-4 py-2">Account</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mentees.map((mentee, index) => (
                    <tr
                      key={mentee.id}
                      className="even:bg-gray-100 hover:bg-gray-200">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{mentee.name}</td>
                      <td className="border px-4 py-2">{mentee.course}</td>
                      <td className="border px-4 py-2">
                        {mentee.memeberSince}
                      </td>
                      <td className="border px-4 py-2">
                        {Number(mentee?.earned).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {mentee.accountStatus}
                      </td>
                      <td className="border px-4 py-2">{mentee.account}</td>
                      <td className="border px-4 py-2">
                        <div className="flex gap-2">
                          <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleEditMenteeBtn(mentee.id)}>
                            Edit
                          </span>
                          <span
                            className="text-red-600 hover:underline cursor-pointer"
                            onClick={() => deleteMentor(mentee.id)}>
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
            {/* Add Mentee */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "addMentor" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Add Mentee</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form action="#" className="p-4" onSubmit={(e) => addCategory(e)}>
                {/* Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="mentorName"
                    id="mentorName"
                    placeholder="Mentee Name"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={menteeNameRef}
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
                    Add Mentee
                  </button>
                </div>
              </form>
            </div>

            {/* Edit Mentee */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "editMentor" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Edir Mentee</div>
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
                onSubmit={(e) => updateMentee(e)}>
                {/* Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="mentorName"
                    id="mentorName"
                    placeholder="Mentee Name"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={menteeToEdit?.name}
                    ref={editMenteeNameRef}
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
                    defaultValue={menteeToEdit?.course}
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
                    defaultValue={menteeToEdit?.memeberSince}
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
                    defaultValue={menteeToEdit?.earned}
                    ref={editEarnedRef}
                  />
                </div>
                {/* Account Status */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <select
                    name="accountStatus"
                    id="accountStatus"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    defaultValue={menteeToEdit?.accountStatus}
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
                    defaultValue={menteeToEdit?.account}
                    ref={editAccountRef}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Update Mentee
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
