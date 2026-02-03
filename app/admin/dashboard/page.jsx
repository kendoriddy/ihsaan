"use client";
import { useState, useEffect } from "react";
import { ADMINDASHBOARD } from "@/constants";
import { usePathname } from "next/navigation";
import RequireAuth from "@/app/lib/ReuquireAuth";
import PeopleIcon from "@mui/icons-material/People";
import StatusAreaChart from "@/components/StatusAreaChart";
import RevenueAreaChart from "@/components/RevenueAreaChart";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import DashboardTab from "@/components/dashboard-components/DashboardTab";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";
import { toast } from "react-toastify";

function Page() {
  const currentRoute = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [dashboardItems, setDashboardItems] = useState(ADMINDASHBOARD.items);
  const [isLoading, setIsLoading] = useState(true);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const token = getAuthToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/admin_dashboard/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const stats = response.data;

        // Map API response to dashboard items
        setDashboardItems((prevItems) =>
          prevItems.map((item) => {
            switch (item.id) {
              case 1:
                return {
                  ...item,
                  value: stats.total_users_present_past_count || 0,
                };
              case 2:
                return {
                  ...item,
                  value: stats.active_students_count || 0,
                };
              case 3:
                return {
                  ...item,
                  value: stats.special_program_students_count || 0,
                };
              case 4:
                return {
                  ...item,
                  value: stats.other_users_count || 0,
                };
              case 5:
                return {
                  ...item,
                  value: stats.pending_tutor_applications_count || 0,
                };
              case 6:
                return {
                  ...item,
                  value: stats.pending_student_applications_count || 0,
                };
              // Items 7-10 (feedback and students per programme) are not in the API response
              // Keep their default value of 0
              default:
                return item;
            }
          }),
        );
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
            className="mb-6 lg:ml-[250px] w-screen px-2"
            style={{
              "@media (min-width: 1024px)": {
                width: "calc(100vw - 250px)",
              },
            }}
          >
            {/* Boxes */}
            <div>
              {isLoading ? (
                <div className="flex flex-wrap text-white gap-4 py-4 justify-center">
                  {ADMINDASHBOARD.items.map((item, index) => (
                    <div
                      key={index}
                      className={`even:bg-red-600 bg-blue-600 w-[200px] rounded p-4 animate-pulse`}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {item.icon ? (
                            <item.icon sx={{ fontSize: 40 }} />
                          ) : (
                            <PeopleIcon sx={{ fontSize: 40 }} />
                          )}
                        </span>
                        <span className="text-lg">...</span>
                      </div>
                      <div>{item.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap text-white gap-4 py-4 justify-center">
                  {dashboardItems.map((item, index) => {
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
              )}
            </div>

            {/* Create tab to display the following: Programme type, Classes, Students, Teachers, Parents, Levels */}
            <DashboardTab />

            {/* Mid - Chart */}
            {/* <div className="flex flex-wrap  overflow-x-scroll  p-4">
              <div>
                <RevenueAreaChart />
              </div>
              <div>
                <StatusAreaChart />
              </div>
            </div> */}
          </section>
        </main>
      </div>
    </RequireAuth>
  );
}

export default Page;
