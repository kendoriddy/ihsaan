"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AnnouncementDashboard from "@/components/notifications/announcement-dashboard";

function Page() {
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

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      try {
        const rolesStr = localStorage.getItem("roles");
        if (rolesStr) {
          const roles = JSON.parse(rolesStr);
          if (roles.includes("ADMIN")) {
            setUserRole("admin");
          } else if (roles.includes("TUTOR")) {
            setUserRole("tutor");
          }
        }
      } catch (error) {
        console.error("Error parsing roles from localStorage:", error);
        setUserRole("admin"); // Default to admin
      }
    }
  }, []);

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
          className="lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          <div>
            <div className="w-full h-20 border rounded">
              <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                  <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">
                      IHSAAN Announcement System
                    </h1>
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
