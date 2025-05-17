"use client";

import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [userData, setUserData] = useState({});

  const fetchUserData = () => {
    const storedUserData = localStorage.getItem("userFullData");
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Invalid user data in localStorage");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <Layout>
        <div className="p-6 text-gray-600">Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">User Profile</h2>

        <div className="space-y-3">
          <div>
            <label className="text-base md:text-lg font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              value={userData?.last_name + " " + userData?.first_name || ""}
              readOnly
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="text-base md:text-lg font-medium text-gray-600">
              Email
            </label>
            <input
              type="text"
              value={userData?.email || ""}
              readOnly
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="text-base md:text-lg font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              value={userData?.phone_number || ""}
              readOnly
              className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <label className="text-base md:text-lg font-medium text-gray-600">
              Religion
            </label>
            <input
              type="text"
              value={userData?.religion || ""}
              readOnly
              className="w-full capitalize border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <label className="text-base md:text-lg font-medium text-gray-600">
              Highest Qualification
            </label>
            <input
              type="text"
              value={userData?.highest_qualification || ""}
              readOnly
              className="w-full capitalize border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
