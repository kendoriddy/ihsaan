"use client";

import { useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import { Divider } from "@mui/material";

function Page() {
  const currentRoute = usePathname();
  const [currentOption, setCurrentOption] = useState("general-settings");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleCurrentOption = (option) => {
    setCurrentOption(option);
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
          className=" lg:ml-[250px] w-screen p-4"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}>
          {/*  */}
          <div>
            {/* Top */}
            <div className="text-lg font-bold">Settings</div>
            {/* Options top */}
            <div className="py-4 flex flex-wrap gap-4 items-center py-8">
              <div
                className={`${
                  currentOption === "general-settings" && "theme-btn"
                } cursor-pointer`}
                onClick={() => handleCurrentOption("general-settings")}>
                General settings
              </div>
              <div
                className={`${
                  currentOption === "payment-gateway" && "theme-btn"
                } cursor-pointer`}
                onClick={() => handleCurrentOption("payment-gateway")}>
                Payment gateway
              </div>
              <div
                className={`${
                  currentOption === "social-login" && "theme-btn"
                } cursor-pointer`}
                onClick={() => handleCurrentOption("social-login")}>
                Social login
              </div>
            </div>
            {/* Bottom */}
            <div>
              {/* First Form */}
              <div
                className={`${
                  currentOption === "general-settings" ? "block" : "hidden"
                }`}>
                <form action="" className="border rounded p-4 max-w-[500px]">
                  <div>General Setting</div>
                  <div className="pt-2">
                    <Divider />
                  </div>
                  <div className=" flex gap-4 flex-col lg:flex-row py-3">
                    <input
                      type="text"
                      name="website"
                      id="website"
                      placeholder="Website name"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                  </div>
                  <div className=" flex  flex-col py-3">
                    <input
                      type="file"
                      name="websiteLogo"
                      id="websiteLogo"
                      placeholder="Website logo"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                    <span className="text-gray-400 text-sm">
                      Recommended image size is 150px x 150px
                    </span>
                  </div>
                  <div className=" flex flex-col py-3">
                    <input
                      type="file"
                      name="favicon"
                      id="favicon"
                      placeholder="Favicon"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                    <span className="text-gray-400 text-sm">
                      Recommended image size is 16px x 16px or 32px x 32px
                    </span>
                    <span className="text-gray-400 text-sm">
                      Accepted formats : only png and ico
                    </span>
                  </div>
                  {/* Submit Buttons */}
                  <div className="flex  py-4 justify-center">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300">
                      Save
                    </button>
                  </div>
                </form>
              </div>
              {/* Second Form */}
              <div
                className={`${
                  currentOption === "payment-gateway" ? "block" : "hidden"
                }`}>
                <form action="" className="border rounded p-4 max-w-[500px]">
                  <div>Payment Gateway</div>
                  <div className="pt-2">
                    <Divider />
                  </div>
                  <div className=" flex  py-3">
                    <fieldset className="flex gap-4">
                      <legend>Strip options:</legend>

                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="sandbox"
                          name="stripOption"
                          value="sandbox"
                          checked
                        />
                        <label for="sandbox">Sandbox</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="live"
                          name="stripOption"
                          value="live"
                          checked
                        />
                        <label for="live">Live</label>
                      </div>
                    </fieldset>
                  </div>
                  <div className=" flex  flex-col  py-3">
                    <input
                      type="text"
                      name="gateway"
                      id="gateway"
                      placeholder="Gateway name"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                    <span className="text-gray-400 text-sm pl-2">
                      (e.g Stripe)
                    </span>
                  </div>
                  <div className=" flex  flex-col py-3">
                    <input
                      type="text"
                      name="apiKey"
                      id="apiKey"
                      placeholder="API Key "
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                    <span className="text-gray-400 text-sm pl-2">
                      (e.g pk_test_AealxxOygZz84...)
                    </span>
                  </div>
                  <div className=" flex flex-col py-3">
                    <input
                      type="text"
                      name="restkey"
                      id="restkey"
                      placeholder="Rest Key "
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                    <span className="text-gray-400 text-sm pl-2">
                      (e.g sk_test_8HwqAWwBd4C4E77bg...)
                    </span>
                  </div>
                  {/* Submit Buttons */}
                  <div className="flex  py-4 justify-center">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300">
                      Save
                    </button>
                  </div>
                </form>
              </div>
              {/* Third Form */}
              <div
                className={`${
                  currentOption === "social-login" ? "block" : "hidden"
                }`}>
                <form action="" className="border rounded p-4 max-w-[500px]">
                  <div>Social Login</div>
                  <div className="pt-2">
                    <Divider />
                  </div>

                  <div className=" flex  flex-col py-3">
                    <input
                      type="text"
                      name="facebookID"
                      id="facebookID"
                      placeholder="Facebook ID"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                    <span className="text-gray-400 text-sm">
                      <Link
                        href={
                          "https://www.codexworld.com/create-facebook-app-id-app-secret/"
                        }
                        target="_blank">
                        How to Create facebook app id?
                      </Link>
                    </span>
                  </div>
                  <div className=" flex flex-col py-3">
                    <input
                      type="text"
                      name="googleClientID"
                      id="googleClientID"
                      placeholder="Google Client ID (e.g 1234567890-abc123def456.apps.googleusercontent.com)"
                      className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded w-full"
                    />
                    <span className="text-gray-400 text-sm">
                      <Link
                        href={
                          "https://www.codexworld.com/create-google-developers-console-project/"
                        }
                        target="_blank">
                        How to Create google client id?
                      </Link>
                    </span>
                  </div>
                  {/* Submit Buttons */}
                  <div className="flex  py-4 justify-center">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
