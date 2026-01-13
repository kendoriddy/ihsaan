"use client";
import Header from "@/components/Header";
import DashboardSidebar from "@/components/DashboardSidebar";
import RequireAuth from "@/app/lib/ReuquireAuth";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AlarmOnIcon from "@mui/icons-material/AlarmOn";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { http2 } from "@/hooks/axios/axios";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");

        if (roles.includes("STUDENT")) {
          const response = await http2.get("/dashboard/student_dashboard/");
          const data = response.data;

          setDashboardItems([
            {
              id: 1,
              label: "Number of courses registered for the current term",
              value: data.courses_registered_count || 0,
              icon: <SchoolIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            },
            {
              id: 2,
              label: "Number of pending assignments",
              value: data.pending_assignments_count || 0,
              icon: <AssignmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 3,
              label: "Number of pending quizzes",
              value: data.pending_quizzes_count || 0,
              icon: <QuizIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 4,
              label: "Number of assessments approaching deadlines",
              value: data.assignments_approaching_deadline_count || 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
            {
              id: 5,
              label: "Number of quizzes approaching deadlines",
              value: data.quizzes_approaching_deadline_count || 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
          ]);
        } else if (roles.includes("TUTOR")) {
          const response = await http2.get("/dashboard/tutor_dashboard/");
          const data = response.data;

          setDashboardItems([
            {
              id: 1,
              label: "Number of assignments given",
              value: data.assignments_given_count || 0,
              icon: <AssignmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 2,
              label: "Number of quizzes given",
              value: data.quizzes_given_count || 0,
              icon: <QuizIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 3,
              label: "Number of assignments pending for grading",
              value: data.assignments_pending_grading_count || 0,
              icon: (
                <PendingActionsIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              ),
            },
            {
              id: 4,
              label: "Number of quizzes pending for grading",
              value: data.quizzes_pending_grading_count || 0,
              icon: (
                <PendingActionsIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              ),
            },
            {
              id: 5,
              label: "Number of assignments exceeded pending period",
              value: data.assignments_exceeded_pending_count || 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
            {
              id: 6,
              label: "Number of quizzes exceeded pending period",
              value: data.quizzes_exceeded_pending_count || 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
            {
              id: 7,
              label: "Number of courses handling in the current term",
              value: data.courses_handling_count || 0,
              icon: <SchoolIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            },
            {
              id: 8,
              label: "Number of students handling in the current term",
              value: data.students_handling_count || 0,
              icon: <GroupIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default empty values on error
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");
        if (roles.includes("STUDENT")) {
          setDashboardItems([
            {
              id: 1,
              label: "Number of courses registered for the current term",
              value: 0,
              icon: <SchoolIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            },
            {
              id: 2,
              label: "Number of pending assignments",
              value: 0,
              icon: <AssignmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 3,
              label: "Number of pending quizzes",
              value: 0,
              icon: <QuizIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 4,
              label: "Number of assessments approaching deadlines",
              value: 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
            {
              id: 5,
              label: "Number of quizzes approaching deadlines",
              value: 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
          ]);
        } else if (roles.includes("TUTOR")) {
          setDashboardItems([
            {
              id: 1,
              label: "Number of assignments given",
              value: 0,
              icon: <AssignmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 2,
              label: "Number of quizzes given",
              value: 0,
              icon: <QuizIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            },
            {
              id: 3,
              label: "Number of assignments pending for grading",
              value: 0,
              icon: (
                <PendingActionsIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              ),
            },
            {
              id: 4,
              label: "Number of quizzes pending for grading",
              value: 0,
              icon: (
                <PendingActionsIcon sx={{ fontSize: 40, color: "#1976d2" }} />
              ),
            },
            {
              id: 5,
              label: "Number of assignments exceeded pending period",
              value: 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
            {
              id: 6,
              label: "Number of quizzes exceeded pending period",
              value: 0,
              icon: <AlarmOnIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            },
            {
              id: 7,
              label: "Number of courses handling in the current term",
              value: 0,
              icon: <SchoolIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            },
            {
              id: 8,
              label: "Number of students handling in the current term",
              value: 0,
              icon: <GroupIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <DashboardCards items={dashboardItems} />
            )}
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}
