"use client";
import { useState } from "react";
import { ADMINDASHBOARD } from "@/constants";
import { usePathname } from "next/navigation";
import RequireAuth from "@/app/lib/ReuquireAuth";
import PeopleIcon from "@mui/icons-material/People";
import StatusAreaChart from "@/components/StatusAreaChart";
import RevenueAreaChart from "@/components/RevenueAreaChart";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import DashboardTab from "@/components/dashboard-components/DashboardTab";

function Page() {
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

          {/* Main Body */}
          <section
            className=" lg:ml-[250px] w-screen px-2"
            style={{
              "@media (min-width: 1024px)": {
                width: "calc(100vw - 250px)",
              },
            }}
          >
            {/* Boxes */}
            <div>
              <div className="flex flex-wrap text-white gap-4 py-4 justify-center">
                {ADMINDASHBOARD.items.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`even:bg-red-600 bg-blue-600 w-[200px] rounded p-4`}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {item.icon ? (
                            <item.icon sx={{ fontSize: 40 }} />
                          ) : (
                            <PeopleIcon sx={{ fontSize: 40 }} />
                          )}
                        </span>
                        <span className="text-lg">{item.value}</span>
                      </div>

                      <div>{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Create tab to display the following: Programme type, Classes, Students, Teachers, Parents, Levels */}
            <DashboardTab />

            {/* Mid - Chart */}
            <div className="flex flex-wrap  overflow-x-scroll  p-4">
              <div>
                <RevenueAreaChart />
              </div>
              <div>
                <StatusAreaChart />
              </div>
            </div>
          </section>
        </main>
      </div>
    </RequireAuth>
  );
}

export default Page;
