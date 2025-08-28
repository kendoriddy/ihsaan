"use client";
import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";
import {
  ErrorOutline,
  Timeline,
  Dashboard,
  Person,
  AccessTime,
  Warning,
  Info,
  CheckCircle,
  Security,
  Settings,
  AccountCircle,
} from "@mui/icons-material";
import AdminLayout from "@/components/AdminLayout";

// Enhanced dummy data
const errorLogs = [
  {
    id: 1,
    message: "Server timeout - Database connection lost",
    level: "Critical",
    time: "2025-08-28 14:30",
  },
  {
    id: 2,
    message: "Unauthorized access attempt from IP 192.168.1.100",
    level: "Warning",
    time: "2025-08-28 13:15",
  },
  {
    id: 3,
    message: "Memory usage exceeded 85% threshold",
    level: "Warning",
    time: "2025-08-28 12:45",
  },
  {
    id: 4,
    message: "SSL certificate expires in 7 days",
    level: "Info",
    time: "2025-08-28 11:20",
  },
  {
    id: 5,
    message: "Disk space critically low (95% used)",
    level: "Critical",
    time: "2025-08-28 10:00",
  },
  {
    id: 6,
    message: "Failed login attempts exceeded limit",
    level: "Warning",
    time: "2025-08-28 09:30",
  },
];

const activityLogs = [
  {
    id: 1,
    user: "Admin",
    action: "Created new security policy",
    time: "2025-08-28 14:00",
  },
  {
    id: 2,
    user: "John Doe",
    action: "Updated user profile information",
    time: "2025-08-28 13:30",
  },
  {
    id: 3,
    user: "Sarah Wilson",
    action: "Generated monthly compliance report",
    time: "2025-08-28 12:15",
  },
  {
    id: 4,
    user: "Mike Johnson",
    action: "Modified system configurations",
    time: "2025-08-28 11:45",
  },
  {
    id: 5,
    user: "Emily Davis",
    action: "Accessed sensitive data module",
    time: "2025-08-28 10:20",
  },
  {
    id: 6,
    user: "Admin",
    action: "Performed database backup",
    time: "2025-08-28 09:00",
  },
  {
    id: 7,
    user: "Robert Brown",
    action: "Updated user permissions",
    time: "2025-08-28 08:30",
  },
  {
    id: 8,
    user: "Lisa Anderson",
    action: "Downloaded audit trail report",
    time: "2025-08-28 08:00",
  },
];

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

  const getLevelColor = (level) => {
    switch (level) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "Warning":
        return "bg-yellow-100 text-yellow-800";
      case "Info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

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
        {tab === 0 && (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-red-900 mb-6">
              System Error Logs
            </h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <Table>
                <TableHead>
                  <TableRow className="bg-gradient-to-r from-red-50 to-blue-50">
                    <TableCell className="font-bold text-red-900">ID</TableCell>
                    <TableCell className="font-bold text-red-900">
                      Error Message
                    </TableCell>
                    <TableCell className="font-bold text-red-900">
                      Severity Level
                    </TableCell>
                    <TableCell className="font-bold text-red-900">
                      Timestamp
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {errorLogs.map((log, index) => (
                    <TableRow
                      key={log.id}
                      className={`hover:bg-red-50 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <div className="bg-red-100 text-red-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                          {log.id}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.message}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
                            log.level
                          )}`}
                        >
                          {log.level}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AccessTime className="w-4 h-4 text-gray-500" />
                          {log.time}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Activity Log Tab */}
        {tab === 1 && (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6">
              User Activity Logs
            </h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <Table>
                <TableHead>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-red-50">
                    <TableCell className="font-bold text-blue-600">
                      ID
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      User
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Action Performed
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Timestamp
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityLogs.map((log, index) => (
                    <TableRow
                      key={log.id}
                      className={`hover:bg-blue-50 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                          {log.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Person className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.action}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AccessTime className="w-4 h-4 text-gray-500" />
                          {log.time}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

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
