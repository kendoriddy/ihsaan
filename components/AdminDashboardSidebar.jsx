import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DASHBOARD_LIST } from "@/constants";
import { userRole } from "@/utils/redux/slices/auth.reducer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function AdminDashboardSidebar({
  isSidebarOpen,
  toggleOption,
  openSubMenuIndex,
  currentRoute,
}) {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const userRole = localStorage.getItem("roles");
    const user = userRole ? JSON.parse(userRole) : null;
    setRoles(user);
  }, []);

  // const roles = localStorage.getItem("roles");
  const isAdmin = roles.includes("ADMIN");
  const isSuperAdmin = roles.includes("SUPERADMIN");
  const roles2 = useSelector(userRole);

  const filteredDashboardList = DASHBOARD_LIST.admin.filter(
    (item) => !(isAdmin && item.name === "Account Manager")
  );
  return (
    <section
      className={`${!isSidebarOpen && "w-0"} ${
        isSidebarOpen && "w-[250px]"
      }  lg:w-[250px] h-auto  fixed overflow-y-scroll transition-all duration-300 py-4 bg-white border-r-2 z-30`}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="text-blue-600 flex items-center px-4 gap-4">   
        <span>
          <HomeIcon />
        </span>
        <span>Main</span>
        <div className="ms-5 text-black">Admin </div>
      </div>

      <div>
        {isAdmin && (
          <ul className="p-4">
            {filteredDashboardList.map((item, index) => (
              <li key={index}>
                <Link href={item.path}>
                  <span
                    className={`p-2 transition-all duration-300 rounded overflow-y-hidden flex justify-between ${
                      currentRoute === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 hover:pl-3"
                    } `}
                  >
                    <span>{item.name}</span>
                    <span>
                      {item.path === "#" && (
                        <ArrowForwardIosIcon
                          onClick={() => toggleOption(index)}
                        />
                      )}
                    </span>
                  </span>
                </Link>

                {/* Sub List */}
                {item.subMenu && (
                  <ul
                    className={`overflow-hidden ${
                      openSubMenuIndex === index ? "h-auto" : "h-0"
                    } transition-all duration-300`}
                    style={{ transitionTimingFunction: "ease-in-out" }}
                  >
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link href={subItem.path}>
                          <span
                            className={`py-2 px-4 transition-all duration-300 rounded overflow-y-hidden flex justify-between ${
                              currentRoute === item.path
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100 hover:pl-3"
                            } `}
                          >
                            <span>{subItem.name}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
        {isSuperAdmin && (
          <ul className="p-4">
            {DASHBOARD_LIST.admin.map((item, index) => (
              <li key={index}>
                <Link href={item.path}>
                  <span
                    className={`p-2 transition-all duration-300 rounded overflow-y-hidden flex justify-between ${
                      currentRoute === item.path
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 hover:pl-3"
                    } `}
                  >
                    <span>{item.name}</span>
                    <span>
                      {item.path === "#" && (
                        <ArrowForwardIosIcon
                          onClick={() => toggleOption(index)}
                        />
                      )}
                    </span>
                  </span>
                </Link>

                {/* Sub List */}
                {item.subMenu && (
                  <ul
                    className={`overflow-hidden ${
                      openSubMenuIndex === index ? "h-auto" : "h-0"
                    } transition-all duration-300`}
                    style={{ transitionTimingFunction: "ease-in-out" }}
                  >
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link href={subItem.path}>
                          <span
                            className={`py-2 px-4 transition-all duration-300 rounded overflow-y-hidden flex justify-between ${
                              currentRoute === item.path
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100 hover:pl-3"
                            } `}
                          >
                            <span>{subItem.name}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default AdminDashboardSidebar;
