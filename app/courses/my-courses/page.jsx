"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Layout from "@/components/Layout"; // Assuming Layout component path
import { IMAGES } from "@/constants";
import {
  fetchStudentCourses,
  fetchStudentProgrammes,
  fetchCoursesForProgramme,
  setSelectedProgramme,
  clearSelectedProgramme,
  clearCoursesError,
  clearProgrammesError,
  clearProgrammeCoursesError,
} from "@/utils/redux/slices/studentDashboardSlice";

const MyCoursesPage = () => {
  const dispatch = useDispatch();
  const {
    courses,
    programmes,
    programmeCourses,
    coursesStatus,
    programmesStatus,
    programmeCoursesStatus,
    coursesError,
    programmesError,
    programmeCoursesError,
    selectedProgramme,
    isLoading,
  } = useSelector((state) => state.studentDashboard);

  const [activeTab, setActiveTab] = useState("courses"); // "courses" or "programmes"

  // Fetch data on component mount
  useEffect(() => {
    // Only fetch if data is not already loaded
    if (coursesStatus === "idle") {
      dispatch(fetchStudentCourses());
    }
    if (programmesStatus === "idle") {
      dispatch(fetchStudentProgrammes());
    }
  }, [dispatch, coursesStatus, programmesStatus]);

  const handleProgrammeSelect = (programme) => {
    dispatch(setSelectedProgramme(programme));
    dispatch(fetchCoursesForProgramme(programme.id));
  };

  const handleBackToProgrammes = () => {
    dispatch(clearSelectedProgramme());
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {!selectedProgramme ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                My Courses & Programmes
              </h1>
            </div>

            {/* Tab System */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("courses")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "courses"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    All Courses ({courses.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("programmes")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "programmes"
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Programmes ({programmes.length})
                  </button>
                </nav>
              </div>
            </div>

            {(coursesStatus === "loading" ||
              programmesStatus === "loading") && (
              <div className="flex justify-center items-center py-10">
                <p className="text-lg text-gray-600">Loading your data...</p>
              </div>
            )}

            {(coursesError || programmesError) && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">
                  {coursesError || programmesError}
                </span>
                <button
                  onClick={() => {
                    dispatch(clearCoursesError());
                    dispatch(clearProgrammesError());
                  }}
                  className="absolute top-0 right-0 px-4 py-3"
                >
                  <span className="sr-only">Dismiss</span>×
                </button>
              </div>
            )}

            {/* Courses Tab Content */}
            {coursesStatus !== "loading" &&
              programmesStatus !== "loading" &&
              !coursesError &&
              !programmesError &&
              activeTab === "courses" && (
                <>
                  {courses.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-lg text-gray-600">
                        You are not currently enrolled in any courses.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/my-courses/${course.id}`}
                          legacyBehavior
                        >
                          <a className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                            <div className="relative w-full h-48 bg-gray-200">
                              {/*} {course.image_url ? (
                                <Image
                                  src={course.image_url}
                                  alt={course.title || "Course image"}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              ) : (
                                <Image
                                  src={IMAGES.logo}
                                  alt={course.title || "Course image"}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              )}*/}
                              {/* Payment Status Badge */}
                              <div className="absolute top-2 right-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    course.is_paid
                                      ? "bg-green-500 text-white"
                                      : "bg-red-500 text-white"
                                  }`}
                                >
                                  {course.is_paid ? "Paid" : "Unpaid"}
                                </span>
                              </div>
                            </div>
                            <div className="p-6">
                              <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                                {course.title || "Untitled Course"}
                              </h2>
                              <p className="text-gray-600 text-sm mb-2">
                                {course.programme_name}
                              </p>
                              {course.term_details && (
                                <p className="text-gray-500 text-xs mb-2">
                                  Term: {course.term_details.name} (
                                  {course.term_details.start_date} -{" "}
                                  {course.term_details.end_date})
                                </p>
                              )}
                              <p className="text-gray-600 text-sm line-clamp-3">
                                {course.description ||
                                  "No description available."}
                              </p>
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Enrolled:{" "}
                                  {new Date(
                                    course.enrolled_at
                                  ).toLocaleDateString()}
                                </span>
                                <span
                                  className={`inline-block text-sm font-medium py-1 px-3 rounded-full transition-colors ${
                                    course.is_paid
                                      ? "bg-primary group-hover:bg-primary text-white"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  {course.is_paid
                                    ? "View Course"
                                    : "Payment Required"}
                                </span>
                              </div>
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}

            {/* Programmes Tab Content */}
            {coursesStatus !== "loading" &&
              programmesStatus !== "loading" &&
              !coursesError &&
              !programmesError &&
              activeTab === "programmes" && (
                <>
                  {programmes.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-lg text-gray-600">
                        You are not currently enrolled in any programmes.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {programmes.map((programme) => (
                        <button
                          key={programme.id}
                          onClick={() => handleProgrammeSelect(programme)}
                          className="block w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group text-left"
                        >
                          <div className="relative w-full h-48 bg-gray-200">
                            {programme.image_url ? (
                              <Image
                                src={programme.image_url}
                                alt={programme.name || "Programme image"}
                                layout="fill"
                                objectFit="cover"
                              />
                            ) : (
                              <Image
                                src={IMAGES.logo}
                                alt={programme.name || "Programme image"}
                                layout="fill"
                                objectFit="cover"
                              />
                            )}
                            {/* Payment Status Badge */}
                            <div className="absolute top-2 right-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  programme.payment_status === "PAID" ||
                                  programme.payment_status === "COMPLETED"
                                    ? "bg-green-500 text-white"
                                    : programme.payment_status === "PENDING"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                              >
                                {programme.payment_status === "PAID" ||
                                programme.payment_status === "COMPLETED"
                                  ? "Paid"
                                  : programme.payment_status === "PENDING"
                                  ? "Pending"
                                  : "Unpaid"}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                              {programme.name || "Untitled Programme"}
                            </h2>
                            <p className="text-gray-600 text-sm mb-2">
                              Code: {programme.code}
                            </p>
                            {/* <p className="text-gray-600 text-sm mb-2">
                              {programme.description}
                            </p> */}
                            {programme.payment_status && (
                              <div className="mb-2">
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    programme.payment_status === "PAID" ||
                                    programme.payment_status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : programme.payment_status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {programme.payment_status}
                                </span>
                                {programme.completed && (
                                  <span className="ml-2 inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Completed
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Enrolled:{" "}
                                {new Date(
                                  programme.enrollment_date
                                ).toLocaleDateString()}
                              </span>
                              <span className="inline-block bg-primary group-hover:bg-primary text-white text-sm font-medium py-1 px-3 rounded-full transition-colors">
                                View Courses
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
          </>
        ) : (
          <>
            <div className="flex items-center mb-8">
              <button
                onClick={handleBackToProgrammes}
                className="mr-4 text-primary hover:text-primary-dark flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Programmes
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Courses in {selectedProgramme.name}
              </h1>
            </div>

            {programmeCoursesStatus === "loading" && (
              <div className="flex justify-center items-center py-10">
                <p className="text-lg text-gray-600">Loading courses...</p>
              </div>
            )}

            {programmeCoursesError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{programmeCoursesError}</span>
                <button
                  onClick={() => dispatch(clearProgrammeCoursesError())}
                  className="absolute top-0 right-0 px-4 py-3"
                >
                  <span className="sr-only">Dismiss</span>×
                </button>
              </div>
            )}

            {programmeCoursesStatus !== "loading" &&
              !programmeCoursesError &&
              programmeCourses.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-600">
                    No courses available in this programme.
                  </p>
                </div>
              )}

            {programmeCoursesStatus !== "loading" &&
              !programmeCoursesError &&
              programmeCourses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {programmeCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/my-courses/${course.id}`}
                      legacyBehavior
                    >
                      <a className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                        <div className="relative w-full h-48 bg-gray-200">
                          {course.image_url ? (
                            <Image
                              src={course.image_url}
                              alt={course.title || "Course image"}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <Image
                              src={IMAGES.logo}
                              alt={course.title || "Course image"}
                              layout="fill"
                              objectFit="cover"
                            />
                          )}
                        </div>
                        <div className="p-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                            {course.title || "Untitled Course"}
                          </h2>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {course.description || "No description available."}
                          </p>
                          <div className="mt-4 text-right">
                            <span className="inline-block bg-primary group-hover:bg-primary text-white text-sm font-medium py-1 px-3 rounded-full transition-colors">
                              View Course
                            </span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyCoursesPage;
