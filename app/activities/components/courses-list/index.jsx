"use client";
import { People } from "@mui/icons-material";
import React from "react";

const CoursesList = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses?.results?.map((courseObj) => {
        const {
          id,
          course_details,
          course_explanatory_details = {},
          tutors = [],
          groups = [],
        } = courseObj;

        // safe destructure of course_details
        const { code = "", title = "", programme_name = "", image_url = "" } =
          course_details || {};

        // safe derived values
        const enrolledCount =
          course_explanatory_details?.enrolled_users?.length || 0;
        const groupName = groups?.[0]?.name || "";
        const groupStudentsCount = groups?.[0]?.students?.length || 0;

        const assessments = course_explanatory_details?.assessments || [];
        const assignmentsCount =
          assessments.filter(
            (assignment) => assignment?.question_type === "FILE_UPLOAD"
          )?.length || 0;
        const quizCount =
          assessments.filter(
            (assignment) => assignment?.question_type === "MCQ"
          )?.length || 0;

        return (
          <div
            key={id}
            className="border-2 border-blue-600 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold mb-1 p-4 border-b border-b-blue-600">
              {title} - {code}
            </h2>
            <div>
              <div className="p-4 flex justify-between md:justify-normal items-start gap-4 border-b border-b-blue-600">
                <div>
                  <p className="font-semibold">Tutor(s):</p>
                  <ul className="list-none list-inside">
                    {tutors?.map((tutor, index) => (
                      <li key={index} className="font-bold">
                        {tutor?.tutor_full_name || tutor?.user}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">|</span>
                  <span className="text-nowrap flex items-center gap-1">
                    <People />{" "}
                    {enrolledCount}
                  </span>
                </div>
              </div>
              <div className="p-4 flex gap-2">
                <p className="font-semibold">Group:</p> {groupName} |
                <span>
                  <People /> {groupStudentsCount}
                </span>
              </div>
              <div className="flex gap-4 rounded- text-white p-4 bg-blue-600">
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">Assignments:</p>
                  <span>{assignmentsCount}</span>
                </div>{" "}
                |
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">Quiz:</p>
                  <span>{quizCount}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CoursesList;
