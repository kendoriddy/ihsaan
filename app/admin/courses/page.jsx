"use client";

import Image from "next/image";

import { useState } from "react";
import { COURSES } from "@/constants";
import { usePathname } from "next/navigation";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Button from "@/components/Button";

function Page() {
  const currentRoute = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseIdx, setcourseIdx] = useState([0, 6]);

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const [isAddCourseModalClose, setIsAddCourseModalClose] = useState(true);
  const [isEditCourseModalClose, setIsEditCourseModalClose] = useState(true);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (event, value) => {
    setcourseIdx([(value - 1) * 6, value * 6]);
  };

  const handleEditBtn = (id) => {
    // Open the modal
    setIsEditCourseModalClose(false);
    // Get the FAQ
    // const FAQ = FAQs.find((FAQ) => FAQ.id === id);

    // setFAQToEdit(FAQ);
  };

  const handleAddCourseBtn = () => {
    console.log("Clicked");
    setIsAddCourseModalClose(false);
  };

  // Add Course
  const addCourse = async (e) => {
    e.preventDefault();
    // const newFAQ = {
    //   title: titleRef.current.value,
    //   content: contentRef.current.value,
    // };

    // try {
    //   await fetch("/api/faqs/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(newFAQ),
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    // // Clear input fields
    // titleRef.current.value = "";
    // contentRef.current.value = "";

    // // Fetch Quotes
    // getFAQs();
  };

  // update Course
  const updateCourse = async (e) => {
    e.preventDefault();

    // const editedCourse = {
    //   title: editTitleRef.current.value,
    //   content: editContentRef.current.value,
    // };

    // try {
    //   await fetch(`/api/faqs/${FAQToEdit.id}`, {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(editedFAQ),
    //   });
    //   // Reload the page
    //   window.location.reload();
    // } catch (error) {
    //   console.log(error);
    // }
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
          {/* Content Goes Here */}
          <div className="p-4">
            {/*   Top */}
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">Courses</div>
              <Button
                className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                onClick={() => handleAddCourseBtn()}>
                Add Course
              </Button>
            </div>

            {/* LIST COURSES */}
            <section className="py-12 ">
              <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8">
                {COURSES.slice(courseIdx[0], courseIdx[1]).map((course) => (
                  <div
                    key={course.id}
                    className="group shadow-xl w-[250px] rounded-md overflow-hidden mt-8 bg-gray-100 ">
                    <div className=" w-full h-[200px] relative">
                      <Image
                        src={course.image}
                        // width={200}
                        // height={300}
                        fill
                        alt={course.title}
                        objectFit="cover"
                      />
                    </div>
                    {/* course bottom */}
                    <div className="px-2 py-2">
                      <div className="text-xm text-red-600">
                        {course.category}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {course.title}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-600 py-2">
                        {/* By {course.author.name} */}
                      </div>

                      {/* Created Date */}
                      <div className="text-xs py-2 text-neutral-600">
                        Created on: {course.createdAt}
                      </div>

                      <div className="flex justify-between items-center py-2 text-xs">
                        <div
                          className="px-3 py-2 border-2 border-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-300 rounded "
                          onClick={() => handleEditBtn(course?.id)}>
                          Edit
                        </div>
                        <div className="bg-red-600 px-3 py-2 text-white cursor-pointer hover:bg-red-800 transition-all duration-300 rounded">
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pagination */}
            <section className="pt-4 pb-12">
              <div className="w-4/5 mx-auto border flex flex-col lg:flex-row justify-between items-center px-4 rounded">
                <div>Total COURSES: {COURSES.length}</div>
                <div>
                  <Stack spacing={2} className="py-5">
                    <Pagination
                      count={Math.ceil(COURSES.length / 6)}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleChange}
                    />
                  </Stack>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Add Course Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
            isAddCourseModalClose && "hidden"
          }`}>
          <div className="w-screen h-screen flex justify-center items-center  p-4  ">
            <div className="bg-white w-[90%] h-[90%] rounded overflow-y-scroll ">
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Add Course</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsAddCourseModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form action="#" className="p-4" onSubmit={(e) => addCourse(e)}>
                {/* Title/Question */}
                <div className="py-3">
                  {/* <input
                    type="text"
                    name="text"
                    id="title"
                    placeholder="Title/Question"
                    className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={titleRef}
                  /> */}
                </div>

                {/* Content */}
                <div className=" flex gap-4 flex-col lg:flex-row py-3">
                  {/* <textarea
                    name="text"
                    id="content"
                    cols="30"
                    rows="10"
                    placeholder="Content"
                    className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={contentRef}
                  /> */}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <Button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Add
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Edit course Modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
            isEditCourseModalClose && "hidden"
          }`}>
          <div className="w-screen h-screen flex justify-center items-center  p-4  ">
            <div className="bg-white w-[90%] h-[90%] rounded overflow-y-scroll ">
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Edit Book</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsEditCourseModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              <form
                action="#"
                className="p-4"
                onSubmit={(e) => updateCourse(e)}>
                {/* Title/Question */}

                <div className="py-3">
                  {/* <input
                    type="text"
                    name="text"
                    id="title"
                    placeholder="Title/Question"
                    className="flex-1 w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={editTitleRef}
                    defaultValue={FAQToEdit?.title}
                  /> */}
                </div>

                {/* Content */}
                <div className=" flex gap-4 flex-col lg:flex-row py-3">
                  {/* <textarea
                    name="text"
                    id="content"
                    cols="30"
                    rows="10"
                    placeholder="Content"
                    className="w-full bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    ref={editContentRef}
                    defaultValue={FAQToEdit?.content}
                  /> */}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <Button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Update Book
                  </Button>
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
