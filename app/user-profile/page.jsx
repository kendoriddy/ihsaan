"use client";

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

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">User Profile</h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            value={userData?.name || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="text"
            value={userData?.email || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input
            type="text"
            value={userData?.phone || ""}
            readOnly
            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
