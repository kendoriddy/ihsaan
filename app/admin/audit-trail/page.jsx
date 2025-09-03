"use client";
import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import {
  ErrorOutline,
  Timeline,
  Dashboard,
  CheckCircle,
  Security,
  AccountCircle,
} from "@mui/icons-material";
import AdminLayout from "@/components/AdminLayout";
import ErrorLogs from "./components/ErrorLogs";
import ActivitiesLogs from "./components/ActivitiesLogs";

const dashboardIndicators = [
  {
    title: "Total Errors",
    value: 23,
    icon: <ErrorOutline />,
    trend: "+15%",
    color: "red",
  },
  {
    title: "Total Activities",
    value: 1247,
    icon: <Timeline />,
    trend: "+8%",
    color: "blue",
  },
  {
    title: "System Health",
    value: "Good",
    icon: <Dashboard />,
    trend: "Stable",
    color: "green",
  },
  {
    title: "Active Users",
    value: 342,
    icon: <AccountCircle />,
    trend: "+12%",
    color: "purple",
  },
  {
    title: "Security Score",
    value: "98%",
    icon: <Security />,
    trend: "+2%",
    color: "green",
  },
  {
    title: "Uptime",
    value: "99.9%",
    icon: <CheckCircle />,
    trend: "Stable",
    color: "green",
  },
];

const AuditTrail = () => {
  const [tab, setTab] = useState(0);

  const getCardColors = (color) => {
    const colors = {
      red: "from-red-50 to-red-100 border-red-200",
      blue: "from-blue-50 to-blue-100 border-blue-200",
      green: "from-green-50 to-green-100 border-green-200",
      purple: "from-purple-50 to-purple-100 border-purple-200",
    };
    return colors[color] || colors.blue;
  };

  const getIconColors = (color) => {
    const colors = {
      red: "bg-red-200 text-red-700",
      blue: "bg-blue-200 text-blue-700",
      green: "bg-green-200 text-green-700",
      purple: "bg-purple-200 text-purple-700",
    };
    return colors[color] || colors.blue;
  };

  const getValueColors = (color) => {
    const colors = {
      red: "text-red-700",
      blue: "text-blue-700",
      green: "text-green-700",
      purple: "text-purple-700",
    };
    return colors[color] || colors.blue;
  };

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
            className="bg-white rounded-t-lg"
          >
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
            <Tab
              icon={<Dashboard />}
              label="Dashboard"
              iconPosition="start"
              className="normal-case font-semibold text-base min-w-32 data-[selected]:text-red-900"
            />
          </Tabs>
        </div>

        {/* Error Log Tab */}
        {tab === 0 && <ErrorLogs />}

        {/* Activity Log Tab */}
        {tab === 1 && <ActivitiesLogs />}

        {/* Dashboard Indicators Tab */}
        {tab === 2 && (
          <div className="p-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-900 to-blue-600 bg-clip-text text-transparent mb-8">
              System Performance Indicators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardIndicators.map((indicator, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${getCardColors(
                    indicator.color
                  )} border rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 p-6`}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`${getIconColors(
                        indicator.color
                      )} p-3 rounded-full mr-4`}
                    >
                      {indicator.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        {indicator.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {indicator.trend}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`text-4xl font-bold ${getValueColors(
                      indicator.color
                    )}`}
                  >
                    {indicator.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AuditTrail;
