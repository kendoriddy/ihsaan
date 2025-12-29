"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import UsersReport from "./components/UsersReport";
import AssessmentsReport from "./components/AssessmentsReport";
import AssessmentResultsReport from "./components/AssessmentResultsReport";
import ProgrammesReport from "./components/ProgrammesReport";
import SessionsReport from "./components/SessionsReport";
import CoursesReport from "./components/CoursesReport";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import { usePathname } from "next/navigation";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {/* Optimized padding: p-2 on mobile, p-4 on desktop */}
      {value === index && <Box sx={{ p: { xs: 1, md: 3 } }}>{children}</Box>}
    </div>
  );
}

function Reports() {
  const currentRoute = usePathname();

  const [value, setValue] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      <main className="flex">
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />
        
        <section
          className="flex-1 w-full lg:ml-[250px] transition-all duration-300 ease-in-out"
          style={{
            maxWidth: "100%",
            overflowX: "hidden" // Prevents the whole page from shaking during tab scrolls
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="reports tabs"
                // --- MOBILE SCROLLING LOGIC ---
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                // ------------------------------
                sx={{
                  "& .MuiTabs-scroller": {
                    "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for clean UI
                    scrollbarWidth: "none",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: { xs: 100, sm: 160 }, // Prevents text squashing
                  },
                }}
              >
                <Tab label="Users" />
                <Tab label="Assessments" />
                <Tab label="Results" />
                <Tab label="Programmes" />
                <Tab label="Sessions" />
                <Tab label="Courses" />
                <Tab label="Purchases" />
              </Tabs>
            </Box>

            <div className="max-w-[1600px] mx-auto">
                <TabPanel value={value} index={0}>
                <UsersReport />
                </TabPanel>
                <TabPanel value={value} index={1}>
                <AssessmentsReport />
                </TabPanel>
                <TabPanel value={value} index={2}>
                <AssessmentResultsReport />
                </TabPanel>
                <TabPanel value={value} index={3}>
                <ProgrammesReport />
                </TabPanel>
                <TabPanel value={value} index={4}>
                <SessionsReport />
                </TabPanel>
                <TabPanel value={value} index={5}>
                <CoursesReport />
                </TabPanel>
                <TabPanel value={value} index={6}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">Purchases Report - Coming Soon</Typography>
                </Box>
                </TabPanel>
            </div>
          </Box>
        </section>
      </main>
    </div>
  );
}

export default Reports;