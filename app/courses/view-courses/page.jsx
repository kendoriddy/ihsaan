"use client";

import Layout from "@/components/Layout";
import CourseHeader from "./components/CourseHeader";
import VideoPlayer from "./components/VideoPlayer";
import CourseNavigation from "./components/CourseNavigation";
import CourseDescription from "./components/CourseDescription";
import CourseContent from "./components/CourseContent";

export default function ViewCourse() {
  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-white">
        <CourseHeader />
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-8/12">
            <VideoPlayer />
            <CourseNavigation />
            <CourseDescription />
          </div>
          <div className="lg:w-4/12 border-l border-gray-200">
            <CourseContent />
          </div>
        </div>
      </div>
    </Layout>
  );
}
