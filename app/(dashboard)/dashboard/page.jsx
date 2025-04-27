"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { MENTORS } from "@/constants";
import { usePathname } from "next/navigation";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DashboardSidebar from "@/components/DashboardSidebar";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import RequireAuth from "@/app/lib/ReuquireAuth";
import UserDashTab from "@/components/dashboard-components/UserDashTab";
function Page() {
  const currentRoute = usePathname();
  const user = useSelector(currentlyLoggedInUser);

  return (
    <RequireAuth>
      <Header />
      {/* Main */}
      <main className=" py-2 flex">
        {/* Sidebar */}
        <DashboardSidebar currentRoute={currentRoute} />

        <section className="flex flex-col md:flex-row p-4 justify-self-center flex-1 min-h-screen">
          {/* Right */}
          <div className="px-4  w-full py-8 lg:py-0">
            {/* Top */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="bg-primary text-white w-full lg:w-[220px] h-[75px] flex items-center px-4 rounded">
                <div className="flex items-center gap-4 text-md">
                  <div className="text-primary">
                    <GroupsIcon sx={{ fontSize: 40 }} />
                  </div>
                  <div className="flex flex-col">
                    <span>{MENTORS[0].mentees.total}</span>
                    <span>Mentees</span>
                  </div>
                </div>
              </div>
              <div className="bg-primary text-white  w-full lg:w-[220px] h-[75px] flex items-center px-4 rounded">
                <div className="flex items-center gap-4 text-md">
                  <div className="text-primary">
                    <AccessTimeIcon sx={{ fontSize: 40 }} />
                  </div>
                  <div className="flex flex-col">
                    <span>{MENTORS[0].appointments}</span>
                    <span>Appointments</span>
                  </div>
                </div>
              </div>
              <div className="bg-primary text-white  w-full lg:w-[220px] h-[75px] flex items-center px-4 rounded">
                <div className="flex items-center gap-4 text-md">
                  <div className="text-primary">
                    <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />
                  </div>
                  <div className="flex flex-col">
                    <span>{MENTORS[0].totalEarned}</span>
                    <span>Total Earned</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm my-3">
              Welcome <span className="text-lg">{user.name}</span>{" "}
              <WavingHandIcon sx={{ color: "blue", fontSize: "2rem" }} />
            </div>

            <UserDashTab />
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </RequireAuth>
  );
}

export default Page;
