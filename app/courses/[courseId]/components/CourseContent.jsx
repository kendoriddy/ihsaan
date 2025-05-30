"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Play,
  FileText,
} from "lucide-react";
import {
  FaFile,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
  FaPlayCircle,
  FaLock,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import QuizQuestion from "@/app/quiz/components/QuizQuestions";
import QuizQuestion2 from "@/app/quiz/components/QuizQuestions2";

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

const CourseContent = ({ sections, onSelectVideo, selectedVideoId }) => {
  const [openSectionIndex, setOpenSectionIndex] = useState(0); // Default open first section
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  if (!sections || sections.length === 0) {
    return (
      <p className="text-gray-600 p-4">Course content is not available yet.</p>
    );
  }

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const handleOpenQuizModal = (quiz) => {
    localStorage.setItem("selectedQuiz", JSON.stringify(quiz));
    setSelectedQuiz(quiz);
    setOpenQuizModal(true);
  };
  console.log(selectedQuiz, "selectedQuiz::::");
  const handleCloseQuizModal = () => {
    setSelectedQuiz(null);
    setOpenQuizModal(false);
  };

  const handleSetionQuiz = () => {};

  return (
    <div>
      <div className="h-full overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 bg-gray-100 border-b sticky top-0 z-10">
          Course Content
        </h2>
        {sortedSections.map((section, index) => (
          <div key={section.id} className="mb-1 border-b">
            <button
              onClick={() =>
                setOpenSectionIndex(openSectionIndex === index ? null : index)
              }
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 focus:outline-none"
            >
              <span className="text-gray-800 font-bold">
                {section.order}. {section.title}
              </span>
              <span className="text-gray-800 font-bold">
                {openSectionIndex === index ? "-" : "+"}
              </span>
            </button>
            {openSectionIndex === index && (
              <div className="p-4 bg-white border-t">
                {section.description && (
                  <p className="text-sm text-gray-600 mb-3 pb-2 border-b">
                    {section.description}
                  </p>
                )}

                {/* Videos List */}
                {section.videos && section.videos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Videos:
                    </h4>
                    <ul className="space-y-1">
                      {section.videos
                        .sort((a, b) => a.order - b.order)
                        .map((video) => (
                          <li key={video.id}>
                            <button
                              onClick={() => onSelectVideo(video)}
                              className={`w-full text-left p-2 rounded-md flex items-center space-x-2 transition-colors duration-150 
                            ${
                              selectedVideoId === video.id
                                ? "bg-indigo-100 text-indigo-700 shadow-sm"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            >
                              <FaPlayCircle
                                className={`mr-2 flex-shrink-0 ${
                                  selectedVideoId === video.id
                                    ? "text-indigo-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <span className="flex-grow text-sm truncate">
                                {video.order}. {video.title}
                              </span>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                ({video.duration})
                              </span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Materials List */}
                {section.materials && section.materials.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Materials:
                    </h4>
                    <ul className="space-y-1">
                      {section.materials
                        .sort((a, b) => a.order - b.order)
                        .map((material) => (
                          <li key={material.id}>
                            <a
                              href={material.material_resource?.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-left p-2 rounded-md flex items-center space-x-2 hover:bg-gray-100 text-gray-700 transition-colors duration-150 group"
                            >
                              {material.material_resource?.media_url?.endsWith(
                                ".pdf"
                              ) ? (
                                <FaFilePdf className="mr-2 flex-shrink-0 text-red-500 group-hover:text-red-600" />
                              ) : material.material_resource?.media_url?.match(
                                  /\.(docx?|odt)$/i
                                ) ? (
                                <FaFileWord className="mr-2 flex-shrink-0 text-blue-500 group-hover:text-blue-600" />
                              ) : material.material_resource?.media_url?.match(
                                  /\.(xlsx?|ods)$/i
                                ) ? (
                                <FaFileExcel className="mr-2 flex-shrink-0 text-green-500 group-hover:text-green-600" />
                              ) : (
                                <FaFile className="mr-2 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                              )}
                              <span className="flex-grow text-sm truncate">
                                {material.order}. {material.title}
                              </span>
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {section.has_mcq_assessment && (
                  <div onClick={() => handleOpenQuizModal(section)}>
                    <h4 className="mt-3 text-sm font-semibold text-gray-700 mb-2">
                      Quiz:
                    </h4>
                  </div>
                )}

                {(section.videos?.length === 0 || !section.videos) &&
                  (section.materials?.length === 0 || !section.materials) && (
                    <p className="text-xs text-gray-500 italic">
                      No content in this section yet.
                    </p>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Quiz */}
      <Dialog
        open={openQuizModal}
        onClose={handleCloseQuizModal}
        aria-labelledby="quiz-modal-title"
        aria-describedby="quiz-modal-description"
      >
        <DialogTitle id="quiz-modal-title">Quiz</DialogTitle>
        <DialogContent>
          <DialogContentText id="quiz-modal-description">
            <QuizQuestion2 sectionData={selectedQuiz} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseContent;
