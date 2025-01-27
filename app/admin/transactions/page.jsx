"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";

function Page() {
  const currentRoute = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />
        {/* Main Body */}
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}>
          {/*  */}
          <div>
            {/*  Table */}
            <div className="mt-4 flex-1 max-h-[650px] overflow-y-scroll relative py-4  ">
              <div className="p-2 font-bold  bg-white">Transactions</div>
              <table className="table-auto w-full rounded bg-gray-50 ">
                <thead className="sticky top-[-20px] bg-gray-100 z-20 text-left">
                  <tr className="border text-red-600">
                    <th className=" border px-4 py-2">Invoice Number</th>
                    <th className=" border px-4 py-2">Mentee ID</th>
                    <th className=" border px-4 py-2">Mentee Name</th>
                    <th className=" border px-4 py-2">Total Amount</th>
                    <th className=" border px-4 py-2"> Status</th>
                    <th className=" border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-gray-100 hover:bg-gray-200">
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                  </tr>
                  <tr className="even:bg-gray-100 hover:bg-gray-200">
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                  </tr>
                  <tr className="even:bg-gray-100 hover:bg-gray-200">
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                    <td className="border px-4 py-2">Transaction</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
