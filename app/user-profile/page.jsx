"use client";

import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const fetchUserData = () => {
    const storedUserData = localStorage.getItem("userFullData");
    console.log("useer data", storedUserData);
    if (storedStudentId) {
      setUserData(storedUserData);
    }
  };

  useEffect(() => {
    fetchUserData();
  });
  return <div>page</div>;
};

export default UserProfile;
