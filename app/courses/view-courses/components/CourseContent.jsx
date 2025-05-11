"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Play,
  FileText,
} from "lucide-react";

// Dummy course content data
const courseContent = [
  {
    id: 1,
    title: "Course content",
    isOpen: true,
    items: [
      {
        id: 1,
        title: "About this course",
        duration: "2min",
        completed: true,
        type: "video",
      },
      {
        id: 2,
        title: "Introduction",
        duration: "2min",
        completed: true,
        type: "video",
      },
      {
        id: 3,
        title: "What is DevOps?",
        duration: "15min",
        completed: true,
        type: "video",
      },
      {
        id: 4,
        title: "Q & A",
        duration: "2min",
        completed: true,
        type: "video",
      },
      {
        id: 5,
        title: "What is Continuous Integration?",
        duration: "8min",
        completed: true,
        type: "video",
      },
      {
        id: 6,
        title: "What is Continuous Delivery?",
        duration: "5min",
        completed: true,
        type: "video",
      },
      {
        id: 7,
        title: "DevOps Quiz",
        duration: "",
        completed: true,
        type: "quiz",
      },
      {
        id: 8,
        title: "Course Material",
        duration: "1min",
        completed: true,
        type: "document",
      },
    ],
  },
  {
    id: 2,
    title: "Section 2: Prerequisites Info & Setup",
    isOpen: false,
    totalLectures: 9,
    totalDuration: "58min",
    items: [],
  },
  {
    id: 3,
    title: "Section 3: VM Setup",
    isOpen: false,
    totalLectures: 9,
    totalDuration: "1hr 26min",
    items: [],
  },
  {
    id: 4,
    title: "Section 4: Linux",
    isOpen: false,
    totalLectures: 12,
    totalDuration: "2hr 15min",
    items: [],
  },
];

export default function CourseContent() {
  const [sections, setSections] = useState(courseContent);

  const toggleSection = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-bold text-lg">Course content</h2>
        <button className="text-purple-600 font-medium text-sm">
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            AI Assistant
          </span>
        </button>
      </div>

      <div>
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-200">
            <button
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
              onClick={() => toggleSection(section.id)}
            >
              <div className="text-left">
                <h3 className="font-medium text-sm">{section.title}</h3>
                {section.id !== 1 && (
                  <p className="text-xs text-gray-500">
                    {section.totalLectures} lectures • {section.totalDuration}
                  </p>
                )}
              </div>
              {section.isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {section.isOpen && section.items && section.items.length > 0 && (
              <div className="bg-gray-50">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start px-4 py-2 hover:bg-gray-100"
                  >
                    <div className="text-purple-600 mt-0.5 mr-2">
                      {item.completed && <CheckSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        {item.type === "video" && (
                          <Play className="h-3 w-3 mr-2 text-gray-500" />
                        )}
                        {item.type === "quiz" && (
                          <span className="mr-2 text-xs font-medium bg-gray-200 px-1.5 py-0.5 rounded">
                            QUIZ
                          </span>
                        )}
                        {item.type === "document" && (
                          <FileText className="h-3 w-3 mr-2 text-gray-500" />
                        )}
                        <span className="text-sm">
                          {item.id}. {item.title}
                        </span>
                      </div>
                      {item.duration && (
                        <span className="text-xs text-gray-500">
                          {item.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-center">
        <button className="flex items-center text-sm text-purple-600 font-medium">
          <span>Resources</span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
