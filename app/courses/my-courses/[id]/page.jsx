"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Layout from "@/components/Layout";
import { getAuthToken } from "@/hooks/axios/axios";
import { IMAGES } from "@/constants";
import AssessmentModal from "@/components/AssessmentModal";
import AssessmentButton from "@/components/AssessmentButton";
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
    // The assessment status will be updated automatically by Redux
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
      <div className="container mx-auto px-4 py-8">
        {/* Payment Status Banner */}
        {!isPaid && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
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

        {/* Test Toggle */}
        <div className="mb-6 flex justify-end">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <span className="text-sm text-gray-600">Test Mode:</span>
            <button
              onClick={() => setIsPaid(!isPaid)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isPaid ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {isPaid ? "Paid Mode" : "Unpaid Mode"}
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center mb-8">
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

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative w-full h-64 bg-gray-200">
            {course.image_url ? (
              <Image
                src={course.image_url}
                alt={course.title || "Course image"}
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src={IMAGES.logo}
                alt={course.title || "Course image"}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {course.title || "Untitled Course"}
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                  {course.programme_name &&
                    `Programme: ${course.programme_name}`}
                </p>
                {course.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>
              <div className="text-right ml-6 space-y-2">
                <div className="bg-primary text-white px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">Course ID</p>
                  <p className="text-lg font-bold">
                    {course.code || course.id}
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isPaid ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  <p className="text-sm font-medium">Payment Status</p>
                  <p className="text-lg font-bold">
                    {isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Course Content ({safeRender(course.sections?.length) || 0} sections)
          </h2>

          {course.sections && course.sections.length > 0 ? (
            course.sections
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden relative"
                >
                  {/* Section Header */}
                  <div
                    className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-gray-800 mr-3">
                          {section.title}
                        </h3>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                          Position: {section.order}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          {section.videos?.length || 0} videos,{" "}
                          {section.materials?.length || 0} materials
                        </span>
                        {expandedSections.has(section.id) ? (
                          <FaChevronUp className="text-gray-500" />
                        ) : (
                          <FaChevronDown className="text-gray-500" />
                        )}
                      </div>
                    </div>
                    {section.description && (
                      <p className="text-gray-600 mt-2 text-sm">
                        {section.description}
                      </p>
                    )}
                  </div>

                  {/* Section Content */}
                  {expandedSections.has(section.id) && (
                    <div
                      className={`p-6 space-y-6 ${
                        !isPaid ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {/* Payment Required Overlay for Unpaid Content */}
                      {!isPaid && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg
                                className="w-8 h-8 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Payment Required
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Complete your payment to access this course
                              content.
                            </p>
                            <button
                              onClick={() => {
                                window.open(
                                  "https://checkout.flutterwave.com/v3/hosted/pay/course_" +
                                    courseId,
                                  "_blank"
                                );
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                              Complete Payment
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Videos */}
                      {section.videos && section.videos.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                            Videos ({section.videos.length})
                          </h4>
                          <div className="grid gap-4">
                            {section.videos
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((video) => (
                                <div
                                  key={video.id}
                                  className="border rounded-lg p-4 bg-gray-50"
                                >
                                  <div className="flex items-start space-x-4">
                                    {/* Video Thumbnail/Player */}
                                    <div className="flex-shrink-0">
                                      {video.video_resource?.media_url ? (
                                        <div className="relative">
                                          <video
                                            width={200}
                                            height={120}
                                            className="border rounded-lg"
                                            controls={playingVideo === video.id}
                                            muted={playingVideo !== video.id}
                                            data-video-id={video.id}
                                          >
                                            <source
                                              src={
                                                video.video_resource.media_url
                                              }
                                              type="video/mp4"
                                            />
                                            Your browser does not support the
                                            video tag.
                                          </video>
                                          {playingVideo !== video.id && (
                                            <button
                                              onClick={() =>
                                                handleVideoPlay(video.id)
                                              }
                                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-all rounded-lg group"
                                            >
                                              <FaPlay className="text-white text-2xl group-hover:scale-110 transition-transform" />
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="w-[200px] h-[120px] bg-gray-300 rounded-lg flex items-center justify-center">
                                          <span className="text-gray-500 text-sm">
                                            No video
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Video Info */}
                                    <div className="flex-1">
                                      <h5 className="text-lg font-medium text-gray-800 mb-2">
                                        {video.title}
                                      </h5>
                                      <div className="space-y-1 text-sm text-gray-600">
                                        <p>Video #{video.video_no}</p>
                                        <p>
                                          Duration:{" "}
                                          {formatDuration(video.duration)}
                                        </p>
                                        <p>Order: {video.order}</p>
                                        {video.video_resource && (
                                          <p>
                                            Size:{" "}
                                            {(
                                              video.video_resource.size /
                                              1024 /
                                              1024
                                            ).toFixed(2)}{" "}
                                            MB
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Play/Pause Button */}
                                    <div className="flex-shrink-0">
                                      <button
                                        onClick={() =>
                                          handleVideoPlay(video.id)
                                        }
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                          playingVideo === video.id
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-primary hover:bg-primary-dark text-white"
                                        }`}
                                      >
                                        {playingVideo === video.id ? (
                                          <>
                                            <FaPause className="inline mr-2" />
                                            Pause
                                          </>
                                        ) : (
                                          <>
                                            <FaPlay className="inline mr-2" />
                                            Play
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Materials */}
                      {section.materials && section.materials.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            Materials ({section.materials.length})
                          </h4>
                          <div className="grid gap-3">
                            {section.materials
                              .sort((a, b) => (a.order || 0) - (b.order || 0))
                              .map((material) => (
                                <div
                                  key={material.id}
                                  className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center space-x-4">
                                    {/* Material Icon */}
                                    <div className="flex-shrink-0">
                                      {material.material_resource?.media_url ? (
                                        <a
                                          href={
                                            material.material_resource.media_url
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                          {getFileIcon(
                                            material.material_resource.media_url
                                          )}
                                        </a>
                                      ) : (
                                        <div className="p-2">
                                          <FaFile className="w-6 h-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>

                                    {/* Material Info */}
                                    <div className="flex-1">
                                      <h5 className="text-lg font-medium text-gray-800 mb-1">
                                        {material.title}
                                      </h5>
                                      <div className="space-y-1 text-sm text-gray-600">
                                        <p>Order: {material.order}</p>
                                        {material.material_resource && (
                                          <p>
                                            Size:{" "}
                                            {(
                                              material.material_resource.size /
                                              1024 /
                                              1024
                                            ).toFixed(2)}{" "}
                                            MB
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Download/View Button */}
                                    {material.material_resource?.media_url && (
                                      <div className="flex-shrink-0">
                                        <a
                                          href={
                                            material.material_resource.media_url
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                                        >
                                          <FaFile className="mr-2" />
                                          View
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Assessment Section */}
                      <AssessmentButton
                        section={section}
                        onStartAssessment={handleStartAssessment}
                      />

                      {/* No Content Message */}
                      {(!section.videos || section.videos.length === 0) &&
                        (!section.materials ||
                          section.materials.length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <p>No content available in this section.</p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600">
                No sections available for this course.
              </p>
            </div>
          )}
        </div>

        {/* Course Footer Info */}
        {course && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Course Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(course.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(course.updated_at).toLocaleDateString()}
                </p>
                {course.assessment_count && (
                  <p>
                    <strong>Assessments:</strong>{" "}
                    {safeRender(course.assessment_count)}
                  </p>
                )}
              </div>
              <div>
                {course.enrolled_users && course.enrolled_users.length > 0 && (
                  <p>
                    <strong>Enrolled Students:</strong>{" "}
                    {course.enrolled_users.length}
                  </p>
                )}
                {course.tutors && (
                  <p>
                    <strong>Tutors:</strong> {safeRender(course.tutors)}
                  </p>
                )}
                {course.groups && (
                  <p>
                    <strong>Groups:</strong> {safeRender(course.groups)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
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
