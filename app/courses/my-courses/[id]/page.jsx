"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useDispatch } from "react-redux";
import Layout from "@/components/Layout";
import { getAuthToken } from "@/hooks/axios/axios";
import { IMAGES } from "@/constants";
import AssessmentModal from "@/components/AssessmentModal";
import AssessmentButton from "@/components/AssessmentButton";
import { setAssessmentResults } from "@/utils/redux/slices/assessmentSlice";
import {
  FaPlay,
  FaPause,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const courseId = params.id;

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isPaid, setIsPaid] = useState(true); // Temporary for testing
  const [assessmentModal, setAssessmentModal] = useState({
    isOpen: false,
    section: null,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchCourseDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://ihsaanlms.onrender.com/course/courses/${courseId}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      // Log the response to debug any object fields
      console.log("Course details:", response.data);

      // Check for any object fields that might cause rendering issues
      const courseData = response.data;
      Object.keys(courseData).forEach((key) => {
        if (typeof courseData[key] === "object" && courseData[key] !== null) {
          console.log(`Field "${key}" is an object:`, courseData[key]);
        }
      });

      setCourse(courseData);
    } catch (err) {
      setError(err.message || "Failed to fetch course details.");
      console.error("Error fetching course details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      // Simulate payment status based on course ID for testing
      // Course ID 2 is unpaid, others are paid
      setIsPaid(courseId !== "2");
    }
  }, [courseId, fetchCourseDetails]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleVideoPlay = (videoId) => {
    setPlayingVideo(playingVideo === videoId ? null : videoId);

    // If starting to play (not pausing), request fullscreen
    if (playingVideo !== videoId) {
      // Use setTimeout to ensure the video element is rendered with controls
      setTimeout(() => {
        const videoElement = document.querySelector(
          `video[data-video-id="${videoId}"]`
        );
        if (videoElement && videoElement.requestFullscreen) {
          videoElement.requestFullscreen().catch((err) => {
            console.log("Fullscreen request failed:", err);
          });
        }
      }, 100);
    }
  };

  const handleStartAssessment = (section) => {
    setAssessmentModal({
      isOpen: true,
      section: section,
    });
  };

  const handleCloseAssessment = () => {
    setAssessmentModal({
      isOpen: false,
      section: null,
    });
  };

  const handleAssessmentComplete = (results) => {
    // Assessment completed successfully
    console.log("Assessment completed:", results);

    // Update Redux state with assessment results
    if (results && assessmentModal.section) {
      dispatch(
        setAssessmentResults({
          sectionId: assessmentModal.section.id,
          results: results,
        })
      );
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return "Unknown";
    return duration;
  };

  const getFileIcon = (mediaUrl) => {
    if (!mediaUrl) return <FaFile className="w-6 h-6 text-gray-400" />;

    if (mediaUrl.endsWith(".pdf")) {
      return <FaFilePdf className="w-6 h-6 text-red-500" />;
    } else if (mediaUrl.match(/\.(docx?|odt)$/i)) {
      return <FaFileWord className="w-6 h-6 text-blue-500" />;
    } else if (mediaUrl.match(/\.(xlsx?|ods)$/i)) {
      return <FaFileExcel className="w-6 h-6 text-green-500" />;
    } else {
      return <FaFile className="w-6 h-6 text-gray-400" />;
    }
  };

  // Safe rendering function to handle object fields
  const safeRender = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "object") {
      if (Array.isArray(value)) return value.length;
      return "Object";
    }
    return String(value);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading course content...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">Course not found.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Payment Status Banner */}
        {!isPaid && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Payment Required
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This course requires payment to access the full content.
                    Some sections may be restricted.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      onClick={() => {
                        // Redirect to payment page
                        window.open(
                          "https://checkout.flutterwave.com/v3/hosted/pay/course_" +
                            courseId,
                          "_blank"
                        );
                      }}
                      className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      Complete Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <Link
              href="/courses/my-courses"
              className="mr-4 text-primary hover:text-primary-dark flex items-center transition-colors"
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
              Back to My Courses
            </Link>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex h-screen">
          {/* Left Side - Video Player and Course Details */}
          <div className="flex-1 flex flex-col">
            {/* Video Player Section */}
            <div className="bg-black relative">
              {selectedVideo ? (
                <div className="relative w-full h-[400px]">
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    data-video-id={selectedVideo.id}
                  >
                    <source
                      src={selectedVideo.video_resource?.media_url}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="w-full h-[400px] bg-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPlay className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Select a video to start learning
                    </h3>
                    <p className="text-gray-300">
                      Choose a video from the course content on the right
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Title */}
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title || "Untitled Course"}
              </h1>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "qa", label: "Q&A" },
                  { id: "notes", label: "Notes" },
                  { id: "announcements", label: "Announcements" },
                  { id: "reviews", label: "Reviews" },
                  { id: "tools", label: "Learning tools" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        About this course
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {course.description ||
                          "No description available for this course."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-5 h-5 text-yellow-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">
                            4.6
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Course Rating</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          {course.sections?.length || 0}
                        </div>
                        <p className="text-sm text-gray-600">Sections</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          {course.sections?.reduce(
                            (total, section) =>
                              total + (section.videos?.length || 0),
                            0
                          ) || 0}
                        </div>
                        <p className="text-sm text-gray-600">Videos</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Course Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Course ID:</span>
                          <span className="ml-2 font-medium">
                            {course.code || course.id}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Programme:</span>
                          <span className="ml-2 font-medium">
                            {course.programme_name || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <span className="ml-2 font-medium">
                            {new Date(course.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={`ml-2 font-medium ${
                              isPaid ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "qa" && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Q&A section coming soon...</p>
                  </div>
                )}

                {activeTab === "notes" && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Notes section coming soon...
                    </p>
                  </div>
                )}

                {activeTab === "announcements" && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Announcements section coming soon...
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Reviews section coming soon...
                    </p>
                  </div>
                )}

                {activeTab === "tools" && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Learning tools section coming soon...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Course Content Sidebar */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course content
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Course Content List */}
            <div className="flex-1 overflow-y-auto">
              {course.sections && course.sections.length > 0 ? (
                <div className="p-4 space-y-2">
                  {course.sections
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((section) => (
                      <div
                        key={section.id}
                        className="border border-gray-200 rounded-lg"
                      >
                        {/* Section Header */}
                        <div
                          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {expandedSections.has(section.id) ? (
                                <FaChevronDown className="w-4 h-4 text-gray-500 mr-2" />
                              ) : (
                                <FaChevronUp className="w-4 h-4 text-gray-500 mr-2" />
                              )}
                              <div>
                                <h3 className="font-medium text-gray-900 text-sm">
                                  {section.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {section.videos?.length || 0} videos •{" "}
                                  {section.materials?.length || 0} materials
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section Content */}
                        {expandedSections.has(section.id) && (
                          <div className="border-t border-gray-200">
                            {/* Videos */}
                            {section.videos && section.videos.length > 0 && (
                              <div className="p-2 space-y-1">
                                {section.videos
                                  .sort(
                                    (a, b) => (a.order || 0) - (b.order || 0)
                                  )
                                  .map((video) => (
                                    <div
                                      key={video.id}
                                      className={`p-2 rounded cursor-pointer transition-colors ${
                                        selectedVideo?.id === video.id
                                          ? "bg-blue-50 border-l-4 border-blue-500"
                                          : "hover:bg-gray-50"
                                      }`}
                                      onClick={() => setSelectedVideo(video)}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                                            <FaPlay className="w-3 h-3 text-gray-600" />
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                            {video.title}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {formatDuration(video.duration)}
                                          </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg
                                              className="w-2 h-2 text-white"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Materials */}
                            {section.materials &&
                              section.materials.length > 0 && (
                                <div className="p-2 space-y-1">
                                  {section.materials
                                    .sort(
                                      (a, b) => (a.order || 0) - (b.order || 0)
                                    )
                                    .map((material) => (
                                      <div
                                        key={material.id}
                                        className="p-2 rounded hover:bg-gray-50 transition-colors"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <div className="flex-shrink-0">
                                            {getFileIcon(
                                              material.material_resource
                                                ?.media_url
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                              {material.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {material.material_resource?.size
                                                ? `${(
                                                    material.material_resource
                                                      .size /
                                                    1024 /
                                                    1024
                                                  ).toFixed(2)} MB`
                                                : "File"}
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <a
                                              href={
                                                material.material_resource
                                                  ?.media_url
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-500 hover:text-blue-700"
                                            >
                                              <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                              </svg>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}

                            {/* Assessment */}
                            <div className="p-2">
                              <AssessmentButton
                                section={section}
                                course={course}
                                onStartAssessment={handleStartAssessment}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No sections available for this course.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      <AssessmentModal
        isOpen={assessmentModal.isOpen}
        onClose={handleCloseAssessment}
        sectionData={assessmentModal.section}
        onAssessmentComplete={handleAssessmentComplete}
      />
    </Layout>
  );
};

export default CourseDetailPage;
