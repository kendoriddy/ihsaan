"use client";

import React from "react";

const Toast = ({ message, type }) => {
  const getColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={`toast ${getColor(
        type
      )} text-white p-4 rounded mb-4 shadow-lg`}>
      {message}
    </div>
  );
};

export default Toast;
