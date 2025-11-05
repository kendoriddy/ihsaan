"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgrammes } from "@/utils/redux/slices/programmeSlice";
import Image from "next/image";
import { getAuthToken } from "@/hooks/axios/axios";
import {
  FaCaretDown,
  FaChevronDown,
  FaChevronUp,
  FaFile,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
  FaGripVertical,
} from "react-icons/fa";
import {
  getVideoDuration,
  formatDurationFromSeconds,
  convertDurationToSeconds,
} from "@/utils/utilFunctions";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";

// Utility function to validate and normalize URLs
const normalizeUrl = (string) => {
  if (!string || typeof string !== "string" || string.trim() === "") {
    return null;
  }

  const trimmedString = string.trim();

  // If it already has a protocol, return as is
  if (
    trimmedString.startsWith("http://") ||
    trimmedString.startsWith("https://")
  ) {
    try {
      new URL(trimmedString);
      return trimmedString;
    } catch (_) {
      return null;
    }
  }

  // If it doesn't have a protocol, try adding https://
  const urlWithProtocol = `https://${trimmedString}`;
  try {
    new URL(urlWithProtocol);
    return urlWithProtocol;
  } catch (_) {
    return null;
  }
};

// Utility function to extract error messages from API responses
const extractErrorMessage = (error, defaultMessage = "An error occurred") => {
  let errorMessage = defaultMessage;

  if (error.response?.data) {
    const errorData = error.response.data;

    // Handle different error response structures
    if (errorData.file && Array.isArray(errorData.file)) {
      // File validation errors (like size limit)
      errorMessage = errorData.file[0];
    } else if (errorData.message) {
      // General message
      errorMessage = errorData.message;
    } else if (errorData.detail) {
      // Detail field
      errorMessage = errorData.detail;
    } else if (typeof errorData === "string") {
      // Direct string error
      errorMessage = errorData;
    } else if (typeof errorData === "object") {
      // Try to find any error message in the object
      const firstError = Object.values(errorData).find(
        (val) => Array.isArray(val) && val.length > 0
      );
      if (firstError && Array.isArray(firstError)) {
        errorMessage = firstError[0];
      }
    }
  }

  return errorMessage;
};

