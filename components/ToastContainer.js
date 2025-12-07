"use client";

import React, { useState, useEffect } from "react";
import Toast from "./Toast";

let toastId = 0;

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleShowToast = (e) => {
      const { message, type } = e.detail;
      const id = toastId++;
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, 3000); // Toast display duration
    };

    window.addEventListener("showToast", handleShowToast);

    return () => {
      window.removeEventListener("showToast", handleShowToast);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-50 ">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
};

export default ToastContainer;
