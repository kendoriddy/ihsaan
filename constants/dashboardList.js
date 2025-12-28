import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import ScheduleIcon from "@mui/icons-material/Schedule";
import QuizIcon from "@mui/icons-material/Quiz";
import AssessmentIcon from "@mui/icons-material/Assessment";

import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Assignment,
  AssignmentInd,
  BookSharp,
  LocalActivity,
  LocalActivityTwoTone,
} from "@mui/icons-material";
import GradingOutlined from "@mui/icons-material/GradingOutlined";
import FeedbackIcon from "@mui/icons-material/Feedback";

const DASHBOARD_LIST = {
  student: [
    { id: 1, name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    {
      id: 2,
      name: "Assignment",
      icon: Assignment,
      path: "/assignment",
    },
    {
      id: 3,
      name: "Take Quiz",
      icon: QuizIcon,
      path: "/quiz",
    },
    {
      id: 4,
      name: "Activities",
      icon: LocalActivityTwoTone,
      path: "/activities",
    },
    {
      id: 21,
      name: "Notifications and Announcements",
      icon: LocalActivity,
      path: "/dashboard/notifications",
    },
    {
      id: 13,
      name: "Courses",
      icon: BookSharp,
      path: "/courses/my-courses",
    },
    {
      id: 14,
      name: "Store",
      icon: StorefrontIcon,
      path: "/store",
    },
    {
      id: 12,
      name: "Applications",
      icon: BookmarkIcon,
      path: "/dashboard/my-applications",
    },
    {
      id: 15,
      name: "Forums",
      icon: GradingOutlined,
      path: "/forums",
    },
    {
      id: 16,
      name: "Feedback",
      icon: FeedbackIcon,
      path: "/dashboard/feedback",
    },
    {
      id: 17,
      name: "Reports",
      icon: AssessmentIcon,
      path: "/reports",
    },
    { id: 10, name: "Logout", icon: LogoutIcon, path: "/login" },
  ],
  tutor: [
    { id: 1, name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    {
      id: 2,
      name: "Applications",
      icon: BookmarkIcon,
      path: "/dashboard/my-applications",
    },
    {
      id: 3,
      name: "Assignment and Quiz",
      icon: AssignmentInd,
      path: "/set-assignment",
    },
    {
      id: 4,
      name: "Assessment Grading",
      icon: GradingOutlined,
      path: "/assessment-grading",
    },
    {
      id: 5,
      name: "Manual Grading",
      icon: GradingOutlined,
      path: "/manual-grading",
    },
    {
      id: 6,
      name: "Forums",
      icon: GradingOutlined,
      path: "/forums",
    },
    {
      id: 7,
      name: "Feedback",
      icon: FeedbackIcon,
      path: "/dashboard/feedback",
    },
    {
      id: 8,
      name: "Reports",
      icon: AssessmentIcon,
      path: "/reports",
    },
    {
      id: 9,
      name: "Notifications and Announcements",
      icon: LocalActivity,
      path: "/dashboard/notifications",
    },
    {
      id: 10,
      name: "Qur'an Tutor",
      icon: CastForEducationIcon,
      path: "/dashboard/quran-tutor",
    },
    { id: 11, name: "Logout", icon: LogoutIcon, path: "/login" },
  ],

  admin: [
    { id: 1, name: "Dashboard", path: "/admin/dashboard" },
    { id: 2, name: "Account Manager", path: "/admin/account-manager" },
    {
      id: 15,
      name: "Tutor Application",
      path: "/admin/tutor",
    },
    {
      id: 99,
      name: "Qur'an Tutor Apps",
      path: "/admin/quran-tutor-apps",
    },
    {
      id: 16,
      name: "Student Application",
      path: "/admin/student",
    },
    { id: 8, name: "Courses", path: "/admin/courses" },
    // { id: 9, name: "Products", icon: StorefrontIcon, path: "/admin/products" },
    { id: 10, name: "FAQs", path: "/admin/faqs" },
    { id: 11, name: "Quotes", path: "/admin/quotes" },
    {
      id: 12,
      name: "Set Quiz",
      path: "/admin/set-quiz",
    },
    {
      id: 13,
      name: "Activities Settings",
      path: "/admin/activities-settings",
    },
    {
      id: 14,
      name: "Manual Grading",
      icon: GradingOutlined,
      path: "/admin/manual-grading",
    },
    {
      id: 15,
      name: "Blog Categories",
      path: "/admin/blog-categories",
    },
    {
      id: 16,
      name: "Blog",
      path: "/admin/blog",
    },
    {
      id: 17,
      name: "Notifications and Announcements",
      path: "/admin/notifications",
    },
    {
      id: 18,
      name: "Newsletter",
      path: "/admin/newsletter",
    },
    {
      id: 19,
      name: "Feedback",
      icon: FeedbackIcon,
      path: "/admin/feedback",
    },
    {
      id: 20,
      name: "Reports",
      icon: AssessmentIcon,
      path: "/admin/reports",
    },
    {
      id: 21,
      name: "Audit Trail",
      path: "/admin/audit-trail",
    },
    { id: 22, name: "My Profile", path: "/admin/profile" },
  ],
};

export { DASHBOARD_LIST };
