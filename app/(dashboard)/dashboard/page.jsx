"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MENTORS } from "@/constants";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DashboardSidebar from "@/components/DashboardSidebar";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import RequireAuth from "@/app/lib/ReuquireAuth";
import UserDashTab from "@/components/dashboard-components/UserDashTab";
import { Card, CardContent, Typography, Box } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function DashboardCards({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ mr: 2 }}>{item.icon}</Box>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              {item.value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {item.label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Page() {
  const [dashboardItems, setDashboardItems] = useState([]);

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");

    if (roles.includes("STUDENT")) {
      setDashboardItems([
        {
          id: 1,
          label: "Number of courses registered for the current term",
          value: 0, // Replace with actual value
          icon: <SchoolIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
        },
        {
          id: 2,
          label: "Number of pending assignments",
          value: 0, // Replace with actual value
          icon: <AssignmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
        },
        {
          id: 3,
          label: "Number of pending quizzes",
          value: 0, // Replace with actual value
          icon: <QuizIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
        },
        {
          id: 4,
          label: "Number of assessments approaching deadlines",
          value: 0, // Replace with actual value
          icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        },
        {
          id: 5,
          label: "Number of quizzes approaching deadlines",
          value: 0, // Replace with actual value
          icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        },
        {
          id: 6,
          label: "Number of pending feedback directed to the tutors",
          value: 0, // Replace with actual value
          icon: <FeedbackIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
        },
        {
          id: 7,
          label: "Number of pending feedback directed to the student",
          value: 0, // Replace with actual value
          icon: <FeedbackIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
        },
      ]);
    } else if (roles.includes("TUTOR")) {
      setDashboardItems([
        {
          id: 1,
          label: "Number of assignments given",
          value: 0, // Replace with actual value
          icon: <AssignmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
        },
        {
          id: 2,
          label: "Number of quizzes given",
          value: 0, // Replace with actual value
          icon: <QuizIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
        },
        {
          id: 3,
          label: "Number of assignments pending for grading",
          value: 0, // Replace with actual value
          icon: <PendingActionsIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
        },
        {
          id: 4,
          label: "Number of quizzes pending for grading",
          value: 0, // Replace with actual value
          icon: <PendingActionsIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
        },
        {
          id: 5,
          label: "Number of assignments exceeded pending period",
          value: 0, // Replace with actual value
          icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        },
        {
          id: 6,
          label: "Number of quizzes exceeded pending period",
          value: 0, // Replace with actual value
          icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
        },
        {
          id: 7,
          label: "Number of courses handling in the current term",
          value: 0, // Replace with actual value
          icon: <SchoolIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
        },
        {
          id: 8,
          label: "Number of students handling in the current term",
          value: 0, // Replace with actual value
          icon: <GroupIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
        },
        {
          id: 9,
          label: "Number of pending feedback directed to the tutor",
          value: 0, // Replace with actual value
          icon: <FeedbackIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
        },
        {
          id: 10,
          label: "Number of pending feedback directed to the students",
          value: 0, // Replace with actual value
          icon: <FeedbackIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
        },
      ]);
    }
  }, []);

  return (
    <RequireAuth>
      <Header />
      <main className="py-2 flex">
        <DashboardSidebar currentRoute={usePathname()} />
        <section className="flex flex-col p-4 flex-1 min-h-screen">
          <div className="px-4 w-full py-8">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Dashboard Overview
            </Typography>
            <DashboardCards items={dashboardItems} />
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}
