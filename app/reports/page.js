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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="reports tabs">
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
    </Layout>
  );
}

export default Reports;
