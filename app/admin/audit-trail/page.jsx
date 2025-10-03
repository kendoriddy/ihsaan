"use client";
import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import {
  ErrorOutline,
  Timeline,
  Dashboard,
  Security,
} from "@mui/icons-material";
import AdminLayout from "@/components/AdminLayout";
import { useFetch } from "@/hooks/useHttp/useHttp";
import ErrorLogs from "./components/ErrorLogs";
import ActivitiesLogs from "./components/ActivitiesLogs";
import AuditDashboard from "./components/AuditDashboard";

const AuditTrail = () => {
  const [tab, setTab] = useState(0);

  // Error logs state
  const [errorPage, setErrorPage] = useState(1);
  const [totalErrors, setTotalErrors] = useState(0);
  const [errorFilters, setErrorFilters] = useState({});

  // Activity logs state
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [activityFilters, setActivityFilters] = useState({});

  // Build error query string
  const buildErrorQuery = () => {
    const baseParams = {
      page: errorPage,
      page_size: 10,
    };
    const allParams = { ...baseParams, ...errorFilters };
    return Object.entries(allParams)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  };

  // Build activity query string
  const buildActivityQuery = () => {
    const baseParams = {
      page: activityPage,
      limit: 10,
    };
    const allParams = { ...baseParams, ...activityFilters };
    return Object.entries(allParams)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  };

  // Error logs fetch
  const {
    isLoading: errorLoading,
    data: errorData,
    isFetching: errorFetching,
    refetch: errorRefetch,
  } = useFetch(
    ["errorLogs", errorPage, errorFilters],
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/utils/api/logs/errors/?${buildErrorQuery()}`,
    (data) => {
      if (data?.total) {
        setTotalErrors(data.total);
      }
    }
  );

  // Activity logs fetch
  const {
    isLoading: activityLoading,
    data: activityData,
    isFetching: activityFetching,
    refetch: activityRefetch,
  } = useFetch(
    ["activitiesLogs", activityPage, activityFilters],
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/audit/api/trails/?${buildActivityQuery()}`,
    (data) => {
      if (data?.pagination?.total) {
        setTotalActivities(data.pagination.total);
      }
    }
  );

  const handleErrorPageChange = (event, value) => {
    setErrorPage(value);
    // Refetch will be triggered automatically by the useFetch hook due to dependency change
  };

  const handleActivityPageChange = (event, value) => {
    setActivityPage(value);
    // Refetch will be triggered automatically by the useFetch hook due to dependency change
  };

  const handleErrorFiltersChange = (newFilters) => {
    setErrorFilters(newFilters);
    setErrorPage(1); // Reset to first page when filters change
    // Refetch will be triggered automatically by the useFetch hook due to dependency change
  };

  const handleActivityFiltersChange = (newFilters) => {
    setActivityFilters(newFilters);
    setActivityPage(1); // Reset to first page when filters change
    // Refetch will be triggered automatically by the useFetch hook due to dependency change
  };

  // Dashboard indicators with dynamic data
  const dashboardIndicators = [
    {
      title: "Total Errors",
      value: totalErrors || 0,
      icon: <ErrorOutline />,
      trend: totalErrors > 0 ? `${totalErrors} errors` : "No errors",
      color: "red",
    },
    {
      title: "Total Activities",
      value: totalActivities || 0,
      icon: <Timeline />,
      trend:
        totalActivities > 0 ? `${totalActivities} activities` : "No activities",
      color: "blue",
    },
    {
      title: "System Health",
      value:
        totalErrors === 0
          ? "Excellent"
          : totalErrors < 10
          ? "Good"
          : "Needs Attention",
      icon: <Dashboard />,
      trend: totalErrors === 0 ? "Stable" : "Monitor closely",
      color: totalErrors === 0 ? "green" : totalErrors < 10 ? "blue" : "red",
    },
    {
      title: "Security Score",
      value: totalErrors === 0 ? "100%" : totalErrors < 5 ? "98%" : "95%",
      icon: <Security />,
      trend: totalErrors === 0 ? "Perfect" : "Good",
      color: "green",
    },
  ];

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-900 to-blue-600 text-white p-6 mb-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Audit Trail Dashboard</h1>
          <p className="text-white/90">
            Monitor system activities, errors, and performance indicators
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <Tabs
            value={tab}
            onChange={(e, newVal) => setTab(newVal)}
            centered
            className="bg-white rounded-t-lg flex md:block flex-col"
          >
            <Tab
              icon={<Dashboard />}
              label="Dashboard"
              iconPosition="start"
              className="normal-case font-semibold text-base min-w-32 data-[selected]:text-red-900"
            />
            <Tab
              icon={<ErrorOutline />}
              label="Error Logs"
              iconPosition="start"
              className="normal-case font-semibold text-base min-w-32 data-[selected]:text-red-900"
            />
            <Tab
              icon={<Timeline />}
              label="Activity Logs"
              iconPosition="start"
              className="normal-case font-semibold text-base min-w-32 data-[selected]:text-red-900"
            />
          </Tabs>
        </div>

        {/* Dashboard Tab */}
        {tab === 0 && (
          <AuditDashboard
            dashboardIndicators={dashboardIndicators}
            isLoading={activityLoading}
            isFetching={activityFetching}
          />
        )}

        {/* Error Log Tab */}
        {tab === 1 && (
          <ErrorLogs
            errorData={errorData}
            isLoading={errorLoading}
            isFetching={errorFetching}
            totalErrors={totalErrors}
            currentPage={errorPage}
            onPageChange={handleErrorPageChange}
            onFiltersChange={handleErrorFiltersChange}
          />
        )}

        {/* Activity Log Tab */}
        {tab === 2 && (
          <ActivitiesLogs
            activityData={activityData}
            isLoading={activityLoading}
            isFetching={activityFetching}
            totalActivities={totalActivities}
            currentPage={activityPage}
            onPageChange={handleActivityPageChange}
            onFiltersChange={handleActivityFiltersChange}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditTrail;
