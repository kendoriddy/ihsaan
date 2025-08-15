"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import RequireAuth from "@/app/lib/ReuquireAuth";
import FeedbackMain from "@/components/feedback/feedback-main";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";

export default function DashboardFeedbackPage() {
  const currentRoute = usePathname();
  const [userRole, setUserRole] = useState("admin");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
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
    </div>
  );
}
