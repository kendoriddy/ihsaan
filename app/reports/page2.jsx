"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import UsersReport from "./components/UsersReport";
import Layout from "@/components/Layout";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
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
          <Tabs value={value} onChange={handleChange} aria-label="report tabs">
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
          <Typography>Assessments Report - Coming Soon</Typography>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography>Assessment Results Report - Coming Soon</Typography>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography>Programmes Report - Coming Soon</Typography>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Typography>Sessions Report - Coming Soon</Typography>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Typography>Courses Report - Coming Soon</Typography>
        </TabPanel>
        <TabPanel value={value} index={6}>
          <Typography>Purchases Report - Coming Soon</Typography>
        </TabPanel>
      </Box>
    </Layout>
  );
}

export default Reports;
