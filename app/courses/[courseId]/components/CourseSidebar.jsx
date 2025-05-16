import React from "react";

const CourseSidebar = ({ sections }) => {
  return (
    <aside
      style={{
        width: 340,
        background: "#fff",
        borderRight: "1px solid #eee",
        padding: 0,
      }}
    >
      <div style={{ height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: 24, borderBottom: "1px solid #eee" }}>
          <strong>Course Content</strong>
        </div>
        <div style={{ padding: 0 }}>
          {sections.map((section, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "12px 24px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                {section.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.lectures.map((lecture, lidx) => (
                  <li
                    key={lidx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 6,
                      color: lecture.completed ? "#222" : "#aaa",
                    }}
                  >
                    <span style={{ flex: 1 }}>{lecture.title}</span>
                    <span
                      style={{ fontSize: 12, color: "#888", marginLeft: 8 }}
                    >
                      {lecture.duration}
                    </span>
                    {lecture.completed && (
                      <span style={{ color: "#4caf50", marginLeft: 8 }}>✔</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CourseSidebar;
