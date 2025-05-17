import React from "react";
import CourseSidebar from "./CourseSidebar";
import CourseHeader from "./CourseHeader";
import VideoPlayer from "./VideoPlayer";
import CourseTabs from "./CourseTabs";

const CoursePlayerLayout = ({ course }) => {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f7f9fa" }}>
      <CourseSidebar sections={course.sections} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CourseHeader course={course} />
        <VideoPlayer videoUrl={course.videoUrl} />
        <CourseTabs course={course} />
      </main>
    </div>
  );
};

export default CoursePlayerLayout;
