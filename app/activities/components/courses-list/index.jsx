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
          course_explanatory_details,
          tutors,
          groups,
        } = courseObj;
        const { code, title, programme_name, image_url } = course_details;

        return (
          <div key={id} className="border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-1 p-4 border-b border-b-gray-300">
              {title} - {code}
            </h2>
            <div>
              <div className="p-4 flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold">Tutor(s):</p>
                  <ul className="ml-2 list-none list-inside">
                    {tutors?.map((tutor, index) => (
                      <li key={index}>{tutor.name || tutor.user}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">|</span>
                  <span className="text-nowrap flex items-center gap-1">
                    <People />{" "}
                    {course_explanatory_details?.enrolled_users.length}
                  </span>
                </div>
              </div>
              <div className="p-4 flex gap-2">
                <p className="font-semibold">Group:</p> {groups[0]?.name} |
                <span>
                  <People /> {groups[0]?.students.length}
                </span>
              </div>
              <div className="flex gap-4 rounded-md bg-gray-100 p-4">
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">Assignments:</p>
                  <span>
                    {
                      course_explanatory_details?.assessments.filter(
                        (assignment) =>
                          assignment.question_type === "FILE_UPLOAD"
                      ).length
                    }
                  </span>
                </div>{" "}
                |
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">Quiz:</p>
                  <span>
                    {
                      course_explanatory_details?.assessments.filter(
                        (assignment) => assignment.question_type === "MCQ"
                      ).length
                    }
                  </span>
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
