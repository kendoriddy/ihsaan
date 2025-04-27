"use client";

import { DASHBOARD_LIST, MENTORS } from "@/constants";
import Rating from "@mui/material/Rating";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProfileCompletionRate from "@/components/ProfileCompletionRate";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/utils/redux/slices/auth.reducer";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { setUserRoles } from "@/utils/redux/userSlice";

function DashboardSidebar({ currentRoute }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [dashboardItems, setDashboardItems] = useState([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.info("Logged out successfully");
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRoles = JSON.parse(localStorage.getItem("roles"));
      if (!userRoles) {
        router.push("/login");
        toast.info("Login to continue");
      } else {
        dispatch(setUserRoles(userRoles));
        setRoles(userRoles);
      }
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (roles.includes("STUDENT")) {
      setDashboardItems(DASHBOARD_LIST.student);
    } else if (roles.includes("TUTOR")) {
      setDashboardItems(DASHBOARD_LIST.tutor);
    } else if (roles.includes("MENTOR")) {
      setDashboardItems(DASHBOARD_LIST.mentor);
    } else {
      setDashboardItems([]);
    }
  }, [roles]);

  return (
    <section className="flex relative md:w-64">
      {/* Mobile Hamburger Menu */}
      <div className="absolute top-4 left-4 md:hidden z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 focus:outline-none bg-gray-800 text-white rounded-md"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        className={`absolute top-0 left-0 min-h-screen h-full w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out z-40 py-4 rounded-r-lg overflow-scroll ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Left Top */}
        <div className="flex flex-col items-center text-center">
          <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden p-3 shadow-md">
            <Image
              src={MENTORS[0].image}
              alt="mentor"
              // width={350}
              // height={350}
              fill
              className="rounded-full p-1"
            />
          </div>
          <div className="py-2">
            <Rating
              name="read-only"
              value={MENTORS[0].rating}
              readOnly
              precision={0.5}
              size="small"
            />
            <div className="text-gray-500">{MENTORS[0].title}</div>
          </div>
        </div>

        {/* Left Middle */}
        <div className="px-4 py-12">
          <ProfileCompletionRate />
        </div>

        {/* Left list */}
        <div>
          <ul className="px-4">
            {dashboardItems.map((item) => (
              <li key={item.id}>
                {item.name === "Logout" ? (
                  <div
                    onClick={handleLogout}
                    className={`flex items-center justify-between pl-2 py-2 cursor-pointer transition-all duration-300 rounded ${
                      currentRoute === item.path && "bg-primary text-white"
                    } ${
                      currentRoute !== item.path &&
                      "hover:bg-gray-100 hover:pr-3 text-primary"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2" />
                      <span>{item.name}</span>
                    </div>
                    <div>
                      <ChevronRightIcon />
                    </div>
                  </div>
                ) : (
                  <Link href={item.path}>
                    <div
                      className={`flex items-center justify-between pl-2 py-2 cursor-pointer transition-all duration-300 rounded ${
                        currentRoute === item.path && "bg-primary text-white"
                      } ${
                        currentRoute !== item.path &&
                        "hover:bg-gray-100 hover:pr-3"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2" />
                        <span>{item.name}</span>
                      </div>
                      <div>
                        <ChevronRightIcon />
                      </div>
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DashboardSidebar;
