import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import ScheduleIcon from "@mui/icons-material/Schedule";
import QuizIcon from "@mui/icons-material/Quiz";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { StarRateSharp } from "@mui/icons-material";

const DASHBOARD_LIST = {
  mentor: [
    { id: 1, name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    {
      id: 2,
      name: "Bookings",
      icon: BookmarkIcon,
      path: "/dashboard/my-bookings",
    },
    {
      id: 3,
      name: "Quiz",
      icon: QuizIcon,
      path: "/quiz",
    },
    {
      id: 4,
      name: "Read Carefully",
      icon: MenuBookIcon,
      path: "/read",
    },
    {
      id: 5,
      name: "Start Quiz",
      icon: ScheduleIcon,
      path: "/startquiz",
    },
    {
      id: 5,
      name: "Assignment",
      icon: IntegrationInstructionsIcon,
      path: "/assignment",
    },
    {
      id: 5,
      name: "Submit Assignment",
      icon: QuizIcon,
      path: "/submit",
    },
    {
      id: 5,
      name: "Review",
      icon:StarRateSharp,
      path: "/review",
    },
    {
      id: 6,
      name: "Mentors Training",
      icon: CastForEducationIcon,
      path: "/dashboard/my-mentors",
    },
    {
      id: 7,
      name: "Mentees Instruction",
      icon: MenuBookIcon,
      path: "/dashboard/mentees-instruction",
    },
    {
      id: 8,
      name: "Counsellor Manual",
      icon: QuizIcon,
      path: "/dashboard/counsellor-manual",
    },
    {
      id: 9,
      name: "Counsellor Instruction",
      icon: IntegrationInstructionsIcon,
      path: "/dashboard/counsellor-instruction",
    },
    {
      id: 10,
      name: "Profile Settings",
      icon: Person2Icon,
      path: "/dashboard/settings",
    },
    {
      id: 11,
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
      id: 3,
      name: "Tutor Application",
      path: "/admin/tutor",
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
    { id: 11, name: "Transactions", path: "/admin/transactions" },
    {
      id: 12,
      name: "Reports",
      path: "#",
      subMenu: [
        { id: 1, name: "Invoice Reports", path: "/admin/invoice-reports" },
      ],
    },
    { id: 13, name: "My Profile", path: "/admin/profile" },
    {
      id: 14,
      name: "Blog",
      path: "/admin/blog",
    },
  ],
};

export { DASHBOARD_LIST };
