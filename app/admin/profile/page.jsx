"use client";

import Image from "next/image";

import { useState } from "react";
import { IMAGES } from "@/constants";
import { usePathname } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Divider from "@mui/material/Divider";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";

function Page() {
  const currentRoute = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalClose, setIsModalClose] = useState(true);

  const [activeElement, setActiveElement] = useState("about");

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setAside = () => setActiveElement("about");
  const setPassword = () => setActiveElement("password");

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
          <div>
            <div className="p-2 font-bold  bg-white">Profile List</div>

            {/* Name Box */}
            <div className="border rounded p-6">
              {/* Top */}
              <div className="flex items-center">
                <div className="min-w-[120px]">
                  <div className="w-[100px] h-[100px] rounded-full relative overflow-hidden">
                    <Image src={IMAGES.user1} alt="avatar" fill className="" />
                  </div>
                </div>
                <div>
                  <div className="py-2">
                    <div className="text-lg font-bold">Allen Span</div>
                    <div>allendavis@admin.com</div>
                  </div>
                  <div className="py-1 flex items-center">
                    {" "}
                    <span>
                      {" "}
                      <LocationOnIcon />{" "}
                    </span>{" "}
                    Osun, Nigeria
                  </div>
                  <div className="py-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </div>
                </div>
              </div>

              <Divider />

              {/* Bottom */}
              <div className="pt-3 flex gap-4 items-center">
                <span
                  className={`cursor-pointer  ${
                    activeElement === "about" &&
                    "bg-red-600 px-3 py-2 rounded text-white inline-block"
                  }`}
                  onClick={setAside}>
                  About
                </span>
                <span
                  className={`cursor-pointer ${
                    activeElement == "password" &&
                    "bg-red-600 px-3 py-2 rounded text-white inline-block"
                  }`}
                  onClick={setPassword}>
                  Password
                </span>
              </div>
            </div>

            {/* Personal Details - About Bottom */}
            <div
              className={`border rounded p-6 mt-8 ${
                activeElement === "about" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div className="flex justify-between items-center">
                <div className="text-lg">Personal Details</div>
                <div
                  onClick={() => setIsModalClose(false)}
                  className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300">
                  <span>
                    {" "}
                    <EditNoteIcon />{" "}
                  </span>
                  <span> Edit </span>
                </div>
              </div>

              {/* Others */}
              <div>
                <div className="py-2 flex items-center ">
                  <div className="min-w-[120px]">Full Name</div>
                  <div>Allen Span</div>
                </div>
                <div className="py-2 flex items-center">
                  <div className="min-w-[120px] ">Date of Birth</div>
                  <div>24 July, 1994 </div>
                </div>
                <div className="py-2 flex items-center">
                  <div className="min-w-[120px] ">Email</div>
                  <div>johndoe@example.com </div>
                </div>
                <div className="py-2 flex items-center">
                  <div className="min-w-[120px] ">Mobile</div>
                  <div>305-310-5857 </div>
                </div>
                <div className="py-2 flex items-center">
                  <div className="min-w-[120px] ">Address</div>
                  <div>
                    4663 Agriculture Lane, Miami, Florida - 33165, United
                    States.{" "}
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div
              className={`border rounded p-6 mt-8 ${
                activeElement === "password" ? "block" : "hidden"
              }`}>
              {/* Top */}
              <div className="flex justify-between items-center">
                <div className="text-lg">Change Password</div>
              </div>

              {/* Others */}
              <div>
                <form action="#" className="pt-4">
                  {/* Old Password */}
                  <div className=" flex gap-4 flex-col lg:flex-row py-3">
                    <input
                      type="text"
                      name="password"
                      id="password"
                      placeholder="Old Password"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded max-w-[300px]"
                    />
                  </div>
                  <div className=" flex gap-4 flex-col lg:flex-row py-3">
                    <input
                      type="text"
                      name="newPassword"
                      id="newPassword"
                      placeholder="New Password"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded max-w-[300px]"
                    />
                  </div>
                  <div className=" flex gap-4 flex-col lg:flex-row py-3">
                    <input
                      type="text"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="Confirm Password"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded max-w-[300px]"
                    />
                  </div>
                  {/* Submit Buttons */}
                  <div className="flex  py-4">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
            isModalClose && "hidden"
          }`}>
          <div className="w-screen h-screen flex justify-center items-center  p-4  ">
            <div className="bg-white w-4/5 h-4/5 rounded overflow-y-scroll">
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Add New Mentor</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form action="#" className="p-4">
                {/* Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="First Name"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Last Name"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* Name */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="date"
                    name="DOB"
                    id="DOB"
                    placeholder="Date of Birth"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    aria-label="Date of Birth"
                  />
                </div>

                {/* Email */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email Address"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                  <input
                    type="number"
                    name="mobile"
                    id="mobile"
                    placeholder="Phone Number"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                <div className="p-4 max-w-[500px] mx-auto">
                  <Divider> Address </Divider>
                </div>

                {/* Address */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder=" Address"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* City */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="City"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                  <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="State"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* Zip code */}
                <div className="flex gap-4 flex-col lg:flex-row py-3">
                  <input
                    type="number"
                    name="zipcode"
                    id="zipcode"
                    placeholder="Zip Code"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                  <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Country"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
