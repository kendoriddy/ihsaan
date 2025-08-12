"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import RequireAuth from "@/app/lib/ReuquireAuth";
import FeedbackMain from "@/components/feedback/feedback-main";
import WavingHandIcon from "@mui/icons-material/WavingHand";

export default function DashboardFeedbackPage() {
  const currentRoute = usePathname();
  const user = useSelector(currentlyLoggedInUser);
  const [userRole, setUserRole] = useState("student");

  useEffect(() => {
    // Determine user role from localStorage or Redux state
    if (typeof window !== "undefined") {
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
    }
  }, []);

  return (
    <RequireAuth>
      <main className="py-2 flex">
        <DashboardSidebar currentRoute={currentRoute} />
        <section className="flex flex-col p-4 flex-1 min-h-screen">
          <div className="px-4 w-full py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <WavingHandIcon sx={{ color: "blue", fontSize: "2rem" }} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Feedback System
                  </h1>
                  <p className="text-gray-600">
                    Share your thoughts and suggestions
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Main Component */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <FeedbackMain userRole={userRole} />
            </div>
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}
