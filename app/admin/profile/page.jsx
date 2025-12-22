"use client";

import Image from "next/image";
import { useState } from "react";
import { IMAGES } from "@/constants";
import Divider from "@mui/material/Divider";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AdminLayout from "@/components/AdminLayout";
import { useFetch } from "@/hooks/useHttp/useHttp";
import ChangePassword from "./components/ChangePassword";
import EditProfile from "./components/EditProfile";

function Page() {
  const [isModalClose, setIsModalClose] = useState(true);
  const [activeElement, setActiveElement] = useState("about");

  const setAside = () => setActiveElement("about");
  const setPassword = () => setActiveElement("password");

  const { isLoading, data, refetch, isFetching } = useFetch(
    "userProfile",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-profile/me/`,
    (data) => {}
  );

  const profile = data?.data;

  return (
    <AdminLayout>
      {/* Main Body */}
      <section className="w-full">
        <div>
          <div className="p-2 font-bold text-lg md:text-xl bg-white">
            Personal Profile
          </div>

          {/* Name Box */}
          <div className="border rounded p-6">
            {/* Top */}
            <div className="flex items-center">
              <div className="min-w-[120px]">
                <div className="w-[100px] h-[100px] rounded-full relative overflow-hidden">
                  <Image
                    src={
                      profile?.profile_picture
                        ? profile.profile_picture
                        : IMAGES.user1
                    }
                    alt="profile picture"
                    fill
                    className=""
                  />
                </div>
              </div>
              <div>
                <div className="py-2">
                  <div className="text-lg font-bold">{profile?.full_name}</div>
                  <div>{profile?.email}</div>
                  <p>{profile?.date_of_birth}</p>
                </div>
              </div>
            </div>

            <Divider />

            {/* Bottom */}
            <div className="pt-3 flex gap-4 items-center">
              <span
                className={`cursor-pointer  ${
                  activeElement === "about" &&
                  "bg-red-600 px-3 py-2 rounded text-white inline-block"
                }`}
                onClick={setAside}
              >
                About
              </span>
              <span
                className={`cursor-pointer ${
                  activeElement == "password" &&
                  "bg-red-600 px-3 py-2 rounded text-white inline-block"
                }`}
                onClick={setPassword}
              >
                Password
              </span>
            </div>
          </div>

          {/* Personal Details - About Bottom */}
          <div
            className={`border rounded p-6 mt-8 ${
              activeElement === "about" ? "block" : "hidden"
            }`}
          >
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg">Personal Details</div>
              <div
                onClick={() => setIsModalClose(false)}
                className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
              >
                <span>
                  {" "}
                  <EditNoteIcon />{" "}
                </span>
                <span> Edit </span>
              </div>
            </div>

            {/* Others */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Full Name</div>
                <div>{profile?.full_name || "—"}</div>
              </div>

              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Date of Birth</div>
                <div>{profile?.date_of_birth || "—"}</div>
              </div>

              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Email</div>
                <div>{profile?.email || "—"}</div>
              </div>

              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Mobile</div>
                <div>{profile?.phone_number || "—"}</div>
              </div>

              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Gender</div>
                <p className="capitalize">
                  {profile?.gender.toLowerCase() || "—"}
                </p>
              </div>

              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Marital Status</div>
                <p className="capitalize">
                  {profile?.marital_status.toLowerCase() || "—"}
                </p>
              </div>

              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Religion</div>
                <div>{profile?.religion || "—"}</div>
              </div>

              <div className="py-2 flex items-center">
                <div className="min-w-[140px] font-medium">Country</div>
                <div>{profile?.country || "—"}</div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div
            className={`border rounded p-6 mt-8 ${
              activeElement === "password" ? "block" : "hidden"
            }`}
          >
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="text-lg">Change Password</div>
            </div>

            <ChangePassword />
          </div>
        </div>
      </section>

      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
          isModalClose && "hidden"
        }`}
      >
        <div className="w-screen h-screen flex justify-center items-center  p-4  ">
          <div className="bg-white w-4/5 h-4/5 rounded overflow-y-scroll">
            {/* Top */}
            <div>
              <div className="flex justify-between items-center p-4">
                <div className="text-lg font-bold">Edit Profile</div>
                <div
                  className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                  onClick={() => setIsModalClose(true)}
                >
                  Close
                </div>
              </div>
              <Divider />
            </div>

            <EditProfile
              profile={profile}
              refetch={refetch}
              onClose={() => setIsModalClose(true)}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Page;
