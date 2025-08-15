"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Determine user role from localStorage or Redux state
    if (typeof window !== "undefined") {
      try {
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");

        if (roles.includes("ADMIN")) {
          setUserRole("admin");
        } else if (roles.includes("TUTOR")) {
          setUserRole("tutor");
        } else if (roles.includes("STUDENT")) {
          setUserRole("student");
        } else {
          setUserRole("ordinary");
        }
      } catch (error) {
        console.error("Error parsing roles from localStorage:", error);
        setUserRole("ordinary"); // Default to ordinary user
      }
    }
  }, []);

  useEffect(() => {
    // Redirect to the new dashboard feedback page
    if (userRole === "admin") {
      router.push("/admin/feedback");
      return;
    }
    router.push("/dashboard/feedback");
  }, [router, userRole]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Feedback Dashboard...</p>
      </div>
    </div>
  );
}
