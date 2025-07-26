"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AnnouncementDashboard from "@/components/notifications/announcement-dashboard";

function Page() {
  const currentRoute = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState("tutor");

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

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        {/* Right Main Body */}
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          <div>
            {/* <div className="p-2 font-bold  bg-white">Notification </div> */}

            <div className="w-full h-20 border rounded">
              <div className="min-h-screen bg-gray-50">
                {/* Role Switcher for Demo */}
                <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                  <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">
                      IHSAAN Announcement System
                    </h1>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Demo as:</span>
                      <select
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-red-700 bg-white"
                      >
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                <AnnouncementDashboard userRole={userRole} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
