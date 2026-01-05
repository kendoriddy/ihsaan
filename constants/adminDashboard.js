import TouchAppIcon from "@mui/icons-material/TouchApp";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import GroupIcon from "@mui/icons-material/Group";
import PaymentIcon from "@mui/icons-material/Payment";
import AddCardIcon from "@mui/icons-material/AddCard";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LoginIcon from "@mui/icons-material/Login";
import NetworkWifiIcon from "@mui/icons-material/NetworkWifi";
import StarIcon from "@mui/icons-material/Star";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SocialDistanceIcon from "@mui/icons-material/SocialDistance";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";

const ADMINDASHBOARD = {
  mentorList: [
    { id: 1, name: "John Doe", course: "Business", earned: 5000, reviews: 4.5 },
    {
      id: 2,
      name: "Mike Perry",
      course: "Marketing",
      earned: 3200,
      reviews: 4.2,
    },
    {
      id: 3,
      name: "Emma Thompson",
      course: "Finance",
      earned: 4000,
      reviews: 4.8,
    },
    {
      id: 4,
      name: "David Wilson",
      course: "Economics",
      earned: 3800,
      reviews: 4.4,
    },
    {
      id: 5,
      name: "Sophia Martinez",
      course: "Management",
      earned: 4500,
      reviews: 4.6,
    },
    {
      id: 6,
      name: "Oliver Johnson",
      course: "Leadership",
      earned: 5200,
      reviews: 4.9,
    },
    {
      id: 7,
      name: "Emily Davis",
      course: "Entrepreneurship",
      earned: 3000,
      reviews: 4.3,
    },
    {
      id: 8,
      name: "Daniel Anderson",
      course: "Accounting",
      earned: 4800,
      reviews: 4.7,
    },
    {
      id: 9,
      name: "Ava Taylor",
      course: "Human Resources",
      earned: 4200,
      reviews: 4.5,
    },
    {
      id: 10,
      name: "William Brown",
      course: "Sales",
      earned: 5500,
      reviews: 4.8,
    },
    {
      id: 11,
      name: "Mia Wilson",
      course: "Supply Chain",
      earned: 4000,
      reviews: 4.6,
    },
    {
      id: 12,
      name: "Noah Thompson",
      course: "Operations",
      earned: 3800,
      reviews: 4.4,
    },
    {
      id: 13,
      name: "Isabella Davis",
      course: "Project Management",
      earned: 6000,
      reviews: 4.9,
    },
    {
      id: 14,
      name: "Liam Johnson",
      course: "International Business",
      earned: 3200,
      reviews: 4.2,
    },
    {
      id: 15,
      name: "Amelia Brown",
      course: "Risk Management",
      earned: 4500,
      reviews: 4.7,
    },
    {
      id: 16,
      name: "Lucas Wilson",
      course: "Strategic Planning",
      earned: 4800,
      reviews: 4.5,
    },
    {
      id: 17,
      name: "Sophie Thompson",
      course: "Business Analytics",
      earned: 5500,
      reviews: 4.8,
    },
    {
      id: 18,
      name: "Oliver Davis",
      course: "Financial Analysis",
      earned: 4200,
      reviews: 4.6,
    },
    {
      id: 19,
      name: "Emily Wilson",
      course: "Marketing Research",
      earned: 4000,
      reviews: 4.4,
    },
    {
      id: 20,
      name: "Daniel Johnson",
      course: "Data Science for Business",
      earned: 6000,
      reviews: 4.9,
    },
  ],
  menteeList: [
    {
      id: 1,
      name: "John Doe",
      phone: "1234567890",
      lastVisit: "Jan 25, 2024",
      paid: 5000,
    },
    {
      id: 2,
      name: "Mike Perry",
      phone: "90905578",
      lastVisit: "Dec 3, 2023",
      paid: 3200,
    },

    {
      id: 3,
      name: "Jane Smith",
      phone: "987654321",
      lastVisit: "Feb 10, 2024",
      paid: 6000,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      phone: "765432109",
      lastVisit: "Mar 5, 2024",
      paid: 4500,
    },
    {
      id: 5,
      name: "Alex Brown",
      phone: "543210987",
      lastVisit: "Apr 1, 2024",
      paid: 5500,
    },
    {
      id: 6,
      name: "Emily Davis",
      phone: "678901234",
      lastVisit: "May 15, 2024",
      paid: 4000,
    },
    {
      id: 7,
      name: "Daniel Wilson",
      phone: "987654321",
      lastVisit: "Jun 20, 2024",
      paid: 4800,
    },
    {
      id: 8,
      name: "Olivia Taylor",
      phone: "123456789",
      lastVisit: "Jul 10, 2024",
      paid: 5200,
    },
    {
      id: 9,
      name: "Michael Johnson",
      phone: "345678901",
      lastVisit: "Aug 5, 2024",
      paid: 3000,
    },
    {
      id: 10,
      name: "Sophia Martinez",
      phone: "789012345",
      lastVisit: "Sep 25, 2024",
      paid: 6500,
    },
    {
      id: 11,
      name: "William Anderson",
      phone: "234567890",
      lastVisit: "Oct 31, 2024",
      paid: 4200,
    },
    {
      id: 12,
      name: "Ava Thompson",
      phone: "890123456",
      lastVisit: "Nov 15, 2024",
      paid: 3800,
    },
  ],
  bookingList: [
    {
      id: 1001,
      mentorName: "James Amen",
      course: "Math",
      menteeName: "Jonathan Doe",
      bookingTime: "Nov 9, 2023, 11:00 - 12:00",
      status: false,
      amount: 5000,
    },
    {
      id: 1002,
      mentorName: "Emma Thompson",
      course: "English",
      menteeName: "Sophie Johnson",
      bookingTime: "Dec 5, 2023, 14:00 - 15:00",
      status: true,
      amount: 3500,
    },
    {
      id: 1003,
      mentorName: "Michael Brown",
      course: "Science",
      menteeName: "Oliver Davis",
      bookingTime: "Jan 10, 2024, 09:00 - 10:00",
      status: false,
      amount: 2000,
    },
    {
      id: 1004,
      mentorName: "Ella Wilson",
      course: "History",
      menteeName: "Emily Taylor",
      bookingTime: "Feb 15, 2024, 16:00 - 17:00",
      status: false,
      amount: 4500,
    },
    {
      id: 1005,
      mentorName: "Daniel Martinez",
      course: "Physics",
      menteeName: "Lucas Anderson",
      bookingTime: "Mar 20, 2024, 13:00 - 14:00",
      status: true,
      amount: 6000,
    },
    {
      id: 1006,
      mentorName: "Sophia Johnson",
      course: "Chemistry",
      menteeName: "Isabella Thompson",
      bookingTime: "Apr 25, 2024, 10:00 - 11:00",
      status: false,
      amount: 4000,
    },
    {
      id: 1007,
      mentorName: "William Davis",
      course: "Biology",
      menteeName: "Liam Wilson",
      bookingTime: "May 30, 2024, 15:00 - 16:00",
      status: true,
      amount: 5500,
    },
    {
      id: 1008,
      mentorName: "Ava Anderson",
      course: "Geography",
      menteeName: "Mia Brown",
      bookingTime: "Jun 5, 2024, 12:00 - 13:00",
      status: false,
      amount: 3000,
    },
    {
      id: 1009,
      mentorName: "Oliver Taylor",
      course: "Computer Science",
      menteeName: "Noah Martinez",
      bookingTime: "Jul 10, 2024, 11:00 - 12:00",
      status: false,
      amount: 4200,
    },
    {
      id: 1010,
      mentorName: "Emily Smith",
      course: "Art",
      menteeName: "Amelia Johnson",
      bookingTime: "Aug 15, 2024, 14:00 - 15:00",
      status: true,
      amount: 4800,
    },
    {
      id: 1011,
      mentorName: "Lucas Thompson",
      course: "Music",
      menteeName: "Sophie Wilson",
      bookingTime: "Sep 20, 2024, 09:00 - 10:00",
      status: false,
      amount: 3800,
    },
  ],
  sumTotal: {
    members: 250,
    appointments: 900,
    mentoringPoints: 500,
    revenue: 20000,
  },
  notifications: [
    {
      id: 1,
      message: "New message from James Amen",
      time: "Feb 29, 2004, 09:00",
    },
    {
      id: 2,
      message: "New message from Emma Thompson",
      time: "Feb 29, 2004, 10:00",
    },
    {
      id: 3,
      message: "New message from Michael Brown",
      time: "Feb 29, 2004, 11:00",
    },
    {
      id: 4,
      message: "New message from Ella Wilson",
      time: "Feb 29, 2004, 12:00",
    },
    {
      id: 5,
      message: "New message from Daniel Martinez",
      time: "Feb 29, 2004, 13:00",
    },
    {
      id: 6,
      message: "New message from Sophia Johnson",
      time: "Feb 29, 2004, 14:00",
    },
    {
      id: 7,
      message: "New message from William Davis",
      time: "Feb 29, 2004, 15:00",
    },
    {
      id: 8,
      message: "New message from Ava Anderson",
      time: "Feb 29, 2004, 16:00",
    },
    {
      id: 9,
      message: "New message from Oliver Taylor",
      time: "Feb 29, 2004, 17:00",
    },
    {
      id: 10,
      message: "New message from Emily Smith",
      time: "Feb 29, 2004, 18:00",
    },
  ],
  items: [
    {
      id: 1,
      label: "Number of all users (present and past)",
      abbr: "All users",
      icon: Diversity3Icon,
      value: 0, // Replace with actual value
    },
    {
      id: 2,
      label: "Number of main students (ongoing)",
      abbr: "Main students",
      icon: LocalLibraryIcon,
      value: 0, // Replace with actual value
    },
    {
      id: 3,
      label: "Number of students for special programmes (ongoing)",
      abbr: "Special programme students",
      icon: CastForEducationIcon,
      value: 0, // Replace with actual value
    },
    {
      id: 4,
      label: "Number of other users",
      abbr: "Other users",
      icon: GroupIcon,
      value: 0, // Replace with actual value
    },
    {
      id: 5,
      label: "Number of pending tutor applications",
      abbr: "Pending tutor apps",
      icon: PendingActionsIcon,
      value: 0, // Replace with actual value
    },
    {
      id: 6,
      label: "Number of pending student applications",
      abbr: "Pending student apps",
      icon: AppRegistrationIcon,
      value: 0, // Replace with actual value
    },
  ],
};

export { ADMINDASHBOARD };
