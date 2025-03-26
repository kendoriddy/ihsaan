"use client";
import React from "react";

const AssignmentClosed = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: closedAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="text-center">
      <p className="text-gray-500 mt-4">Assignment is closed for submission</p>
    </div>
  );
};

export default AssignmentClosed;
