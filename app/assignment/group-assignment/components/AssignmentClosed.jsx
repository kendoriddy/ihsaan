"use client";
import React, { useState } from "react";
import { useEffect } from "react";

const AssignmentClosed = () => {
  const [studentId, setStudentId] = useState("");

  const fetchStudentId = () => {
    const storedStudentId = localStorage.getItem("userId");
    console.log("storedStudentId", storedStudentId);
    if (storedStudentId) {
      setStudentId(storedStudentId);
    }
  };

  useEffect(() => {
    fetchStudentId();
  });

  const checkAccessibility = true;

  return (
    <div className="text-center">
      {checkAccessibility ? (
        <p className="text-gray-500 mt-4">
          You are not allowed to submit this asignment, ask your group leader to
          make the submission in your stead.
        </p>
      ) : (
        <p className="text-gray-500 mt-4">
          This is group assignment is closed for submission
        </p>
      )}
    </div>
  );
};

export default AssignmentClosed;
