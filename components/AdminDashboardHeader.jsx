"use client";

import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect, useState } from "react";
import { ADMINDASHBOARD, IMAGES } from "@/constants";
import Link from "next/link";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import { logoutUser } from "@/utils/redux/slices/auth.reducer";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function AdminDashboardHeader({ toggleSidebar }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleToggleSidebar = () => toggleSidebar();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };
  console.log(user, "oooo");
  const handleLogOut = () => {
    dispatch(logoutUser());
    router.push("/");
    toast.info("Logged out successfully");
  };

  return (
    <header className="flex justify-between items-center p-3 sticky top-0  text-sm z-40 bg-white">
      {/* Left */}
      <div className="block lg:hidden">
        <MenuIcon sx={{ fontSize: 40 }} onClick={handleToggleSidebar} />
      </div>

      {/* Logo */}

      <div className="text-sm my-3">
        Welcome <span className="text-lg">{user?.name}</span>{" "}
        <WavingHandIcon sx={{ color: "blue", fontSize: "2rem" }} />
      </div>

      {/* right */}
      <div className="flex items-center  gap-6">
        {/* Notification */}
        <div className="relative ">
          <Badge
            badgeContent={4}
            color="primary"
            className="navlink cursor-pointer"
            onClick={toggleNotification}
          >
            <NotificationsActiveIcon />
          </Badge>
          <div
            className={`absolute left-[-250px] lg:left-[-275px] overflow-hidden bg-gray-300 transition-all duration-300 rounded-md border  ${
              isNotificationOpen
                ? "h-[320px] w-[280px] lg:w-[300px]"
                : "h-0 w-0 overflow-hidden"
            }`}
          >
            <div className="h-full w-full relative">
              {/* Top */}
              <div className="flex justify-between items-center h-[40px] bg-gray-400 px-2">
                <span>Notifications</span>
                <span className="link ">Clear</span>
              </div>
              {/* Mid */}
              <div className="flex-1 h-[240px] overflow-y-scroll ">
                {ADMINDASHBOARD.notifications?.map((notification, index) => (
                  <div
                    key={index}
                    className="even:bg-gray-200 px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div>{notification.message}</div>
                    <div className="text-xs text-gray-900">
                      {notification.time}
                    </div>
                  </div>
                ))}
              </div>
              {/* Bottom */}
              <div className="flex justify-center items-center text-center h-[40px] bg-gray-400 absolute left-0 bottom-0 w-full cursor-pointer hover:bg-gray-500 hover:text-white">
                <Link href="/admin/notifications">View all notifications</Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            className="flex cursor-pointer"
          >
            <div className="w-[35px] h-[35px] rounded-full relative overflow-hidden p-3">
              <Image src={IMAGES.user1} alt="avatar" fill className="" />
            </div>

            <div>
              {anchorEl !== null && (
                <KeyboardArrowUpIcon sx={{ fontSize: 40 }} />
              )}

              {anchorEl === null && (
                <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
              )}
            </div>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>
              <Link href={"/admin/profile"}>Profile</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href={"/admin/settings"}>My account</Link>
            </MenuItem>
            <MenuItem onClick={handleLogOut}>
              <Link href={"/admin/login"}>Logout</Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}

export default AdminDashboardHeader;
