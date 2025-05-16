"use client";
import { useState } from "react";

export default function CourseNavigation() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "qa", label: "Q&A" },
    { id: "notes", label: "Notes" },
    { id: "announcements", label: "Announcements" },
    { id: "reviews", label: "Reviews" },
    { id: "tools", label: "Learning tools" },
  ];

  return (
    <div className="border-b border-gray-300">
      <div className="flex overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "text-black border-b-2 border-black"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
