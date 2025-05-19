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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgrammes = async () => {
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
        setProgrammes(programmesResponse.data.results || []);
      } catch (err) {
        setError(err.message || "Failed to fetch programmes.");
        console.error("Error fetching programmes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              My Programmes
            </h1>

            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <p className="text-lg text-gray-600">
                  Loading your programmes...
                </p>
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

            {!isLoading && !error && programmes.length === 0 && (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">
                  You are not currently enrolled in any programmes.
                </p>
              </div>
            )}

            {!isLoading && !error && programmes.length > 0 && (
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
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                        {programme.name || "Untitled Programme"}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {programme.description || "No description available."}
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
                    href={`/courses/${course.id}`}
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
