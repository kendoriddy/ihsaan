"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Layout from "@/components/Layout"; // Assuming Layout component path
import { getAuthToken } from "@/hooks/axios/axios"; // Assuming token utility path

// TODO: How to get current student's user ID?
// const getCurrentStudentId = () => { /* ... logic to get student ID ... */ return "some-student-id"; };

const LOGGED_IN_USER_ENDPOINT =
  "https://ihsaanlms.onrender.com/api/auth/logged-in-user/";
const ALL_COURSES_ENDPOINT = "https://ihsaanlms.onrender.com/course/courses/";

const MyCoursesPage = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch logged-in user's ID
        const userResponse = await axios.get(LOGGED_IN_USER_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        const studentId = userResponse.data?.id;

        if (!studentId) {
          setError("Could not retrieve student information.");
          setIsLoading(false);
          return;
        }

        // 2. Fetch all courses
        const coursesResponse = await axios.get(ALL_COURSES_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        const allCourses = coursesResponse.data.results || [];

        // 3. Filter courses by studentId
        const enrolledCourses = allCourses.filter(
          (course) =>
            course.enrolled_users && course.enrolled_users.includes(studentId)
        );

        setMyCourses(enrolledCourses);
      } catch (err) {
        setError(err.message || "Failed to fetch your courses.");
        console.error("Error fetching my courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <p className="text-lg text-gray-600">Loading your courses...</p>
            {/* You can add a spinner component here */}
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
              You are not currently enrolled in any courses.
            </p>
            <Link href="/all-courses" legacyBehavior>
              {" "}
              {/* Assuming you have a page listing all available courses */}
              <a className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded transition duration-150">
                Browse Available Courses
              </a>
            </Link>
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
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>No Image Available</span>
                      </div>
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
                      <span className="inline-block bg-primary group-hover:bg-primary text-primary group-hover:text-white text-sm font-medium py-1 px-3 rounded-full transition-colors">
                        View Course
                      </span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCoursesPage;
