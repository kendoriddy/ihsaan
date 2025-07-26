"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import Header from "@/components/Header";
import StudentCourseAnnouncements from "@/components/notifications/student-course-announcements";
import StudentNotificationPage from "@/components/notifications/student-notification-page";
import { Campaign, Notifications } from "@mui/icons-material";
import StudentNotificationBell from "@/components/notifications/student-notification-bell";
import { School } from "lucide-react";

function Page() {
  const [currentView, setCurrentView] = useState("bell");

  const currentRoute = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState("tutor");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock student notifications
  const mockNotifications = [
    {
      id: "1",
      title: "Assignment Reminder - Arabic Grammar",
      message:
        "Don't forget to submit your homework by Friday. The assignment covers chapters 1-3 and includes exercises on verb conjugation.",
      type: "reminder",
      senderName: "Ahmad Hassan",
      senderRole: "tutor",
      courseTitle: "Arabic Grammar Fundamentals",
      courseId: "course-1",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z",
      hasAttachment: false,
      announcementId: "1",
    },
    {
      id: "2",
      title: "Platform Maintenance Notice",
      message:
        "The platform will be under maintenance this Saturday from 2-4 AM UTC. During this time, you may experience temporary service interruptions.",
      type: "alert",
      senderName: "IHSAAN Admin",
      senderRole: "admin",
      isRead: true,
      createdAt: "2024-01-14T09:15:00Z",
      hasAttachment: false,
      announcementId: "2",
    },
    {
      id: "3",
      title: "New Course Material Available",
      message:
        "I've uploaded additional practice exercises for Tajweed. These materials will help you master the pronunciation rules we covered in class.",
      type: "informational",
      senderName: "Fatima Al-Zahra",
      senderRole: "tutor",
      courseTitle: "Tajweed Mastery Course",
      courseId: "course-2",
      isRead: false,
      createdAt: "2024-01-13T14:20:00Z",
      hasAttachment: true,
      announcementId: "3",
    },
    {
      id: "4",
      title: "Special Discount on Advanced Courses",
      message:
        "Get 30% off on all advanced Islamic studies courses this month! Use code LEARN30 at checkout.",
      type: "promotional",
      senderName: "IHSAAN Admin",
      senderRole: "admin",
      isRead: false,
      createdAt: "2024-01-12T16:45:00Z",
      hasAttachment: false,
      announcementId: "4",
    },
  ];

  // Mock course announcements
  const mockCourseAnnouncements = [
    {
      id: "1",
      title: "Assignment Reminder - Arabic Grammar",
      message:
        "Don't forget to submit your homework by Friday. The assignment covers chapters 1-3 and includes exercises on verb conjugation. Please make sure to review the examples we discussed in class.\n\nIf you have any questions, feel free to reach out during office hours or post in the course discussion forum.",
      type: "reminder",
      senderName: "Ahmad Hassan",
      isRead: false,
      createdAt: "2024-01-15T10:30:00Z",
      hasAttachment: true,
      attachments: [
        {
          name: "Assignment_Guidelines.pdf",
          url: "/files/assignment_guidelines.pdf",
          type: "PDF",
          size: "2.3 MB",
        },
        {
          name: "Practice_Exercises.docx",
          url: "/files/practice_exercises.docx",
          type: "Word Document",
          size: "1.8 MB",
        },
      ],
      isPinned: true,
    },
    {
      id: "2",
      title: "Class Schedule Update",
      message:
        "Please note that next week's class on Wednesday will be moved to Thursday at the same time due to a scheduling conflict. All other classes remain as scheduled.",
      type: "alert",
      senderName: "Ahmad Hassan",
      isRead: true,
      createdAt: "2024-01-10T11:15:00Z",
      hasAttachment: false,
      isPinned: false,
    },
    {
      id: "3",
      title: "Welcome to Arabic Grammar Fundamentals",
      message:
        "Welcome to our comprehensive Arabic Grammar course! I'm excited to guide you through this journey of learning classical Arabic grammar.\n\nIn this course, we'll cover:\n- Basic sentence structure\n- Verb conjugations\n- Noun declensions\n- Advanced grammatical concepts\n\nPlease make sure to download the course materials and join our first live session this Friday.",
      type: "informational",
      senderName: "Ahmad Hassan",
      isRead: true,
      createdAt: "2024-01-05T09:00:00Z",
      hasAttachment: true,
      attachments: [
        {
          name: "Course_Syllabus.pdf",
          url: "/files/syllabus.pdf",
          type: "PDF",
          size: "1.2 MB",
        },
      ],
      isPinned: true,
    },
  ];

  const handleMarkAsRead = (notificationId) => {
    console.log("Marking notification as read:", notificationId);
    // Implement API call
  };

  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read");
    // Implement API call
  };

  const handleDeleteNotification = (notificationId) => {
    console.log("Deleting notification:", notificationId);
    // Implement API call
  };

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    // Navigate to relevant page or show details
  };

  const handleNavigateToCourse = (courseId) => {
    console.log("Navigating to course:", courseId);
    setCurrentView("course");
  };

  const handleDownloadAttachment = (url, fileName) => {
    console.log("Downloading attachment:", fileName, url);
    // Implement download logic
  };

  return (
    <>
      <Header />
      <main className=" py-2 flex">
        <DashboardSidebar currentRoute={currentRoute} />
        <div className="px-4  w-full py-8 lg:py-0">
          <h1>Notifications</h1>
          <div className="min-h-screen bg-gray-50">
            {/* Header with Navigation */}
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold text-gray-800">
                      IHSAAN Student Portal
                    </h1>
                    <nav className="flex items-center gap-4">
                      <button
                        onClick={() => setCurrentView("bell")}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          currentView === "bell"
                            ? "bg-red-100 text-red-800"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <Notifications className="w-4 h-4" />
                        Notification Bell Demo
                      </button>
                      <button
                        onClick={() => setCurrentView("page")}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          currentView === "page"
                            ? "bg-red-100 text-red-800"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <Campaign className="w-4 h-4" />
                        All Notifications
                      </button>
                      <button
                        onClick={() => setCurrentView("course")}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                          currentView === "course"
                            ? "bg-red-100 text-red-800"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <School className="w-4 h-4" />
                        Course Announcements
                      </button>
                    </nav>
                  </div>

                  {/* Notification Bell - Always visible */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Student View:</span>
                    <StudentNotificationBell
                      notifications={mockNotifications}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onNotificationClick={handleNotificationClick}
                      onViewAll={() => setCurrentView("page")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="py-8">
              {currentView === "bell" && (
                <div className="max-w-4xl mx-auto px-4">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Notifications className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Notification Bell Demo
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Click the notification bell in the top-right corner to see
                      how students receive and interact with notifications.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Features:
                      </h3>
                      <ul className="text-sm text-blue-700 space-y-1 text-left max-w-md mx-auto">
                        <li>
                          • Real-time notification badge with unread count
                        </li>
                        <li>• Quick preview of recent notifications</li>
                        <li>• Mark individual notifications as read</li>
                        <li>• Mark all notifications as read</li>
                        <li>• Navigate to full notification page</li>
                        <li>• Course-specific notification grouping</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {currentView === "page" && (
                <StudentNotificationPage
                  notifications={mockNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDelete={handleDeleteNotification}
                  onNavigateToCourse={handleNavigateToCourse}
                />
              )}

              {currentView === "course" && (
                <StudentCourseAnnouncements
                  courseTitle="Arabic Grammar Fundamentals"
                  courseId="course-1"
                  announcements={mockCourseAnnouncements}
                  onMarkAsRead={handleMarkAsRead}
                  onDownloadAttachment={handleDownloadAttachment}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Page;
