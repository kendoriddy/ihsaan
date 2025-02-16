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

  const [bookings, setBookings] = useState(ADMINCONSTANTS.bookings);
  const [mentors, setMentors] = useState(ADMINCONSTANTS.mentors);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [isModalClose, setIsModalClose] = useState(true);
  const [bookingToEdit, setBookingToEdit] = useState(null);

  const [modalContent, setModalContent] = useState("addBooking");

  // refs
  const mentorNameRef = useRef();
  const courseRef = useRef();
  const menteeNameRef = useRef();
  const earnedRef = useRef();
  const timeRef = useRef();
  const amountRef = useRef();

  const editMentorNameRef = useRef();
  const editCourseRef = useRef();
  const editMenteeNameRef = useRef();
  const editEarnedRef = useRef();
  const editTimeRef = useRef();
  const editAmountRef = useRef();

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddBookingBtn = () => {
    setModalContent("addBooking");
    setIsModalClose(false);
  };

  const handleEditBookingBtn = (id) => {
    setModalContent("editBooking");
    setIsModalClose(false);
    const booking = bookings.find((booking) => booking.id === id);
    setBookingToEdit(booking);
  };

  const deleteBooking = (id) => {
    const newBookings = bookings.filter((booking) => booking.id !== id);
    setBookings(newBookings);
  };

  // Add Booking
  const addBooking = (e) => {
    e.preventDefault();
    const newBooking = {
      id: uuidv4(),
      mentorName: mentorNameRef.current.value,
      course: courseRef.current.value,
      menteeName: menteeNameRef.current.value,
      earned: earnedRef.current.value,
      time: timeRef.current.value,
      amount: amountRef.current.value,
    };
    setBookings([...bookings, newBooking]);
    setIsModalClose(true);
  };

  // Update Booking
  const updateBooking = (e) => {
    e.preventDefault();
    const newBooking = {
      id: bookingToEdit.id,
      mentorName: editMentorNameRef.current.value,
      course: editCourseRef.current.value,
      menteeName: editMenteeNameRef.current.value,
      earned: editEarnedRef.current.value,
      time: editTimeRef.current.value,
      amount: editAmountRef.current.value,
    };
    const newBookings = bookings.map((booking) =>
      booking.id === bookingToEdit.id ? newBooking : booking
    );
    setBookings(newBookings);
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
                onClick={handleAddBookingBtn}>
                Add A Booking
              </div>
            </div>
            {/*  Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4">
              <div className="p-2 font-bold  bg-white">Booking List</div>
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">#</th>
                    <th className=" border px-4 py-2">Mentor Name</th>
                    <th className=" border px-4 py-2">Course</th>
                    <th className=" border px-4 py-2">Mentee Name</th>
                    <th className=" border px-4 py-2">Earned (₦) </th>
                    <th className=" border px-4 py-2">Time</th>
                    <th className=" border px-4 py-2">Amount</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className="even:bg-gray-100 hover:bg-gray-200">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{booking.mentorName}</td>
                      <td className="border px-4 py-2">{booking.course}</td>
                      <td className="border px-4 py-2">{booking.menteeName}</td>
                      <td className="border px-4 py-2">
                        {Number(booking?.earned).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {Date(booking?.time).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {Number(booking?.amount).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="flex gap-2">
                          <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => handleEditBookingBtn(booking.id)}>
                            Edit
                          </span>
                          <span
                            className="text-red-600 hover:underline cursor-pointer"
                            onClick={() => deleteBooking(booking.id)}>
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
            {/* Add Booking */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "addBooking" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Add A Booking</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form action="#" className="p-4" onSubmit={(e) => addBooking(e)}>
                {/* Mentor Name */}
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
                {/* Mentee Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="menteeName"
                    id="menteeName"
                    placeholder="Mentor Name"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={menteeNameRef}
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

                {/* Date created */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="datetime-local"
                    name="dateCreated"
                    id="dateCreated"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={timeRef}
                  />
                </div>

                {/* Amount */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    placeholder="Amount"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={amountRef}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Add A Booking
                  </button>
                </div>
              </form>
            </div>

            {/* Edit Booking */}
            <div
              className={`bg-white w-[400px] rounded ${
                modalContent === "editBooking" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Edit A Booking</div>
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
                onSubmit={(e) => updateBooking(e)}>
                {/* Mentor Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="mentorName"
                    id="mentorName"
                    placeholder="Mentor Name"
                    defaultValue={bookingToEdit?.mentorName}
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
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
                    defaultValue={bookingToEdit?.course}
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={editCourseRef}
                  />
                </div>
                {/* Mentee Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="menteeName"
                    id="menteeName"
                    placeholder="Mentor Name"
                    defaultValue={bookingToEdit?.menteeName}
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={editMenteeNameRef}
                  />
                </div>

                {/* Earned */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="number"
                    name="earned"
                    id="earned"
                    placeholder="Amount Earned"
                    defaultValue={bookingToEdit?.earned}
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={editEarnedRef}
                  />
                </div>

                {/* Date created */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="datetime-local"
                    name="dateCreated"
                    id="dateCreated"
                    defaultValue={bookingToEdit?.time}
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={editTimeRef}
                  />
                </div>

                {/* Amount */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    placeholder="Amount"
                    defaultValue={bookingToEdit?.amount}
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={editAmountRef}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Update Booking
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
