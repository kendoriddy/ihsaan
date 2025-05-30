"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import UsersReport from "./components/UsersReport";
import AssessmentsReport from "./components/AssessmentsReport";
import AssessmentResultsReport from "./components/AssessmentResultsReport";
import ProgrammesReport from "./components/ProgrammesReport";
import SessionsReport from "./components/SessionsReport";
import CoursesReport from "./components/CoursesReport";
import Layout from "@/components/Layout";
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
    <div className="relative">
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      <main className="flex relative">
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (minWidth: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="reports tabs"
              >
                <Tab label="Users" />
                <Tab label="Assessments" />
                <Tab label="Assessment Results" />
                <Tab label="Programmes" />
                <Tab label="Sessions" />
                <Tab label="Courses" />
                <Tab label="Purchases" />
              </Tabs>
            </Box>
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
              <Typography>Purchases Report - Coming Soon</Typography>
            </TabPanel>
          </Box>
        </section>
      </main>
    </div>
  );
}

export default Reports;