function EditCoursePage() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [currentRoute, setCurrentRoute] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    order: "",
    name: "",
    code: "",
    programme: "",
    image_url: "",
  });

  const [courseVideos, setCourseVideos] = useState([]);
  const [newVideoData, setNewVideoData] = useState({
    title: "",
    course: courseId,
    section: "",
    video_no: "",
    video_resource_id: "",
    duration: "",
    order: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);
  const [durationExtracting, setDurationExtracting] = useState(false);

  const [courseMaterials, setCourseMaterials] = useState([]);
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialData, setNewMaterialData] = useState({
    title: "",
    section: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadSuccessful, setImageUploadSuccessful] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const [courseSections, setCourseSections] = useState([]);
  const [newSectionData, setNewSectionData] = useState({
    title: "",
    description: "",
    has_mcq_assessment: "",
  });

  // Drag and drop state
  const [draggedSection, setDraggedSection] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  // Section collapse state - all sections collapsed by default
  const [collapsedSections, setCollapsedSections] = useState(new Set());

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [isEnrollLoading, setIsEnrollLoading] = useState(false);

  const [sections, setSections] = useState({
    courseDetails: true,
    courseMaterials: false,
    courseVideos: false,
    courseEnrollment: false,
    courseSections: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentRoute(pathname);
    }
  }, [pathname]);

  const { programmes } = useSelector((state) => state.programme);

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    dispatch(fetchProgrammes({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchEnrolledStudents();
      fetchTerms();
      fetchAllStudents();
      fetchCourseSections();
    }
  }, [courseId]);

  const toggleSection = (section) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(
        "https://api.ihsaanacademia.com/api/all-student",
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setAllStudents(response.data.results);
    } catch (error) {
      toast.error("Failed to fetch all students");
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(
        `https://api.ihsaanacademia.com/course/courses/${courseId}/enrolled_students/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setEnrolledStudents(response.data.students);
    } catch (error) {
      toast.error("Failed to fetch enrolled students");
    }
  };

  const handleEnrollStudents = async (e) => {
    e.preventDefault();
    setIsEnrollLoading(true);

    if (!selectedTerm) {
      toast.error("Please select a term");
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student to enroll");
      return;
    }

    try {
      const enrollments = selectedStudents.map((studentId) => ({
        is_active: true,
        user: studentId,
        course: courseId,
        term: selectedTerm,
      }));

      await Promise.all(
        enrollments.map((enrollment) =>
          axios.post(
            "https://api.ihsaanacademia.com/course/course-enrollments/",
            enrollment,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
              },
            }
          )
        )
      );

      toast.success("Students enrolled successfully!");
      setSelectedStudents([]);
      fetchEnrolledStudents();
    } catch (error) {
      toast.error("Failed to enroll students");
    } finally {
      setIsEnrollLoading(false);
    }
  };

  const handleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axios.get(
        "https://api.ihsaanacademia.com/terms/",
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setTerms(response.data.results);
    } catch (error) {
      toast.error("Failed to fetch terms");
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `https://api.ihsaanacademia.com/course/courses/${courseId}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      const course = response.data;
      setCourseData({
        title: course.title,
        description: course.description,
        order: course.order || "",
        name: course.title,
        code: course.code,
        programme: course.programme,
        image_url: course.image_url,
      });
      if (course.image_url) {
        const normalizedUrl = normalizeUrl(course.image_url);
        if (normalizedUrl) {
          setPreviewImage(normalizedUrl);
          setImageUploadSuccessful(true);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch course data");
    }
  };

  const [videoToCloudinaryLoading, setVideoToCloudinaryLoading] =
    useState(false);
  const [videoToCloudinaryError, setVideoToCloudinaryError] = useState(null);

  // Handle video file selection and extract duration
  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setVideoFile(null);
      setNewVideoData((prev) => ({ ...prev, duration: "" }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      e.target.value = "";
      return;
    }

    setVideoFile(file);
    setDurationExtracting(true);

    try {
      const durationInSeconds = await getVideoDuration(file);
      const formattedDuration = formatDurationFromSeconds(durationInSeconds);

      setNewVideoData((prev) => ({
        ...prev,
        duration: formattedDuration,
      }));

      toast.success(`Video duration detected: ${formattedDuration}`);
    } catch (error) {
      console.error("Error extracting video duration:", error);
      toast.error(
        "Failed to extract video duration. Please enter it manually."
      );
      setNewVideoData((prev) => ({ ...prev, duration: "" }));
    } finally {
      setDurationExtracting(false);
    }
  };

  const uploadVideoToCloudinary = async (file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", "VIDEO");
    formData.append("use_streaming", true);

    try {
      setVideoToCloudinaryLoading(true);
      setVideoToCloudinaryError(null);
      const response = await axios.post(
        `https://api.ihsaanacademia.com/resource/course-video/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Video uploaded successfully!");

      setVideoToCloudinaryLoading(false);
      setVideoToCloudinaryError(null);
      return response.data.id;
    } catch (error) {
      toast.error("Failed to upload video");
      setVideoToCloudinaryLoading(false);
      setVideoToCloudinaryError(error.message);
      throw error;
    } finally {
      setVideoToCloudinaryLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    console.log("newVideoData::", newVideoData);
    if (
      !newVideoData.title ||
      !videoFile ||
      !newVideoData.section ||
      !newVideoData.video_no ||
      !newVideoData.duration
    ) {
      toast.error(
        "Please provide title, section, video number, order, duration, and upload a video file"
      );
      return;
    }

    try {
      setVideoUploadLoading(true);
      const videoResourceId = await uploadVideoToCloudinary(videoFile);

      const durationInSeconds = convertDurationToSeconds(newVideoData.duration);
      console.log(
        "video response here:",
        newVideoData.duration,
        durationInSeconds
      );

      const response = await axios.post(
        "https://api.ihsaanacademia.com/course/course-videos/",
        {
          ...newVideoData,
          course: parseInt(courseId),
          section: parseInt(newVideoData.section),
          video_resource_id: videoResourceId,
          duration: durationInSeconds,
          order: parseInt(newVideoData.order),
          video_no: parseInt(newVideoData.video_no),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      toast.success("Video added successfully!");
      setCourseVideos((prev) => [...prev, response.data]);
      setNewVideoData({
        section: "",
        video_no: "",
        title: "",
        duration: "",
        order: "",
      });
      setVideoFile(null);
      fetchCourseSections();
    } catch (error) {
      console.log("error here", error);
      toast.error(extractErrorMessage(error, "Failed to add video"));
    } finally {
      setVideoUploadLoading(false);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const token = getAuthToken();
    setImageUploadLoading(true);
    setImageUploadSuccessful(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", "IMAGE");

    try {
      const response = await axios.post(
        "https://api.ihsaanacademia.com/resource/course-materials/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Image uploaded successfully!");
      setImageUploadSuccessful(true);
      return { media_url: response.data.media_url, id: response.data.id };
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to upload image"));
      throw error;
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);

      try {
        const { media_url } = await uploadImageToCloudinary(file);
        console.log("hereee", media_url);
        const normalizedUrl = normalizeUrl(media_url);
        setCourseData({ ...courseData, image_url: normalizedUrl || media_url });
        setPreviewImage(normalizedUrl || media_url);
        URL.revokeObjectURL(preview);
      } catch (error) {
        toast.error(extractErrorMessage(error, "Image upload failed"));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        `https://api.ihsaanacademia.com/course/courses/${courseId}/`,
        courseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      toast.success("Course updated successfully!");
      router.push("/admin/courses");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const [materialUploadLoading, setMaterialUploadLoading] = useState(false);
  const handleAddMaterial = async (e) => {
    e.preventDefault();

    if (!newMaterialData.title || !newMaterialData.section) {
      toast.error(
        "Please provide title, select a section, and set an order for the material"
      );
      return;
    }

    try {
      setMaterialUploadLoading(true);
      const fileInput = document.getElementById("materialFileInput");
      const file = fileInput?.files[0];
      if (!file) {
        toast.error("Please upload a file for the material");
        setMaterialUploadLoading(false);
        return;
      }

      const { id: materialResourceId } = await uploadImageToCloudinary(file);

      const response = await axios.post(
        "https://api.ihsaanacademia.com/course/course-materials/",
        {
          course: parseInt(courseId),
          section: parseInt(newMaterialData.section),
          title: newMaterialData.title,
          material_resource_id: materialResourceId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("material_response", response.data);
      toast.success("Material added successfully!");
      setNewMaterialData({ title: "", section: "", order: "" });
      if (fileInput) fileInput.value = "";
      fetchCourseSections();
    } catch (error) {
      toast.error("Failed to add material");
      console.error("Error adding material:", error.response?.data || error);
    } finally {
      setMaterialUploadLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this video?"
      );
      if (!confirmDelete) return;

      await axios.delete(
        `https://api.ihsaanacademia.com/course/course-videos/${videoId}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      toast.success("Video deleted successfully!");
      fetchCourseSections();
    } catch (error) {
      toast.error("Failed to delete video");
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this material?"
      );
      if (!confirmDelete) return;

      await axios.delete(
        `https://api.ihsaanacademia.com/course/course-materials/${materialId}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      toast.success("Material deleted successfully!");
      fetchCourseSections();
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  const handleUnenrollStudent = async (userId, termId) => {
    try {
      const confirmUnenroll = window.confirm(
        "Are you sure you want to unenroll this student?"
      );
      if (!confirmUnenroll) return;

      const response = await axios.post(
        `https://api.ihsaanacademia.com/course/courses/${courseId}/unenroll/`,
        {
          user_id: userId,
          term_id: termId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("Unenroll response:", response.data);
      toast.success("Student unenrolled successfully!");
      fetchEnrolledStudents();
    } catch (error) {
      console.log(error, "error here");
      toast.error("Failed to unenroll student");
    }
  };

  const fetchCourseSections = async () => {
    if (!courseId) return;
    try {
      const response = await axios.get(
        `https://api.ihsaanacademia.com/course/course-sections/?course=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setCourseSections(response.data.results || response.data);
      console.log("Course sections fetched: ", response.data);
    } catch (error) {
      toast.error("Failed to fetch course sections");
      console.error("Error fetching course sections:", error);
    }
  };

  // Drag and drop handlers for sections
  const handleDragStart = (e, section) => {
    setDraggedSection(section);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", section.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetSection) => {
    e.preventDefault();
    if (!draggedSection || draggedSection.id === targetSection.id) {
      setDraggedSection(null);
      return;
    }

    setIsReordering(true);
    try {
      // Create new array with reordered sections
      const sectionsCopy = [...courseSections];
      const draggedIndex = sectionsCopy.findIndex(
        (s) => s.id === draggedSection.id
      );
      const targetIndex = sectionsCopy.findIndex(
        (s) => s.id === targetSection.id
      );

      // Remove dragged section from its current position
      const [draggedItem] = sectionsCopy.splice(draggedIndex, 1);

      // Insert dragged section at target position
      sectionsCopy.splice(targetIndex, 0, draggedItem);

      // Update order numbers
      const updatedSections = sectionsCopy.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      // Update local state immediately for better UX
      setCourseSections(updatedSections);

      // Prepare payload for API
      const payload = {
        sections: updatedSections.map((section, index) => ({
          id: section.id,
          order: index + 1,
        })),
      };

      // Send update to API
      const response = await axios.post(
        "https://api.ihsaanacademia.com/course/course-sections/update_order/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Sections reordered successfully!");
        // Refresh sections to ensure consistency
        fetchCourseSections();
      }
    } catch (error) {
      toast.error("Failed to reorder sections. Please try again.");
      console.error("Error reordering sections:", error);
      // Revert to original order on error
      fetchCourseSections();
    } finally {
      setIsReordering(false);
      setDraggedSection(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
  };

  // Toggle section collapse state
  const toggleSectionCollapse = (sectionId) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionData.title || !newSectionData.has_mcq_assessment) {
      toast.error("Please provide title and order for the section.");
      return;
    }
    setIsLoading(true); // Use a general loading state or create a new one for sections
    try {
      const response = await axios.post(
        "https://api.ihsaanacademia.com/course/course-sections/",
        {
          ...newSectionData,
          course: parseInt(courseId), // Ensure courseId is an integer
          has_mcq_assessment: newSectionData.has_mcq_assessment === "Yes",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      toast.success("Section added successfully!");
      setCourseSections((prev) => [...prev, response.data]);
      setNewSectionData({ title: "", description: "", has_mcq_assessment: "" }); // Reset form
      fetchCourseSections(); // Re-fetch to get the latest list with IDs
    } catch (error) {
      toast.error(
        error.response?.data?.detail || error.message || "Failed to add section"
      );
      console.error("Error adding section:", error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      <main className="flex relative">
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        <div className="lg:max-w-[80vw] lg:min-w-[60vw] lg:ml-[20vw] p-6 bg-white rounded-lg shadow-md lg:w-[60vw]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Edit Course</h1>
            <AiOutlineHome
              className="text-3xl text-gray-600 cursor-pointer hover:text-gray-900"
              onClick={() => router.push("/admin/courses")}
            />
          </div>

          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection("courseDetails")}
            >
              <h2 className="text-xl font-semibold">Course Details</h2>
              {sections.courseDetails ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.courseDetails && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={courseData.title}
                      onChange={(e) =>
                        setCourseData({ ...courseData, title: e.target.value })
                      }
                      required
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={courseData.description}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          description: e.target.value,
                        })
                      }
                      required
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={courseData.name}
                      onChange={(e) =>
                        setCourseData({ ...courseData, name: e.target.value })
                      }
                      required
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Code
                    </label>
                    <input
                      type="text"
                      value={courseData.code}
                      onChange={(e) =>
                        setCourseData({ ...courseData, code: e.target.value })
                      }
                      required
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Programme
                    </label>
                    <select
                      value={courseData.programme}
                      onChange={(e) =>
                        setCourseData({
                          ...courseData,
                          programme: e.target.value,
                        })
                      }
                      required
                      className="mt-1 block w-full p-2 border rounded-md"
                    >
                      <option value="" disabled>
                        Select a programme
                      </option>
                      {programmes.map((programme) => (
                        <option key={programme.id} value={programme.id}>
                          {programme.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course Caption
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="mt-1 block w-full p-2 border rounded-md"
                    />
                    {previewImage && imageUploadSuccessful ? (
                      (() => {
                        const normalizedUrl = normalizeUrl(previewImage);
                        return normalizedUrl ? (
                          <Image
                            width={40}
                            height={40}
                            src={normalizedUrl}
                            alt="Preview"
                            className="mt-3 w-40 h-40 object-cover border rounded-md"
                          />
                        ) : (
                          <div className="mt-3 w-40 h-40 border rounded-md flex items-center justify-center text-gray-500">
                            Invalid image URL
                          </div>
                        );
                      })()
                    ) : imageUploadLoading ? (
                      <div>Uploading image...</div>
                    ) : null}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary text-white px-4 py-2 rounded-md"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Course"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Course Sections Section */}
          <div className="my-6 pt-4 border-t border-gray-300">
            <div
              className="flex justify-between items-center cursor-pointer mb-4"
              onClick={() => toggleSection("courseSections")}
            >
              <h2 className="text-xl font-semibold">Course Sections</h2>
              {sections.courseSections ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.courseSections && (
              <div className="space-y-6">
                {/* Add Section Form */}
                <form
                  onSubmit={handleAddSection}
                  className="p-4 border rounded-md shadow-sm space-y-4 bg-gray-50"
                >
                  <h3 className="text-lg font-medium text-gray-800">
                    Add New Section
                  </h3>
                  <div>
                    <label
                      htmlFor="section_title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Section Title
                    </label>
                    <input
                      type="text"
                      id="section_title"
                      value={newSectionData.title}
                      onChange={(e) =>
                        setNewSectionData({
                          ...newSectionData,
                          title: e.target.value,
                        })
                      }
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="section_description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Section Description
                    </label>
                    <textarea
                      id="section_description"
                      value={newSectionData.description}
                      onChange={(e) =>
                        setNewSectionData({
                          ...newSectionData,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="has_mcq_assessment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Will this section have assessment?
                    </label>
                    <select
                      id="has_mcq_assessment"
                      value={newSectionData.has_mcq_assessment}
                      onChange={(e) =>
                        setNewSectionData({
                          ...newSectionData,
                          has_mcq_assessment: e.target.value,
                        })
                      }
                      required
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Section"}
                  </button>
                </form>

                {/* Display Course Sections */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Available Sections{" "}
                    {isReordering && (
                      <span className="text-sm text-blue-600">
                        (Reordering...)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    💡 Sections are collapsed by default for easier reordering.
                    Click on a section header or use the arrow button to
                    expand/collapse content.
                  </p>
                  {courseSections && courseSections.length > 0 ? (
                    <ul className="space-y-3">
                      {courseSections
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((section) => (
                          <li
                            key={section.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, section)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, section)}
                            onDragEnd={handleDragEnd}
                            className={`p-4 border rounded-lg bg-white shadow-md mb-6 cursor-move transition-all duration-200 ${
                              draggedSection?.id === section.id
                                ? "opacity-50 scale-95 border-blue-400"
                                : "hover:shadow-lg hover:border-gray-300"
                            } ${isReordering ? "pointer-events-none" : ""}`}
                          >
                            <div
                              className="mb-3 pb-2 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-t p-2 -m-2"
                              onClick={() => toggleSectionCollapse(section.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                  <FaGripVertical className="text-gray-400 mr-2 cursor-grab active:cursor-grabbing" />
                                  <h4 className="text-xl font-semibold text-indigo-700">
                                    {section.title}
                                  </h4>
                                  {collapsedSections.has(section.id) && (
                                    <span className="ml-2 text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
                                      Collapsed
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSectionCollapse(section.id);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-200"
                                    title={
                                      collapsedSections.has(section.id)
                                        ? "Expand section"
                                        : "Collapse section"
                                    }
                                  >
                                    {collapsedSections.has(section.id) ? (
                                      <FaChevronDown className="w-4 h-4" />
                                    ) : (
                                      <FaChevronUp className="w-4 h-4" />
                                    )}
                                  </button>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Drag to reorder
                                  </span>
                                </div>
                              </div>
                              {section.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {section.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Position: {section.order}
                              </p>
                            </div>

                            {/* Collapsible content */}
                            {!collapsedSections.has(section.id) && (
                              <>
                                {/* Display Videos for this section */}
                                <div className="mb-4">
                                  <h5 className="text-md font-semibold text-gray-700 mb-2">
                                    Videos in this section:
                                  </h5>
                                  {section.videos &&
                                  section.videos.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 border rounded-md">
                                      {section.videos.map((video) => (
                                        <li
                                          key={video.id}
                                          className="p-3 flex items-center justify-between hover:bg-gray-50"
                                        >
                                          <div className="flex items-center">
                                            {video.video_resource
                                              ?.media_url && (
                                              <div
                                                onClick={() =>
                                                  window.open(
                                                    normalizeUrl(
                                                      video.video_resource
                                                        .media_url
                                                    ) ||
                                                      video.video_resource
                                                        .media_url,
                                                    "_blank"
                                                  )
                                                }
                                                className="cursor-pointer mr-3 rounded overflow-hidden shadow-sm flex-shrink-0"
                                              >
                                                <video
                                                  width={100}
                                                  height={60}
                                                  className="border rounded"
                                                  controls={false}
                                                  muted
                                                >
                                                  <source
                                                    src={
                                                      normalizeUrl(
                                                        video.video_resource
                                                          .media_url
                                                      ) ||
                                                      video.video_resource
                                                        .media_url
                                                    }
                                                    type="video/mp4"
                                                  />
                                                  Your browser does not support
                                                  the video tag.
                                                </video>
                                              </div>
                                            )}
                                            <div className="flex flex-col">
                                              <h6 className="text-sm font-medium text-gray-800">
                                                {video.title} (Order:{" "}
                                                {video.order})
                                              </h6>
                                              <p className="text-xs text-gray-500">
                                                Video No: {video.video_no} |
                                                Duration: {video.duration}
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() =>
                                              handleDeleteVideo(video.id)
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 ml-2"
                                          >
                                            Delete
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="px-3 py-2 text-xs text-gray-500 italic bg-gray-50 rounded-md">
                                      No videos in this section.
                                    </p>
                                  )}
                                </div>

                                {/* Display Materials for this section */}
                                <div>
                                  <h5 className="text-md font-semibold text-gray-700 mb-2">
                                    Materials in this section:
                                  </h5>
                                  {section.materials &&
                                  section.materials.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 border rounded-md">
                                      {section.materials.map((material) => (
                                        <li
                                          key={material.id}
                                          className="p-3 flex items-center justify-between hover:bg-gray-50"
                                        >
                                          <div className="flex items-center">
                                            {material.material_resource
                                              ?.media_url ? (
                                              <div
                                                onClick={() =>
                                                  window.open(
                                                    normalizeUrl(
                                                      material.material_resource
                                                        .media_url
                                                    ) ||
                                                      material.material_resource
                                                        .media_url,
                                                    "_blank"
                                                  )
                                                }
                                                className="cursor-pointer mr-3 flex-shrink-0 w-8 h-8 flex items-center justify-center"
                                              >
                                                {material.material_resource.media_url.endsWith(
                                                  ".pdf"
                                                ) ? (
                                                  <FaFilePdf className="w-6 h-6 text-red-500" />
                                                ) : material.material_resource.media_url.match(
                                                    /\.(docx?|odt)$/i
                                                  ) ? (
                                                  <FaFileWord className="w-6 h-6 text-blue-500" />
                                                ) : material.material_resource.media_url.match(
                                                    /\.(xlsx?|ods)$/i
                                                  ) ? (
                                                  <FaFileExcel className="w-6 h-6 text-green-500" />
                                                ) : (
                                                  <FaFile className="w-6 h-6 text-gray-400" />
                                                )}
                                              </div>
                                            ) : (
                                              <FaFile className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                                            )}
                                            <div className="flex flex-col">
                                              <h6 className="text-sm font-medium text-gray-800">
                                                {material.title} (Order:{" "}
                                                {material.order})
                                              </h6>
                                              <p className="text-xs text-gray-500 italic">
                                                Click icon to download/view
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() =>
                                              handleDeleteMaterial(material.id)
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 ml-2"
                                          >
                                            Delete
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="px-3 py-2 text-xs text-gray-500 italic bg-gray-50 rounded-md">
                                      No materials in this section.
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      No sections added yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <hr className="my-6 border-t-4 border-blue-600 shadow-md" />

          <div className="mt-10 rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="border-b">
              <button
                className="flex justify-between items-center w-full p-6 cursor-pointer focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-50"
                onClick={() => toggleSection("courseMaterials")}
              >
                <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
                  Course Materials
                </h2>
                <div className="text-gray-600">
                  {sections.courseMaterials ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
              </button>

              {sections.courseMaterials && (
                <div className="p-6">
                  {/* Add Material Form */}
                  <div className="mb-6 border-b pb-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">
                      Add New Material
                    </h3>
                    <form onSubmit={handleAddMaterial} className="space-y-4">
                      <div>
                        <label
                          htmlFor="material_title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Material Title
                        </label>
                        <input
                          type="text"
                          id="material_title"
                          value={newMaterialData.title}
                          onChange={(e) =>
                            setNewMaterialData({
                              ...newMaterialData,
                              title: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      {/* Select Section Dropdown */}
                      <div>
                        <label
                          htmlFor="material_section"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Section
                        </label>
                        <select
                          id="material_section"
                          value={newMaterialData.section}
                          onChange={(e) =>
                            setNewMaterialData({
                              ...newMaterialData,
                              section: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="" disabled>
                            Select a section
                          </option>
                          {courseSections.map((sec) => (
                            <option key={sec.id} value={sec.id}>
                              {sec.title} (Order: {sec.order})
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Material Order Input */}
                      {/* <div>
                        <label
                          htmlFor="material_order"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Order in Section
                        </label>
                        <input
                          type="number"
                          id="material_order"
                          value={newMaterialData.order}
                          onChange={(e) =>
                            setNewMaterialData({
                              ...newMaterialData,
                              order: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., 1, 2, 3..."
                        />
                      </div> */}
                      <div>
                        <label
                          htmlFor="materialFileInput"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Upload Material
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="file"
                            id="materialFileInput"
                            className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                          disabled={materialUploadLoading}
                        >
                          {materialUploadLoading
                            ? "Uploading..."
                            : "Add Material"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 border-t-4 border-blue-600 shadow-md" />

          <div className="mt-10 rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="border-b">
              <button
                className="flex justify-between items-center w-full p-6 cursor-pointer focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-50"
                onClick={() => toggleSection("courseVideos")}
              >
                <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
                  Course Videos
                </h2>
                <div className="text-gray-600">
                  {sections.courseVideos ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>

              {sections.courseVideos && (
                <div className="p-6">
                  {/* Add Video Form */}
                  <div className="mb-6 border-b pb-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">
                      Add New Video
                    </h3>
                    <form onSubmit={handleAddVideo} className="space-y-4">
                      {/* Select Section Dropdown for Video */}
                      <div>
                        <label
                          htmlFor="video_section"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Section
                        </label>
                        <select
                          id="video_section"
                          value={newVideoData.section}
                          onChange={(e) =>
                            setNewVideoData({
                              ...newVideoData,
                              section: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="" disabled>
                            Select a section
                          </option>
                          {courseSections.map((sec) => (
                            <option key={sec.id} value={sec.id}>
                              {sec.title} (Order: {sec.order})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="video_no"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Video Number
                        </label>
                        <input
                          type="number"
                          id="video_no"
                          value={newVideoData.video_no}
                          onChange={(e) =>
                            setNewVideoData({
                              ...newVideoData,
                              video_no: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={newVideoData.title}
                          onChange={(e) =>
                            setNewVideoData({
                              ...newVideoData,
                              title: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="duration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Duration{" "}
                          {durationExtracting
                            ? "(extracting...)"
                            : "(auto-detected)"}
                        </label>
                        <input
                          type="text"
                          id="duration"
                          value={newVideoData.duration}
                          readOnly
                          onChange={(e) =>
                            setNewVideoData({
                              ...newVideoData,
                              duration: e.target.value,
                            })
                          }
                          placeholder="e.g., 05:30 or 1:23:45"
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Duration is automatically detected from the video
                          file. Format: MM:SS or HH:MM:SS
                        </p>
                      </div>
                      {/* <div>
                        <label
                          htmlFor="order"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Order in Section
                        </label>
                        <input
                          type="number"
                          id="order"
                          value={newVideoData.order}
                          onChange={(e) =>
                            setNewVideoData({
                              ...newVideoData,
                              order: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., 1, 2, 3..."
                        />
                      </div> */}
                      <div>
                        <label
                          htmlFor="video_file"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Upload Video
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="file"
                            id="video_file"
                            onChange={handleVideoFileChange}
                            accept="video/*"
                            required
                            className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          {durationExtracting && (
                            <div className="absolute right-2 top-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                          disabled={
                            videoToCloudinaryLoading ||
                            videoUploadLoading ||
                            durationExtracting
                          }
                        >
                          {durationExtracting
                            ? "Extracting duration..."
                            : videoToCloudinaryLoading
                            ? "Uploading video..."
                            : videoUploadLoading
                            ? "Adding video..."
                            : "Add Video"}
                        </button>
                        {videoToCloudinaryError && (
                          <p className="mt-2 text-red-500 text-sm">
                            {videoToCloudinaryError}
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 border-t-4 border-blue-600 shadow-md" />

          <div className="mt-10 rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="border-b">
              <button
                className="flex justify-between items-center w-full p-6 cursor-pointer focus:outline-none transition-colors duration-300 ease-in-out hover:bg-gray-50"
                onClick={() => toggleSection("courseEnrollment")}
              >
                <h2 className="text-lg font-semibold text-gray-800 tracking-wide">
                  Course Enrollment
                </h2>
                <div className="text-gray-600">
                  {sections.courseEnrollment ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </div>
              </button>

              {sections.courseEnrollment && (
                <div className="p-6">
                  {enrolledStudents?.length > 0 ? (
                    <ul className="space-y-4">
                      {enrolledStudents.map((student) => (
                        <li
                          key={student.id}
                          className="bg-gray-100 rounded-md shadow-sm flex items-center justify-between p-4 transition-shadow duration-300 ease-in-out hover:shadow-md"
                        >
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-gray-700">
                              {student.fullname}
                            </p>
                            <p className="text-xs text-gray-500">
                              Term: {student.term.name}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleUnenrollStudent(student.id, student.term.id)
                            }
                            className="bg-red-500 hover:bg-red-700 text-white font-semibold text-xs py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                          >
                            Unenroll
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 italic">
                      No students enrolled yet.
                    </p>
                  )}

                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">
                      Enroll New Students
                    </h3>
                    <form onSubmit={handleEnrollStudents} className="space-y-4">
                      <div>
                        <label
                          htmlFor="term"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Select Term
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <select
                            id="term"
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            required
                            className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="" disabled>
                              Select a term
                            </option>
                            {terms.map((term) => (
                              <option key={term.id} value={term.id}>
                                {term.name} ({term.session.year})
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                            <FaCaretDown className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Select Students
                        </label>
                        <ul className="space-y-2 mt-2 border rounded-md p-3 bg-gray-50">
                          {allStudents
                            .filter(
                              (student) =>
                                !enrolledStudents.some(
                                  (enrolled) => enrolled.id === student.id
                                )
                            )
                            .map((student) => (
                              <li
                                key={student.id}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  id={`student-${student.id}`}
                                  value={student.id}
                                  checked={selectedStudents.includes(
                                    student.id
                                  )}
                                  onChange={() =>
                                    handleStudentSelection(student.id)
                                  }
                                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor={`student-${student.id}`}
                                  className="text-sm text-gray-600"
                                >
                                  {`${student.first_name || ""} ${
                                    student.last_name || ""
                                  }`.trim()}
                                </label>
                              </li>
                            ))}
                          {allStudents.filter(
                            (student) =>
                              !enrolledStudents.some(
                                (enrolled) => enrolled.id === student.id
                              )
                          ).length === 0 && (
                            <li className="text-sm text-gray-500 italic">
                              No new students available to enroll.
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                          disabled={
                            isEnrollLoading || selectedStudents.length === 0
                          }
                        >
                          {isEnrollLoading
                            ? "Enrolling..."
                            : "Enroll Selected Students"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 mb-16 border-t-4 border-blue-600 shadow-md" />
        </div>
      </main>
    </div>
  );
}

export default EditCoursePage;
