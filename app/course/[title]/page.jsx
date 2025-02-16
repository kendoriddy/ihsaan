"use client";

import Footer from "@/components/Footer";
import { IMAGES, COURSES } from "@/constants";
import Image from "next/image";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Popover from "@mui/material/Popover";
import ReactPlayer from "react-player";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import DownloadIcon from "@mui/icons-material/Download";
import { Rating } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReviewPercentageBar from "@/components/ReviewPercentageBar";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import { v4 as uuidv4 } from "uuid";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";

function Page({ params }) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [playerWidth, setPlayerWidth] = useState(0);
  const [activeMenuItem, setActiveMenuItem] = useState("Overview");
  const playerRef = useRef(null);
  const searchInput = useRef(null);
  const userCommentTextArea = useRef(null);
  const [openedSection, setOpenedSection] = useState([
    COURSES[0].currentSectionIndex,
  ]);
  // This contains the lesson index of the opened resources
  const [openedResources, setOpenedResources] = useState([]);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isBtnsHovered, setIsBtnsHovered] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [currentCourse, setCurrentCourse] = useState(COURSES[0]);
  const [currentCourseReviews, setCurrentCourseReviews] = useState(
    COURSES[0].reviews
  );
  const [currentLesson, setCurrentLesson] = useState(
    COURSES[0].courseContent[0].section.lessons[0]
  );

  const [nReviewsShown, setNReviewsShown] = useState(10);
  const [averageRating, setAverageRating] = useState(0);
  const [filteredRating, setFilteredRating] = useState(0);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [filteredText, setFilteredText] = useState("");
  const [isModalClose, setIsModalClose] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [userComment, setUserComment] = useState("");

  const [allLessons, setAllLessons] = useState(
    COURSES[0].courseContent.map((section) => section.section.lessons).flat()
  );
  const [currentLessonIndex, setCurrentLessonIndex] = useState(
    COURSES[0].currentLessonIndex
  );
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    COURSES[0].currentSectionIndex
  );

  const handlePopoverClick = (event) => setPopoverAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setPopoverAnchorEl(null);

  const open = Boolean(popoverAnchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleGoBack = () => {
    router.back();
  };

  const addToOpenedSection = (sectionIndex) =>
    setOpenedSection([...openedSection, sectionIndex]);

  const removeFromOpenedSection = (sectionIndex) =>
    setOpenedSection(
      openedSection.filter((section) => section !== sectionIndex)
    );

  const toggleOpenedSection = (sectionIndex) => {
    if (openedSection.includes(sectionIndex))
      removeFromOpenedSection(sectionIndex);
    if (!openedSection.includes(sectionIndex)) addToOpenedSection(sectionIndex);
  };

  // Toggle Opened Resources

  const toggleOpenedResources = (lessonIndex) => {
    // If the lesson is already opened, remove it from the opened resources
    if (openedResources.includes(lessonIndex)) {
      setOpenedResources(
        openedResources.filter((resource) => resource !== lessonIndex)
      );
    }
    // If the lesson is not opened, add it to the opened resources
    if (!openedResources.includes(lessonIndex)) {
      setOpenedResources([...openedResources, lessonIndex]);
    }
  };

  const courseMenu = ["Course content", "Overview", "Announcements", "Reviews"];

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  const updateCompletedPercentage = () => {
    // Total Lessons
    const totalLessons = COURSES[0].courseContent
      .map((section) => section.section.lessons)
      .flat().length;

    setTotalLessons(totalLessons);

    // Completed Lessons
    const completedLessons = COURSES[0].courseContent
      .map((section) => section.section.lessons)
      .flat()
      .filter((lesson) => lesson.isCompleted).length;

    setCompletedLessons(completedLessons);

    setCompletedPercentage((completedLessons / totalLessons) * 100);
  };

  const handleActiveMenuItem = (item) => {
    setActiveMenuItem(item);
  };

  const handleMouseEnterBtns = () => setIsBtnsHovered(true);

  const handleMouseLeaveBtns = () => setIsBtnsHovered(false);

  const handleCurrentLesson = (lesson) => {
    setCurrentLesson(lesson);
  };

  // Next Lesson
  const nextLesson = () => {
    const currentLessonIndex = COURSES[0].courseContent
      .map((section) => section.section.lessons)
      .flat()
      .findIndex((lesson) => lesson.title === currentLesson.title);

    const nextLesson = COURSES[0].courseContent
      .map((section) => section.section.lessons)
      .flat()[currentLessonIndex + 1];

    if (nextLesson) {
      setCurrentLesson(nextLesson);
      setIsPlaying(true);
    }

    setTimeout(() => {
      setIsPlaying(true);
    }, 3000);
  };

  // Previous Lesson
  const previousLesson = () => {
    const currentLessonIndex = COURSES[0].courseContent
      .map((section) => section.section.lessons)
      .flat()
      .findIndex((lesson) => lesson.title === currentLesson.title);

    const previousLesson = COURSES[0].courseContent
      .map((section) => section.section.lessons)
      .flat()[currentLessonIndex - 1];

    if (previousLesson) {
      setCurrentLession(previousLesson);
    }

    setIsPlaying(true);
  };

  // Calculate Rating Percentage
  const calculateRatingPercentage = (rating) => {
    let totalRatings = 0;
    let parameterRatingCount = 0;

    for (const review of COURSES[0].reviews) {
      if (review.rating) {
        totalRatings++;

        // Classify the rating based on your criteria
        let classifiedRating = Math.floor(review.rating);

        // Check if the classified rating matches the parameter rating
        if (classifiedRating === rating) {
          parameterRatingCount++;
        }
      }
    }

    if (totalRatings === 0) {
      return 0;
    }

    const percentage = (parameterRatingCount / totalRatings) * 100;
    return percentage.toFixed(2);
  };

  // Filter review by number
  const filterReviewsByRating = (rating) => {
    const filteredReviews = currentCourse.reviews.filter(
      (review) => Math.floor(review.rating) === rating
    );

    setCurrentCourseReviews(filteredReviews);
    setFilteredRating(rating);
  };

  // Filter review from select
  const filterReviewsFromSelect = (rating) => {
    if (rating === 0) {
      setCurrentCourseReviews(currentCourse.reviews);
      setFilteredRating(rating);
      return;
    }

    const filteredReviews = currentCourse.reviews.filter(
      (review) => Math.floor(review.rating) === rating
    );

    setCurrentCourseReviews(filteredReviews);
    setFilteredRating(rating);
  };

  // Filter reviews by text
  const filterReviewsByText = (e) => {
    e.preventDefault();

    const filteredReviews = currentCourse.reviews.filter((review) =>
      review.comment.includes(filteredText)
    );

    setCurrentCourseReviews(filteredReviews);
  };

  // Post comment
  const postComment = (e) => {
    e.preventDefault();
    userCommentTextArea.current.value = "";

    const newReview = {
      id: uuidv4(),
      firstname: "John",
      lastname: "Doe",
      image: "",
      rating: userRating,
      comment: userComment,
      date: new Date().toLocaleDateString(),
    };

    setCurrentCourseReviews([newReview, ...currentCourseReviews]);

    setIsModalClose(true);

    setUserComment("");
    setUserRating(null);
  };

  // Get section index
  const getSectionIndex = (lessonId) => {
    const sectionIndex = currentCourse.courseContent.findIndex((sectionObj) => {
      return sectionObj.section.lessons.find(
        (lesson) => lesson.id === lessonId
      );
    });

    return sectionIndex !== -1 ? sectionIndex : 0;
  };

  // Get lesson index
  const getLessonIndex = (lessonId) => {
    let lessonIndex = -1; // Initialize lesson index

    // Find the section containing the lesson
    const section = currentCourse.courseContent.find((sectionObj) =>
      sectionObj.section.lessons.some((lesson) => lesson.id === lessonId)
    );

    if (section) {
      // Find the lesson index within its section
      const lessonInSectionIndex = section.section.lessons.findIndex(
        (lesson) => lesson.id === lessonId
      );
      if (lessonInSectionIndex !== -1) {
        // Calculate the total index by adding the index within section and the index of section in the course
        const sectionIndex = currentCourse.courseContent.findIndex(
          (sectionObj) => sectionObj === section
        );
        lessonIndex =
          lessonInSectionIndex + sectionIndex * section.section.lessons.length;
      }
    }

    return lessonIndex;
  };

  // Lesson Completion
  const handleLessonCompletion = (lesson) => {
    // Change lesson completion status
    const updatedCourseContent = currentCourse.courseContent.map((section) => ({
      ...section,
      section: {
        ...section.section,
        lessons: section.section.lessons.map((lessonItem) => ({
          ...lessonItem,
          isCompleted:
            lessonItem.id === lesson.id ? true : lessonItem.isCompleted,
        })),
      },
    }));

    // Set the current section index
    const updatedCurrentSectionIndex = getSectionIndex(lesson.id);

    // Set the current lesson index
    const updatedCurrentLessonIndex = getLessonIndex(lesson.id);

    // Update current course
    setCurrentCourse((prevCourse) => {
      const updatedCourse = {
        ...prevCourse,
        courseContent: updatedCourseContent,
        currentSectionIndex: updatedCurrentSectionIndex,
        currentLessonIndex: updatedCurrentLessonIndex,
      };
      // Save currentCourse to localStorage using the updated value
      localStorage.setItem("currentCourse", JSON.stringify(updatedCourse));
      return updatedCourse; // Return the updated state
    });

    // Update completed percentage
    updateCompletedPercentage();
    nextLesson();
  };

  // Handle Lesson starts
  const handleLessonStart = (lesson) => {
    // Set the current section index
    const updatedCurrentSectionIndex = getSectionIndex(lesson.id);

    // Set the current lesson index
    const updatedCurrentLessonIndex = getLessonIndex(lesson.id);

    // Update current course
    setCurrentCourse((prevCourse) => {
      const updatedCourse = {
        ...prevCourse,
        currentSectionIndex: updatedCurrentSectionIndex,
        currentLessonIndex: updatedCurrentLessonIndex,
      };
      // Save currentCourse to localStorage using the updated value
      localStorage.setItem("currentCourse", JSON.stringify(updatedCourse));
      return updatedCourse; // Return the updated state
    });
  };

  useEffect(() => {
    // To make the right section fixed when scrolling
    const handleScroll = () => {
      if (window.scrollY > 61) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    //   To update the player width when the window is resized
    const updatePlayerWidth = () => {
      if (playerRef.current) {
        setPlayerWidth(playerRef.current.offsetWidth);
      }
    };
    // Update parent width on mount and resize
    updatePlayerWidth();
    window.addEventListener("resize", updatePlayerWidth);

    // Course Average Rating
    const totalRating = currentCourse.reviews.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );

    setAverageRating(totalRating / currentCourse.reviews.length);

    // Update completed percentage
    updateCompletedPercentage();

    // Set dom loaded
    setDomLoaded(true);

    // Fetch currentCourse from Local Storage if posible
    const fetchData = async () => {
      try {
        if (localStorage.getItem("currentCourse")) {
          const currentCourse = await JSON.parse(
            localStorage.getItem("currentCourse")
          );

          setCurrentCourse(currentCourse);

          // Set current lesson
          // await setCurrentLesson(
          //   currentCourse.courseContent
          //     .map((section) => section.section.lessons)
          //     .flat()[currentCourse.currentLessonIndex]
          // );
          const localCurrentLesson =
            allLessons[currentCourse.currentLessonIndex];
          setCurrentLesson(localCurrentLesson);

          // set opened section
          setOpenedSection([currentCourse.currentSectionIndex]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updatePlayerWidth);
    };
  }, []);

  return (
    <div>
      <div className="relative ">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2">
          {/* Left */}
          <div className="flex items-center gap-8">
            <Link href={"/"}>
              <div className="border-r-2 pr-4 hidden md:block">
                <Image src={IMAGES.logo} alt="logo" width={40} />
              </div>
            </Link>
            <div className="md:hidden">
              <span onClick={handleGoBack}>
                <ArrowBackIcon />
              </span>
            </div>
            <div>{COURSES[0].title}</div>
          </div>
          {/* Right */}
          <div className="hidden md:flex items-center gap-8">
            {/* Leave a Rating */}
            <div
              onClick={() => setIsModalClose(false)}
              className="cursor-pointer">
              <span className="text-gray-600">
                <StarIcon />{" "}
              </span>
              <span>Leave a rating</span>
            </div>

            {/* Certificate - Only Opens after 100% completed */}
            {/* <div>
              {completedPercentage === 100 && (
                <div
                  className={`cursor-pointer text-primary hidden ${
                    completedPercentage === 100 && `block`
                  }`}
                  title="Download Certficate">
                  <Link
                    href={{
                      pathname: `/course/${params.title}/certificate`,
                    }}>
                    <DownloadIcon />
                  </Link>
                </div>
              )}
            </div> */}

            <div
              className={`cursor-pointer text-primary `}
              title="Download Certficate">
              <Link
                href={{
                  pathname: `/course/${params.title}/certificate`,
                }}>
                <DownloadIcon />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* <div className="p-2 border-2 border-red-600 rounded-full text-blue-600">
                <EmojiEventsIcon />
              </div> */}
              <div className="w-8 h-8">
                <CircularProgressbarWithChildren
                  value={completedPercentage}
                  strokeWidth={6}>
                  <span className="text-primary">
                    <EmojiEventsIcon />
                  </span>
                </CircularProgressbarWithChildren>
              </div>

              <div
                className="flex items-center cursor-pointer"
                aria-describedby={id}
                variant="contained"
                onClick={handlePopoverClick}>
                <span>Your Progress</span>
                <span>
                  <KeyboardArrowDownIcon />
                </span>
              </div>

              {/* Popover */}
              <Popover
                id={id}
                open={open}
                anchorEl={popoverAnchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}>
                <div className="text-xs p-4">
                  <div className="font-bold">
                    {completedLessons} of {totalLessons} complete.
                  </div>
                  <div>Finish course to get your certificate</div>
                </div>
              </Popover>
            </div>
            <div>
              <span className=" border-2 p-2 border-black">
                <MoreVertIcon />
              </span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex overflow-x-hidden">
          {/* Left */}
          <section
            className={`w-screen  ${
              isSidebarHidden ? "" : "lg:w-[calc(100vw-300px)]"
            }`}>
            {/* Top */}
            <div
              className={`relative w-full bg-gray-200`}
              style={{ height: `${playerWidth * 0.54333}px` }}
              ref={playerRef}>
              {/* Absolute BTNS */}
              <div>
                {/* Couurse content */}
                <div
                  className={`hidden absolute top-[75px] right-[-120px] border  bg-gray-50 border-r-0 px-2 py-1 text-primary cursor-pointer  items-center gap-2 hover:right-0 transition-all duration-300 z-30 ${
                    isSidebarHidden ? "lg:flex" : "hidden"
                  }`}
                  onClick={toggleSidebar}>
                  <span>
                    <ArrowBackIcon />
                  </span>
                  <span>Course content</span>
                </div>

                {/* Prev Btns */}
                <div
                  className={`absolute top-1/2 left-0 flex justify-between items-center bg-gray-50 z-30 ${
                    isBtnsHovered ? "opacity-100" : "opacity-0"
                  } `}>
                  <div
                    className={`py-1 px-2 border bg-gray-50 border-l-0 cursor-pointer transition-all duration-300  `}
                    title={`Previous`}
                    onMouseEnter={handleMouseEnterBtns}
                    onMouseLeave={handleMouseLeaveBtns}
                    onClick={previousLesson}>
                    <span>
                      <KeyboardArrowLeftIcon sx={{ fontSize: 20 }} />
                    </span>
                  </div>
                </div>

                {/* Next Btns */}
                <div
                  className={`absolute top-1/2 right-0 flex justify-between items-center bg-gray-50 z-30 ${
                    isBtnsHovered ? "opacity-100" : "opacity-0"
                  }`}>
                  <div
                    className={`py-1 px-2 border bg-gray-50 border-l-0 cursor-pointer transition-all duration-300   `}
                    title={`Next`}
                    onMouseEnter={handleMouseEnterBtns}
                    onMouseLeave={handleMouseLeaveBtns}
                    onClick={nextLesson}>
                    <span>
                      <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="w-full h-full">
                {domLoaded ? (
                  <div className="w-full h-full">
                    <ReactPlayer
                      // url={[
                      //   "https://www.youtube.com/watch?v=oUFJJNQGwhk",
                      //   "https://www.youtube.com/watch?v=jNgP6d9HraI",
                      // ]}
                      url={currentLesson.url}
                      width="100%"
                      height="100%"
                      controls
                      onStart={() => handleLessonStart(currentLesson)}
                      onEnded={() => handleLessonCompletion(currentLesson)}
                      playing={isPlaying}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <CircularProgress />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom */}
            <div>
              {/* Menu List */}
              <div>
                <div className="flex  items-center gap-6 px-4 py-3 border-b-0 border-black">
                  {courseMenu.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          activeMenuItem === item && "text-primary"
                        }  ${
                          index === 0 && "lg:hidden"
                        } cursor-pointer hover:text-orange-700 hover:rounded transition-all duration-300`}
                        onClick={() => handleActiveMenuItem(item)}>
                        {item}
                      </div>
                    );
                  })}
                </div>
                <div className="px-4">
                  <Divider />
                </div>
              </div>

              {/* Bottom Bottom */}
              <div className="px-4 py-4 pr-8">
                {/* Course Content */}
                <div
                  className={` ${
                    activeMenuItem === "Course content" ? "block" : "hidden"
                  }`}>
                  {/* Course Content */}
                  <div>
                    {/* Course section List */}
                    {currentCourse.courseContent.map((course, sectionIndex) => {
                      const totalPreviousLessons = COURSES[0].courseContent
                        .slice(0, sectionIndex)
                        .reduce(
                          (acc, curr) => acc + curr.section.lessons.length,
                          0
                        );

                      return (
                        <div
                          key={sectionIndex}
                          className="text-md tracking-wide">
                          {/* Section Title */}
                          <div
                            className="flex justify-between items-center bg-gray-100 p-4 border-b"
                            onClick={() => toggleOpenedSection(sectionIndex)}>
                            <div className="font-bold cursor-pointer">
                              Section {sectionIndex}: {course.section.title}
                            </div>

                            <span
                              className={`cursor-pointer ${
                                openedSection.includes(sectionIndex)
                                  ? "hidden"
                                  : "block"
                              }`}>
                              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </span>
                            <span
                              className={`cursor-pointer ${
                                !openedSection.includes(sectionIndex)
                                  ? "hidden"
                                  : "block"
                              }`}>
                              <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                            </span>
                          </div>

                          {/* Lessons */}
                          <div
                            className={`${
                              openedSection.includes(sectionIndex)
                                ? "h-auto"
                                : "h-0"
                            } overflow-hidden`}>
                            {course.section.lessons.map(
                              (lesson, lessonIndexInSection) => {
                                // Calculate the overall lesson index
                                const lessonIndex =
                                  totalPreviousLessons +
                                  lessonIndexInSection +
                                  1;

                                return (
                                  <div
                                    key={lessonIndexInSection}
                                    className={`p-4 cursor-pointer hover:bg-slate-200 ${
                                      lesson === currentLesson && "bg-slate-200"
                                    } `}>
                                    <div className={``}>
                                      {/* Top */}
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            name="completed"
                                            readOnly={true}
                                            checked={lesson.isCompleted}
                                            id=""
                                          />
                                        </div>
                                        <div
                                          onClick={() =>
                                            handleCurrentLesson(lesson)
                                          }>
                                          {" "}
                                          {lessonIndex} {"."} {lesson.title}
                                        </div>
                                      </div>
                                      {/* Bottom */}
                                      <div className="flex justify-between items-center pt-2">
                                        <div>02:30</div>
                                        {/* Lesson Resources */}
                                        <div>
                                          {lesson.resources && (
                                            <div
                                              className="border border-slate-400 py-1 w-[150px] text-center"
                                              onClick={() =>
                                                toggleOpenedResources(
                                                  lessonIndex
                                                )
                                              }>
                                              <div className="relative">
                                                {" "}
                                                <span className="text-blue-600">
                                                  {" "}
                                                  <FolderCopyIcon />{" "}
                                                </span>{" "}
                                                Resouces
                                                <div
                                                  className={`absolute left-0 top-7 h-0 overflow-hidden ${
                                                    openedResources.includes(
                                                      lessonIndex
                                                    ) && "h-auto"
                                                  }`}>
                                                  {lesson.resources.map(
                                                    (resource, index) => (
                                                      <div
                                                        key={index}
                                                        className="p-2 bg-blue-100 w-[150px] hover:bg-blue-200">
                                                        <Link
                                                          href={resource.url}
                                                          target="_blank"
                                                          className="flex gap-2 items-center">
                                                          {resource.type ===
                                                            "pdf" && (
                                                            <BrowserUpdatedIcon
                                                              sx={{
                                                                fontSize: 20,
                                                              }}
                                                            />
                                                          )}

                                                          {resource.type ===
                                                            "link" && (
                                                            <LaunchIcon
                                                              sx={{
                                                                fontSize: 20,
                                                              }}
                                                            />
                                                          )}

                                                          <span>
                                                            {resource.title}
                                                          </span>
                                                        </Link>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overview */}
                <div
                  className={`${
                    activeMenuItem === "Overview" ? "block" : "hidden"
                  }`}>
                  {/* By the Numbers */}
                  <div className="py-2 flex flex-col md:flex-row  md:gap-12">
                    <h2 className="text-lg font-bold">Numbers</h2>
                    <div className="flex flex-col md:flex-row md:gap-8">
                      <div>
                        <div>Skill Levels: {currentCourse?.skillLevels}</div>
                        <div>Students: {currentCourse?.students?.length}</div>
                        <div>Languages: {currentCourse?.language}</div>
                        <div>Caption: {currentCourse?.caption}</div>
                      </div>
                      <div>
                        <div>Lectures: {currentCourse?.lectures} </div>
                        <div>Video: {currentCourse.videoDuration}</div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <Divider />
                  </div>

                  {/* Overview Overview */}
                  <div className="py-2">
                    <h2 className="text-lg font-bold">Overview</h2>
                    <p>{COURSES[0].overview}</p>
                  </div>
                  <div className="py-2">
                    <Divider />
                  </div>

                  {/* Summary */}
                  <div className="py-2">
                    <h2 className="text-lg font-bold">Summary</h2>
                    <p>{COURSES[0].summary}</p>
                  </div>

                  <div className="py-2">
                    <Divider />
                  </div>

                  {/* Suggested Courses */}
                  <div className="py-2">
                    <h2 className="text-lg font-bold">Suggested Courses</h2>
                    <div className="py-2">
                      People who took this course also took
                    </div>
                    <div>
                      <div className="flex flex-wrap justify-center gap-6 flex-col md:flex-row items-center ">
                        {COURSES.slice(0, 3).map((course) => (
                          <Link
                            key={course.id}
                            href={course.path}
                            className="group border w-1/4 min-w-[300px] max-w-[500px] rounded-md overflow-hidden cursor-pointer  shadow-md  hover:bg-neutral-200  transition-all duration-300 lg:mt-4 ">
                            <div className="h-[200px] w-full overflow-hidden relative">
                              <Image
                                src={course.image}
                                alt="course"
                                // width={250}
                                // height={200}
                                fill
                                objectFit="cover"
                                className="transform group-hover:scale-125 transition-all duration-600"
                              />
                            </div>
                            {/* Link Bottom */}
                            <div className="p-2">
                              <div className="font-bold py-2">
                                {course.title.slice(0, 25)}{" "}
                                {course.title.length > 25 ? "..." : ""}
                              </div>
                              <div className="text-sm">
                                <Rating
                                  name="half-rating-read"
                                  defaultValue={course.rating}
                                  precision={0.5}
                                  size="small"
                                  readOnly
                                />
                              </div>
                              <div className="pt-4">
                                <span>
                                  <CreditCardIcon className="text-neutral-400" />
                                </span>{" "}
                                <span>NGN</span>{" "}
                                {course.price.toLocaleString("en-US")}.00
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Announcement */}
                <div
                  className={`${
                    activeMenuItem === "Announcements" ? "block" : "hidden"
                  }`}>
                  <div className="py-2">
                    <p>{COURSES[0].announcements}</p>
                  </div>
                </div>

                {/* Reviews */}
                <div
                  className={`${
                    activeMenuItem === "Reviews" ? "block" : "hidden"
                  }`}>
                  {/* Ratings */}
                  <div>
                    <div className="text-xl font-bold py-2">
                      Student Feedback
                    </div>
                    <div className="flex gap-6">
                      {/* Left */}
                      <div className="text-primary">
                        <div className="text-center text-4xl">
                          {averageRating.toPrecision(3)}
                        </div>
                        <div>
                          {" "}
                          <div className="">
                            {domLoaded && (
                              <Rating
                                name="half-rating-read"
                                defaultValue={averageRating}
                                precision={0.5}
                                readOnly
                                size="large"
                                sx={{ color: "#f34103" }}
                              />
                            )}
                          </div>{" "}
                        </div>
                        <div className="text-center">Course Rating</div>
                      </div>
                      {/* Right */}
                      <div className="flex-1 ">
                        <div
                          onClick={() => filterReviewsByRating(5)}
                          className={`cursor-pointer rounded px-2 $ `}>
                          <ReviewPercentageBar
                            percentage={calculateRatingPercentage(5)}
                            stars={5}
                            active={filteredRating === 5}
                          />
                        </div>
                        <div
                          onClick={() => filterReviewsByRating(4)}
                          className={`cursor-pointer rounded px-2 $`}>
                          <ReviewPercentageBar
                            percentage={calculateRatingPercentage(4)}
                            stars={4}
                            active={filteredRating === 4}
                          />
                        </div>
                        <div
                          onClick={() => filterReviewsByRating(3)}
                          className={`cursor-pointer rounded px-2 $ `}>
                          <ReviewPercentageBar
                            percentage={calculateRatingPercentage(3)}
                            stars={3}
                            active={filteredRating === 3}
                          />
                        </div>
                        <div
                          onClick={() => filterReviewsByRating(2)}
                          className={`cursor-pointer rounded px-2 $`}>
                          <ReviewPercentageBar
                            percentage={calculateRatingPercentage(2)}
                            stars={2}
                            active={filteredRating === 2}
                          />
                        </div>
                        <div
                          onClick={() => filterReviewsByRating(1)}
                          className={`cursor-pointer rounded px-2 $`}>
                          <ReviewPercentageBar
                            percentage={calculateRatingPercentage(1)}
                            stars={1}
                            active={filteredRating === 1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div>
                    <div className="text-xl font-bold pt-6 pb-2">Reviews</div>

                    {/* Forms */}
                    <div className="flex gap-4">
                      <form
                        action=""
                        onSubmit={(e) => filterReviewsByText(e)}
                        className="flex items-center border-2 border-slate-400 pl-2 rounded w-2/3">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Search reviews"
                            className="w-full focus:outline-none"
                            ref={searchInput}
                            onChange={(e) => setFilteredText(e.target.value)}
                          />
                        </div>
                        <div className="bg-gray-400 h-full flex items-center px-2">
                          <SearchIcon />
                        </div>
                      </form>
                      <form action="" className="w-1/3">
                        <div className="w-full">
                          <select
                            name="filterRating"
                            id=""
                            className="border-2 border-slate-400 p-2 w-full"
                            onChange={(e) =>
                              filterReviewsFromSelect(Number(e.target.value))
                            }>
                            <option value="">All Ratings</option>
                            <option value="5">Five stars</option>
                            <option value="4">Four stars</option>
                            <option value="3">Three stars</option>
                            <option value="2">Two stars</option>
                            <option value="1">One star</option>
                          </select>
                        </div>
                      </form>
                    </div>
                    <div>
                      {currentCourseReviews
                        .slice(0, nReviewsShown)
                        .map((review, index) => (
                          <div key={index} className="py-3 border-b-2">
                            <div className="flex items-center gap-4 ">
                              {/* Image */}
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex justify-center items-center">
                                <div>
                                  {review.image ? (
                                    <Image
                                      src={review.image}
                                      alt="profile"
                                      width={48}
                                      height={48}
                                      className="rounded-full"
                                    />
                                  ) : (
                                    <div className="text-2xl">
                                      {review.firstname[0]}
                                      {review.lastname[0]}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">
                                  {review.firstname} {review.lastname}
                                </div>
                                <div className="flex items-center gap-6">
                                  <Rating
                                    name="half-rating-read"
                                    value={review?.rating}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                    sx={{ color: "#f34103" }}
                                  />

                                  <div className="text-gray-400">
                                    <span>{review.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="py-2">{review.comment}</div>
                          </div>
                        ))}
                    </div>

                    <div className="text-center p-8">
                      <div
                        className="border border-slate-400 w-[400px] mx-auto py-2 cursor-pointer"
                        onClick={() => setNReviewsShown(nReviewsShown + 10)}>
                        See more reviews
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar - Right*/}
          <section
            className={`hidden  w-[300px] h-screen top-0 right-0 bg-white overflow-y-scroll overflow-x-hidden ${
              isScrolled ? "fixed" : "relative"
            } ${isSidebarHidden ? "lg:hidden" : "lg:block"} `}>
            {/* Top */}
            <div className="flex justify-between items-center p-4 bg-gray-50">
              <div className="font-bold">Course content</div>
              <div className="cursor-pointer" onClick={toggleSidebar}>
                <CloseIcon />
              </div>
            </div>

            {/* Space */}
            <div className="">
              <Divider />
            </div>

            {/* Bottom */}
            <div>
              {/* Course section List */}
              {currentCourse.courseContent.map((course, sectionIndex) => {
                const totalPreviousLessons = COURSES[0].courseContent
                  .slice(0, sectionIndex)
                  .reduce((acc, curr) => acc + curr.section.lessons.length, 0);

                return (
                  <div key={sectionIndex} className="text-md tracking-wide">
                    {/* Section Title */}
                    <div
                      className="flex justify-between items-center bg-gray-100 p-4 border-b"
                      onClick={() => toggleOpenedSection(sectionIndex)}>
                      <div className="font-bold cursor-pointer">
                        Section {sectionIndex}: {course.section.title}
                      </div>

                      <span
                        className={`cursor-pointer ${
                          openedSection.includes(sectionIndex)
                            ? "hidden"
                            : "block"
                        }`}>
                        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                      </span>
                      <span
                        className={`cursor-pointer ${
                          !openedSection.includes(sectionIndex)
                            ? "hidden"
                            : "block"
                        }`}>
                        <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                      </span>
                    </div>

                    {/* Lessons */}
                    <div
                      className={`${
                        openedSection.includes(sectionIndex) ? "h-auto" : "h-0"
                      } overflow-hidden`}>
                      {course.section.lessons.map(
                        (lesson, lessonIndexInSection) => {
                          // Calculate the overall lesson index
                          const lessonIndex =
                            totalPreviousLessons + lessonIndexInSection + 1;

                          return (
                            <div
                              key={lessonIndexInSection}
                              className={`p-4 cursor-pointer hover:bg-slate-200 ${
                                lesson === currentLesson && "bg-slate-200"
                              } `}>
                              <div className={``}>
                                {/* Top */}
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      name="completed"
                                      readOnly={true}
                                      checked={lesson.isCompleted}
                                      id=""
                                    />
                                  </div>
                                  <div
                                    onClick={() => handleCurrentLesson(lesson)}>
                                    {" "}
                                    {lessonIndex} {"."} {lesson.title}
                                  </div>
                                </div>
                                {/* Bottom */}
                                <div className="flex justify-between items-center pt-2">
                                  <div>02:30</div>
                                  {/* Lesson Resources */}
                                  <div>
                                    {lesson.resources && (
                                      <div
                                        className="border border-slate-400 py-1 w-[150px] text-center"
                                        onClick={() =>
                                          toggleOpenedResources(lessonIndex)
                                        }>
                                        <div className="relative">
                                          {" "}
                                          <span className="text-blue-600">
                                            {" "}
                                            <FolderCopyIcon />{" "}
                                          </span>{" "}
                                          Resouces
                                          <div
                                            className={`absolute left-0 top-7 h-0 overflow-hidden ${
                                              openedResources.includes(
                                                lessonIndex
                                              ) && "h-auto"
                                            }`}>
                                            {lesson.resources.map(
                                              (resource, index) => (
                                                <div
                                                  key={index}
                                                  className="p-2 bg-blue-100 w-[150px] hover:bg-blue-200">
                                                  <Link
                                                    href={resource.url}
                                                    target="_blank"
                                                    className="flex gap-2 items-center">
                                                    {resource.type ===
                                                      "pdf" && (
                                                      <BrowserUpdatedIcon
                                                        sx={{ fontSize: 20 }}
                                                      />
                                                    )}

                                                    {resource.type ===
                                                      "link" && (
                                                      <LaunchIcon
                                                        sx={{ fontSize: 20 }}
                                                      />
                                                    )}

                                                    <span>
                                                      {resource.title}
                                                    </span>
                                                  </Link>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Modal */}

        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
            isModalClose && "hidden"
          }`}>
          <div className="w-screen h-screen flex justify-center items-center  p-4  ">
            <div className="bg-white w-[500px] h-[400px] rounded ">
              {/* Top */}
              <div>
                <div className="flex justify-between items-center p-4">
                  <div className="text-lg font-bold">Leave a rating</div>
                  <div
                    className="cursor-pointer text-red-600 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsModalClose(true)}>
                    Close
                  </div>
                </div>
                <Divider />
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center py-6">
                <Rating
                  name="simple-controlled"
                  defaultValue={1}
                  precision={0.5}
                  // size="large"
                  sx={{ color: "#f34103", fontSize: "3rem" }}
                  onChange={(event, newValue) => {
                    setUserRating(newValue);
                  }}
                />
              </div>

              <form action="#" className="p-4" onSubmit={(e) => postComment(e)}>
                {/* Name */}
                <div className="flex gap-4 flex-col py-3">
                  <textarea
                    ref={userCommentTextArea}
                    placeholder="Leave A Comment ..."
                    name=""
                    id=""
                    rows="5"
                    className="flex-1 bg-gray-100 border-b-2 px-2 py-2 focus:outline-none focus:border-blue-600 focus:bg-blue-200 rounded"
                    onChange={(e) => setUserComment(e.target.value)}></textarea>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center py-4">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 w-[200px]">
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Page;
