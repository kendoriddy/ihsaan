"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Layout from "@/components/Layout"; // Assuming Layout component path
import { getAuthToken } from "@/hooks/axios/axios"; // Assuming token utility path
import { IMAGES } from "@/constants";

// TODO: How to get current student's user ID?
// const getCurrentStudentId = () => { /* ... logic to get student ID ... */ return "some-student-id"; };

const LOGGED_IN_USER_ENDPOINT =
  "https://ihsaanlms.onrender.com/api/auth/logged-in-user/";
const PROGRAMMES_ENDPOINT = "https://ihsaanlms.onrender.com/programmes/";

const MyCoursesPage = () => {
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" or "programmes"
  const [isPaidMode, setIsPaidMode] = useState(true); // Temporary toggle for testing

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch logged-in user's ID
        const userResponse = await axios.get(LOGGED_IN_USER_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        const userId = userResponse.data?.id;

        if (!userId) {
          setError("Could not retrieve user information.");
          setIsLoading(false);
          return;
        }

        // 2. Fetch programmes for the user
        const programmesResponse = await axios.get(
          `${PROGRAMMES_ENDPOINT}?user=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        // Add payment status to programmes (simulated for now)
        const programmesWithPaymentStatus = (
          programmesResponse.data.results || []
        ).map((programme) => ({
          ...programme,
          is_paid: isPaidMode, // For testing, all programmes are paid when toggle is on
        }));
        setProgrammes(programmesWithPaymentStatus);

        // 3. Fetch all courses for the user (simulated for now)
        // In a real implementation, this would be an API call
        const mockCourses = [
          {
            id: 1,
            title: "Introduction to Arabic Grammar",
            description:
              "Learn the basics of Arabic grammar and sentence structure",
            programme_id: 1,
            programme_name: "Nahu Programme",
            is_paid: isPaidMode,
            image_url: null,
          },
          {
            id: 2,
            title: "Advanced Grammar Concepts",
            description: "Dive deeper into complex Arabic grammar rules",
            programme_id: 1,
            programme_name: "Nahu Programme",
            is_paid: !isPaidMode, // This one is unpaid for testing
            image_url: null,
          },
          {
            id: 3,
            title: "Quranic Arabic Basics",
            description: "Understanding Arabic as used in the Quran",
            programme_id: 2,
            programme_name: "Primary Programme",
            is_paid: isPaidMode,
            image_url: null,
          },
        ];
        setAllCourses(mockCourses);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isPaidMode]);

  const fetchCoursesForProgramme = async (programmeId) => {
    setIsLoading(true);
    setError(null);
    try {
      const coursesResponse = await axios.get(
        `https://ihsaanlms.onrender.com/programmes/${programmeId}/courses/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log(coursesResponse, "coursesResponse:::");
      setMyCourses(coursesResponse.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch courses for this programme.");
      console.error("Error fetching courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgrammeSelect = (programme) => {
    setSelectedProgramme(programme);
    fetchCoursesForProgramme(programme.id);
  };

  const handleBackToProgrammes = () => {
    setSelectedProgramme(null);
    setMyCourses([]);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {!selectedProgramme ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                My Courses & Programmes
              </h1>

              {/* Temporary toggle for testing */}
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                <span className="text-sm text-gray-600">Test Mode:</span>
                <button
                  onClick={() => setIsPaidMode(!isPaidMode)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isPaidMode
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isPaidMode ? "Paid Mode" : "Unpaid Mode"}
                </button>
              </div>
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
                    All Courses ({allCourses.length})
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

            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <p className="text-lg text-gray-600">Loading your data...</p>
              </div>
            )}

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Courses Tab Content */}
            {!isLoading && !error && activeTab === "courses" && (
              <>
                {allCourses.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-lg text-gray-600">
                      You are not currently enrolled in any courses.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.map((course) => (
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
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {course.description ||
                                "No description available."}
                            </p>
                            <div className="mt-4 text-right">
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
            {!isLoading && !error && activeTab === "programmes" && (
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
                                programme.is_paid
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {programme.is_paid ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                            {programme.name || "Untitled Programme"}
                          </h2>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {programme.description ||
                              "No description available."}
                          </p>
                          <div className="mt-4 text-right">
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

            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <p className="text-lg text-gray-600">Loading courses...</p>
              </div>
            )}

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {!isLoading && !error && myCourses.length === 0 && (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">
                  No courses available in this programme.
                </p>
              </div>
            )}

            {!isLoading && !error && myCourses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCourses.map((course) => (
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
