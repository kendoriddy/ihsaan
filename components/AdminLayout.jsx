"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import RequireAuth from "@/app/lib/ReuquireAuth";
import AdminDashboardHeader from "./AdminDashboardHeader";
import AdminDashboardSidebar from "./AdminDashboardSidebar";

function AdminLayout({ children }) {
  const currentRoute = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <RequireAuth>
      <div className="">
        {/* Header */}
        <AdminDashboardHeader toggleSidebar={toggleSidebar} />
        {/* Main */}
        <main className="flex">
          {/* Sidebar */}
          <AdminDashboardSidebar
            isSidebarOpen={isSidebarOpen}
            toggleOption={toggleOption}
            openSubMenuIndex={openSubMenuIndex}
            currentRoute={currentRoute}
          />

          {/* Main Body */}
          <section className="lg:ml-[250px] flex md:flex-row w-full p-4 justify-center flex-1 min-h-screen">
            {children}
          </section>
        </main>
      </div>
    </RequireAuth>
  );
}

export default AdminLayout;
