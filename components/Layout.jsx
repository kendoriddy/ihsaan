"use client";

import RequireAuth from "@/app/lib/ReuquireAuth";
import Header from "./Header";
import DashboardSidebar from "./DashboardSidebar";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import WavingHandIcon from "@mui/icons-material/WavingHand";

const Layout = ({ children }) => {
  const currentRoute = usePathname();
  const user = useSelector(currentlyLoggedInUser);

  return (
    <RequireAuth>
      <Header />
      {/* Main */}
      <main className=" py-2 flex">
        {/* Sidebar */}
        <DashboardSidebar currentRoute={currentRoute} />

        <section className="flex flex-col md:flex-row w-full p-4 justify-self-center flex-1 min-h-screen">
          {/* Right */}
          <div className="md:px-4 py-8 lg:py-0">
            <div className="text-sm my-3">
              Welcome <span className="text-lg">{user.name}</span>{" "}
              <WavingHandIcon sx={{ color: "blue", fontSize: "2rem" }} />
            </div>
            {children}{" "}
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </RequireAuth>
  );
};

export default Layout;
