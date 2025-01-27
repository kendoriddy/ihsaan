"use client";

import { useState } from "react";
import { DASHBOARD_LIST, IMAGES } from "@/constants";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";

function Page() {
  const currentRoute = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);

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
          }}>
          <div>
            <div className="p-2 font-bold  bg-white">Notification </div>

            <div className="w-full h-20 border rounded"></div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
