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
      {/* Reduced padding for mobile (p: 1) and standard for desktop (sm: 3) */}
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Reports() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Layout>
      <Box sx={{ width: "100%", overflowX: "hidden" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="reports tabs"
            variant="scrollable" // Enables horizontal scrolling for tabs
            scrollButtons="auto" // Shows arrows when content overflows
            allowScrollButtonsMobile // Ensures arrows appear on touch devices
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
              },
            }}
          >
            {/* <Tab label="Users" /> */}
            <Tab label="Assessments" />
            <Tab label="Assessment Results" />
            <Tab label="Programmes" />
            <Tab label="Sessions" />
            <Tab label="Courses" />
            <Tab label="Purchases" />
          </Tabs>
        </Box>
        {/* <TabPanel value={value} index={0}>
          <UsersReport />
        </TabPanel> */}
        <TabPanel value={value} index={0}>
          <AssessmentsReport />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AssessmentResultsReport />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ProgrammesReport />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <SessionsReport />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <CoursesReport />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Typography sx={{ p: 2 }}>Purchases Report - Coming Soon</Typography>
        </TabPanel>
      </Box>
    </Layout>
  );
}

export default Reports;