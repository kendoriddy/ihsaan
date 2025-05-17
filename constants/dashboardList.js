import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import ScheduleIcon from "@mui/icons-material/Schedule";
import QuizIcon from "@mui/icons-material/Quiz";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { Assignment, AssignmentInd } from "@mui/icons-material";
import GradingOutlined from "@mui/icons-material/GradingOutlined";
import { TbActivity } from "react-icons/tb";

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
      icon: TbActivity,
      path: "/activities",
    },
    {
      id: 5,
      name: "Applications",
      icon: BookmarkIcon,
      path: "/dashboard/my-applications",
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
      name: "Grading",
      icon: GradingOutlined,
      path: "/manual-grading",
    },
    { id: 10, name: "Logout", icon: LogoutIcon, path: "/login" },
  ],
  mentor: [
    { id: 1, name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    {
      id: 12,
      name: "Applications",
      icon: BookmarkIcon,
      path: "/dashboard/my-applications",
    },
    {
      id: 2,
      name: "Bookings",
      icon: BookmarkIcon,
      path: "/dashboard/my-bookings",
    },
    {
      id: 3,
      name: "Sessions",
      icon: ScheduleIcon,
      path: "/dashboard/sessions",
    },
    {
      id: 4,
      name: "Mentors Training",
      icon: CastForEducationIcon,
      path: "/dashboard/my-mentors",
    },
    {
      id: 5,
      name: "Assignment",
      icon: Assignment,
      path: "/assignment",
    },
    {
      id: 6,
      name: "Take Quiz",
      icon: QuizIcon,
      path: "/quiz",
    },
    {
      id: 7,
      name: "Counsellor Instruction",
      icon: IntegrationInstructionsIcon,
      path: "/dashboard/counsellor-instruction",
    },
    {
      id: 8,
      name: "Profile Settings",
      icon: Person2Icon,
      path: "/dashboard/settings",
    },
    {
      id: 9,
      name: "Orders",
      icon: StorefrontIcon,
      path: "/dashboard/orders",
    },
    { id: 10, name: "Logout", icon: LogoutIcon, path: "/login" },
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
      id: 16,
      name: "Student Application",
      path: "/admin/student",
    },
    {
      id: 3,
      name: "Mentor",
      path: "/admin/mentor",
    },
    {
      id: 4,
      name: "Mentee",
      path: "/admin/mentee",
    },
    {
      id: 5,
      name: "Booking List",
      path: "/admin/bookings",
    },
    {
      id: 6,
      name: "Categories",
      path: "/admin/categories",
    },
    { id: 7, name: "Books", path: "/admin/books" },
    { id: 8, name: "Courses", path: "/admin/courses" },
    { id: 9, name: "FAQs", path: "/admin/faqs" },
    { id: 10, name: "Quotes", path: "/admin/quotes" },
    {
      id: 11,
      name: "Set Quiz",
      path: "/admin/set-quiz",
    },
    {
      id: 12,
      name: "Activities Settings",
      path: "/admin/activities-settings",
    },
    { id: 13, name: "Transactions", path: "/admin/transactions" },
    {
      id: 14,
      name: "Reports",
      path: "#",
      subMenu: [
        { id: 1, name: "Invoice Reports", path: "/admin/invoice-reports" },
      ],
    },
    { id: 15, name: "My Profile", path: "/admin/profile" },
    {
      id: 16,
      name: "Blog",
      path: "/admin/blog",
    },
  ],
};

export { DASHBOARD_LIST };
