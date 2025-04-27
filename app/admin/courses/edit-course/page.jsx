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
} from "react-icons/fa";
import { convertDurationToSeconds } from "@/utils/utilFunctions";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";

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

  const [courseMaterials, setCourseMaterials] = useState([]);
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadSuccessful, setImageUploadSuccessful] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // List of all students
  const [selectedStudents, setSelectedStudents] = useState([]); // Students to enroll
  const [terms, setTerms] = useState([]); // List of terms
  const [selectedTerm, setSelectedTerm] = useState(""); // Selected term
  const [isEnrollLoading, setIsEnrollLoading] = useState(false); // Loading state for enrollment

  const [sections, setSections] = useState({
    courseDetails: true,
    courseMaterials: false,
    courseVideos: false,
    courseEnrollment: false,
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
      fetchCourseMaterials();
      fetchCourseVideos();
      fetchEnrolledStudents();
      fetchTerms();
      fetchAllStudents();
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
        "https://ihsaanlms.onrender.com/api/all-student",
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setAllStudents(response.data.results); // Populate allStudents state
    } catch (error) {
      toast.error("Failed to fetch all students");
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(
        `https://ihsaanlms.onrender.com/course/courses/${courseId}/enrolled_students/`,
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
            "https://ihsaanlms.onrender.com/course/course-enrollments/",
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
      setSelectedStudents([]); // Clear selected students
      fetchEnrolledStudents(); // Refresh enrolled students list
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
        "https://ihsaanlms.onrender.com/terms/",
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
        `https://ihsaanlms.onrender.com/course/courses/${courseId}/`,
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
        setPreviewImage(course.image_url);
        setImageUploadSuccessful(true);
      }
    } catch (error) {
      toast.error("Failed to fetch course data");
    }
  };

  const fetchCourseMaterials = async () => {
    try {
      console.log("werh", courseId);
      const response = await axios.get(
        `https://ihsaanlms.onrender.com/course/courses/course-materials/?course_id=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("material response", response.data);
      setCourseMaterials(response.data);
    } catch (error) {
      toast.error("Failed to fetch course materials");
    }
  };

  const fetchCourseVideos = async () => {
    try {
      const response = await axios.get(
        `https://ihsaanlms.onrender.com/course/course-videos/?course=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setCourseVideos(response.data.results);
    } catch (error) {
      toast.error("Failed to fetch course videos");
    }
  };

  const [videoToCloudinaryLoading, setVideoToCloudinaryLoading] =
    useState(false);
  const [videoToCloudinaryError, setVideoToCloudinaryError] = useState(null);

  const uploadVideoToCloudinary = async (file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", "VIDEO");

    try {
      setVideoToCloudinaryLoading(true);
      setVideoToCloudinaryError(null);
      const response = await axios.post(
        "https://ihsaanlms.onrender.com/resource/course-video/",
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
      return response.data.id; // Return the video resource ID
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

    if (!newVideoData.title || !videoFile) {
      toast.error("Please provide all required fields and upload a video file");
      return;
    }

    try {
      setVideoUploadLoading(true);
      const videoResourceId = await uploadVideoToCloudinary(videoFile);

      // Convert duration to seconds before sending
      const durationInSeconds = convertDurationToSeconds(newVideoData.duration);
      console.log(
        "video response here:",
        newVideoData.duration,
        durationInSeconds
      );

      const response = await axios.post(
        "https://ihsaanlms.onrender.com/course/course-videos/",
        {
          ...newVideoData,
          course: courseId,
          video_resource_id: videoResourceId,
          duration: durationInSeconds,
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
      fetchCourseVideos();
    } catch (error) {
      toast.error("Failed to add video");
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
        "https://ihsaanlms.onrender.com/resource/course-materials/",
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
      toast.error("Failed to upload image");
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
        setCourseData({ ...courseData, image_url: media_url });
        setPreviewImage(media_url);
        URL.revokeObjectURL(preview);
      } catch (error) {
        toast.error("Image upload failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        `https://ihsaanlms.onrender.com/course/courses/${courseId}/`,
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

    if (!newMaterialTitle) {
      toast.error("Please provide a title for the material");
      return;
    }

    try {
      setMaterialUploadLoading(true);
      const fileInput = document.getElementById("materialFileInput");
      const file = fileInput?.files[0];
      if (!file) {
        toast.error("Please upload a file for the material");
        return;
      }

      const { id: materialResourceId } = await uploadImageToCloudinary(file);

      const response = await axios.post(
        "https://ihsaanlms.onrender.com/course/course-materials/",
        {
          title: newMaterialTitle,
          course: courseId,
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
      // setCourseMaterials((prev) => [...prev, response.data]);
      setNewMaterialTitle("");
      fileInput.value = ""; // Clear the file input
      fetchCourseMaterials();
    } catch (error) {
      toast.error("Failed to add material");
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
        `https://ihsaanlms.onrender.com/course/course-videos/${videoId}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      toast.success("Video deleted successfully!");
      setCourseVideos((prev) => prev.filter((video) => video.id !== videoId)); // Remove the deleted video from the state
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
        `https://ihsaanlms.onrender.com/course/course-materials/${materialId}/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      toast.success("Material deleted successfully!");
      setCourseMaterials((prev) =>
        prev.filter((material) => material.id !== materialId)
      ); // Remove the deleted material from the state
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
        `https://ihsaanlms.onrender.com/course/courses/${courseId}/unenroll/`,
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

  return (
    <div className="relative">
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      <main className="flex relative">
        {/* Sidebar */}
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

          {/* Course Details Section */}
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
                      <Image
                        width={40}
                        height={40}
                        src={previewImage}
                        alt="Preview"
                        className="mt-3 w-40 h-40 object-cover border rounded-md"
                      />
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

          <hr className="my-6 border-t-4 border-blue-600 shadow-md" />
          {/* Course Materials Section */}
          <div className="mt-10 rounded-lg shadow-lg overflow-hidden bg-white">
            {/* Course Materials Section */}
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
                          value={newMaterialTitle}
                          onChange={(e) => setNewMaterialTitle(e.target.value)}
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
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
                        >
                          {materialUploadLoading
                            ? "Uploading..."
                            : "Add Material"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Display Course Materials */}
                  <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">
                      Available Materials
                    </h3>
                    <div
                      className="rounded-md border overflow-y-auto"
                      style={{ maxHeight: "400px" }}
                    >
                      {Array.isArray(courseMaterials) &&
                      courseMaterials.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {courseMaterials.map((material) => (
                            <li
                              key={material.id}
                              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                            >
                              <div className="flex items-center">
                                {/* Material Icon/Preview */}
                                {material.material_resource?.media_url ? (
                                  <div
                                    onClick={() =>
                                      window.open(
                                        material.material_resource.media_url,
                                        "_blank"
                                      )
                                    }
                                    className="cursor-pointer mr-4"
                                  >
                                    {/* You might want to display different icons based on file type */}
                                    {material.material_resource.media_url.endsWith(
                                      ".pdf"
                                    ) ? (
                                      <FaFilePdf className="w-8 h-8 text-red-500" />
                                    ) : material.material_resource.media_url.match(
                                        /\.(docx?|odt)$/i
                                      ) ? (
                                      <FaFileWord className="w-8 h-8 text-blue-500" />
                                    ) : material.material_resource.media_url.match(
                                        /\.(xlsx?|ods)$/i
                                      ) ? (
                                      <FaFileExcel className="w-8 h-8 text-green-500" />
                                    ) : (
                                      <FaFile className="w-8 h-8 text-gray-500" />
                                    )}
                                  </div>
                                ) : (
                                  <FaFile className="w-8 h-8 text-gray-500 mr-4" />
                                )}

                                {/* Material Details */}
                                <div className="flex flex-col">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    {material.title}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    ID: {material.material_resource?.id}
                                  </p>
                                  <p className="text-xs text-gray-500 italic">
                                    Click to download/view
                                  </p>
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() =>
                                  handleDeleteMaterial(material.id)
                                }
                                className="bg-red-500 hover:bg-red-700 text-white font-semibold text-xs py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                              >
                                Delete
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-4 text-gray-600 italic">
                          No materials added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 border-t-4 border-blue-600 shadow-md" />

          {/* Course videos section */}
          <div className="mt-10 rounded-lg shadow-lg overflow-hidden bg-white">
            {/* Course Videos Section */}
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
                      <div>
                        <label
                          htmlFor="section"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Section
                        </label>
                        <input
                          type="text"
                          id="section"
                          value={newVideoData.section}
                          onChange={(e) =>
                            setNewVideoData({
                              ...newVideoData,
                              section: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
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
                          Duration (in minutes)
                        </label>
                        <input
                          type="text"
                          id="duration"
                          value={newVideoData.duration}
                          onChange={(e) =>
                            setNewVideoData({
                              ...newVideoData,
                              duration: e.target.value,
                            })
                          }
                          required
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="order"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Order
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
                        />
                      </div>
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
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            required
                            className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                        >
                          {videoToCloudinaryLoading
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

                  {/* Display Course Videos */}
                  <div className="mt-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">
                      Available Videos
                    </h3>
                    <div
                      className="rounded-md border overflow-y-auto"
                      style={{ maxHeight: "400px" }}
                    >
                      {courseVideos.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {courseVideos.map((video) => (
                            <li
                              key={video.id}
                              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                            >
                              <div className="flex items-center">
                                {/* Video Thumbnail */}
                                {video.video_resource?.media_url && (
                                  <div
                                    onClick={() =>
                                      window.open(
                                        video.video_resource.media_url,
                                        "_blank"
                                      )
                                    }
                                    className="cursor-pointer mr-4 rounded-md overflow-hidden shadow-sm"
                                  >
                                    <video
                                      width={120}
                                      height={80}
                                      className="border rounded-md mr-4"
                                      controls={false}
                                      muted
                                    >
                                      <source
                                        src={video.video_resource.media_url}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </div>
                                )}

                                {/* Video Details */}
                                <div className="flex flex-col">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    {video.title}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    Section: {video.section}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Video No: {video.video_no} | Duration:{" "}
                                    {video.duration} min
                                  </p>
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteVideo(video.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-semibold text-xs py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
                              >
                                Delete
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-4 text-gray-600 italic">
                          No videos added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 border-t-4 border-blue-600 shadow-md" />

          {/* Course Enrollment Section */}
          <div className="mt-10 rounded-lg shadow-lg overflow-hidden bg-white">
            {/* Course Enrollment Section */}
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

                  {/* Enrollment Form */}
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">
                      Enroll New Students
                    </h3>
                    <form onSubmit={handleEnrollStudents} className="space-y-4">
                      {/* Select Term */}
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

                      {/* Select Students */}
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

                      {/* Submit Button */}
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
