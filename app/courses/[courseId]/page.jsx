"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Layout from "@/components/Layout";
import CourseHeader from "./components/CourseHeader";
import VideoPlayer from "./components/VideoPlayer";
import CourseNavigation from "./components/CourseNavigation";
import CourseDescription from "./components/CourseDescription";
import CourseContent from "./components/CourseContent";
import { getAuthToken } from "@/hooks/axios/axios";

export default function ViewCoursePage() {
  const params = useParams();
  const courseId = params.courseId;

  const [courseData, setCourseData] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        setIsLoading(false);
        setError("Course ID is missing.");
        return;
      }
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
        setCourseData(response.data);
        if (response.data.sections && response.data.sections.length > 0) {
          const firstSection = response.data.sections[0];
          if (firstSection.videos && firstSection.videos.length > 0) {
            setSelectedVideo(firstSection.videos[0]);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch course details.");
        console.error("Error fetching course details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl">Loading course content...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  if (!courseData) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl">No course data found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <CourseHeader
          title={courseData.title}
          programmeName={courseData.programme_name}
        />
        <div className="flex flex-col lg:flex-row container mx-auto mt-4 p-4 gap-6">
          <div className="lg:w-8/12 bg-white p-4 rounded-lg shadow">
            <VideoPlayer
              videoUrl={selectedVideo?.video_resource?.media_url}
              title={selectedVideo?.title}
            />
            <CourseDescription
              title={courseData.title}
              description={courseData.description}
              enrolledUsersCount={courseData.enrolled_users?.length}
              updatedAt={courseData.updated_at}
            />
          </div>
          <div className="lg:w-4/12 bg-white p-4 rounded-lg shadow">
            <CourseContent
              sections={courseData.sections}
              onSelectVideo={handleSelectVideo}
              selectedVideoId={selectedVideo?.id}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
