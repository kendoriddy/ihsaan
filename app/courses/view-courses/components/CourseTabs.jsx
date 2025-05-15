import React, { useState } from "react";

const tabList = [
  { key: "overview", label: "Overview" },
  { key: "qa", label: "Q&A" },
  { key: "notes", label: "Notes" },
  { key: "announcements", label: "Announcements" },
  { key: "reviews", label: "Reviews" },
];

const dummyContent = {
  overview:
    "This is the course overview. Here you can describe what the course is about, what students will learn, and any prerequisites.",
  qa: "Q&A section. Students can ask questions and get answers from the instructor or other students.",
  notes:
    "Personal notes section. Students can take notes while watching the course.",
  announcements: "Announcements from the instructor will appear here.",
  reviews: "Student reviews and ratings will be shown here.",
};

const CourseTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div
      style={{
        background: "#fff",
        flex: 1,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #eee",
          padding: "0 32px",
          background: "#fafbfc",
        }}
      >
        {tabList.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab.key
                  ? "3px solid #5624d0"
                  : "3px solid transparent",
              color: activeTab === tab.key ? "#5624d0" : "#222",
              fontWeight: 600,
              fontSize: 16,
              padding: "18px 24px 12px 24px",
              cursor: "pointer",
              outline: "none",
              marginRight: 8,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: 32, flex: 1, fontSize: 17, color: "#444" }}>
        {dummyContent[activeTab]}
      </div>
    </div>
  );
};

export default CourseTabs;
