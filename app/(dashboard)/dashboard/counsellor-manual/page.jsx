"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { useSelector } from "react-redux";
import { currentlyLoggedInUser } from "@/utils/redux/slices/auth.reducer";
import RequireAuth from "@/app/lib/ReuquireAuth";

function Page() {
  const currentRoute = usePathname();
  const user = useSelector(currentlyLoggedInUser);

  return (
    <RequireAuth>
      <Header />
      {/* Main */}
      <main className=" py-2 flex">
        <DashboardSidebar currentRoute={currentRoute} />

        <section className="flex flex-col md:flex-row p-4 justify-self-center flex-1 min-h-screen">
          {/* Right */}
          <div className="px-4  w-full py-8 lg:py-0">
            <div className="text-sm my-3">
              Welcome <span className="text-lg">{user.name}</span>{" "}
              <WavingHandIcon sx={{ color: "blue", fontSize: "2rem" }} />
            </div>
            {/*  Table */}
            <div className="flex-1 max-h-[500px] overflow-y-scroll relative">
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-primary">
                    <th className=" border px-4 py-2">Basic info</th>
                    <th className=" border px-4 py-2">Created Date</th>
                    <th className=" border px-4 py-2">Status</th>
                    <th className=" border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-gray-100 hover:bg-gray-200">
                    <td className="border px-4 py-2">Dummy</td>
                    <td className="border px-4 py-2">Dummy</td>
                    <td className="border px-4 py-2">Dummy</td>
                    <td className="border px-4 py-2">Dummy</td>
                  </tr>
                  <tr className="even:bg-gray-100 hover:bg-gray-200">
                    <td className="border px-4 py-2">Dummy</td>
                    <td className="border px-4 py-2">Dummy</td>
                    <td className="border px-4 py-2">Dummy</td>
                    <td className="border px-4 py-2">Dummy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </RequireAuth>
  );
}

export default Page;
