"use client";
import React from "react";
import Lottie from "react-lottie";
import closedAnimationData from "../../../../assets/lottie/closed-animation.json";

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
      <Lottie options={defaultOptions} height={200} width={200} />
      <p className="text-gray-500 mt-4">Assignment is closed for submission</p>
    </div>
  );
};

export default AssignmentClosed;
