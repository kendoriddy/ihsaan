"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import AdminDashboardSidebar from "@/components/AdminDashboardSidebar";
import AdminDashboardHeader from "@/components/AdminDashboardHeader";
import Button from "@/components/Button";
import Link from "next/link";
import { COURSES, IMAGES } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "@/utils/redux/slices/courseSlice";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import { useFetch, usePost, useDelete } from "@/hooks/useHttp/useHttp";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentRoute, setCurrentRoute] = useState("");

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, coursesPerPage: 10 }));
  }, [dispatch]);

  const {
    courses: allCourses,
    courseCount,
    status,
    totalPages,
  } = useSelector((state) => state.course);

  console.log(allCourses, "courses here:", courseCount);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentRoute(pathname);
    }
  }, [pathname]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("draft");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  const toggleOption = (index) => {
    setOpenSubMenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditCourse = (courseId) => {
    router.push(`/admin/courses/edit-course?courseId=${courseId}`);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
    dispatch(fetchCourses({ page: value, coursesPerPage: 10 }));
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleOpenDeleteModal = (courseId) => {
    setCourseToDelete(courseId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage

      const response = await axios.delete(
        `https://ihsaanlms.onrender.com/course/courses/${courseToDelete}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      if (response.status === 204) {
        toast.success("Course deleted successfully!");
        dispatch(fetchCourses({ page: currentPage, coursesPerPage })); // Refresh the course list
      } else {
        throw new Error("Failed to delete course");
      }
    } catch (error) {
      console.error(
        "Error deleting course:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the course"
      );
    } finally {
      handleCloseDeleteModal();
    }
  };

  // Tutor Assignment Modal State
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  // Fetch tutors
  const { data: tutorsData, isLoading: tutorsLoading } = useFetch(
    "tutors",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/all-tutor?page_size=1000`
  );
  const tutors = tutorsData?.data?.results || [];

  // Fetch terms
  const { data: termsData, isLoading: termsLoading } = useFetch(
    "terms",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms/`
  );
  const terms = termsData?.data?.results || [];

  // Fetch assignments
  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    refetch: refetchAssignments,
  } = useFetch(
    "tutorAssignments",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments/`
  );
  const assignments = assignmentsData?.data?.results || [];

  // Assign tutor mutation
  const { mutate: assignTutor, isLoading: assigning } = usePost(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments/`,
    {
      onSuccess: () => {
        toast.success("Tutor assigned successfully");
        setOpenAssignModal(false);
        setSelectedTutor("");
        setSelectedCourse("");
        setSelectedTerm("");
        refetchAssignments();
      },
      onError: (error) => {
        const errorData = error.response?.data;
        if (typeof errorData === "string") {
          toast.error(errorData);
        } else if (typeof errorData === "object" && errorData !== null) {
          const messages = Object.values(errorData)
            .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
            .join(" ");
          toast.error(messages);
        } else {
          toast.error("Failed to assign tutor");
        }
      },
    }
  );

  // Delete assignment mutation
  const { mutate: deleteAssignment } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments`,
    {
      onSuccess: () => {
        toast.success("Assignment deleted");
        refetchAssignments();
      },
      onError: () => toast.error("Failed to delete assignment"),
    }
  );

  return (
    <div className="relative">
      {/* Header */}
      <AdminDashboardHeader toggleSidebar={toggleSidebar} />

      {/* Main */}
      <main className="flex relative">
        {/* Sidebar */}
        <AdminDashboardSidebar
          isSidebarOpen={isSidebarOpen}
          toggleOption={toggleOption}
          openSubMenuIndex={openSubMenuIndex}
          currentRoute={currentRoute}
        />

        {/* Main Body */}
        <section
          className=" lg:ml-[250px] w-screen px-2"
          style={{
            "@media (min-width: 1024px)": {
              width: "calc(100vw - 250px)",
            },
          }}
        >
          {/* Content Goes Here */}
          <div className="p-4">
            {/*   Top */}
            {/* Top */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">Courses</div>
              <div className="flex gap-2">
                <Button
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-all duration-300 cursor-pointer"
                  onClick={() => setOpenAssignModal(true)}
                >
                  Assign Tutor to Course
                </Button>
                <Link href="/admin/courses/add-course">
                  <Button className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer">
                    Add Course
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tutor Assignment Modal */}
            <Dialog
              open={openAssignModal}
              onClose={() => setOpenAssignModal(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Assign Tutor to Course</DialogTitle>
              <DialogContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    assignTutor({
                      user: selectedTutor,
                      course: selectedCourse,
                      term: selectedTerm,
                    });
                  }}
                  className="space-y-4 mt-2"
                >
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="tutor-label">Tutor</InputLabel>
                    <Select
                      labelId="tutor-label"
                      value={selectedTutor}
                      onChange={(e) => setSelectedTutor(e.target.value)}
                      label="Tutor"
                      required
                    >
                      {tutorsLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : tutors.length > 0 ? (
                        tutors.map((tutor) => (
                          <MenuItem key={tutor.id} value={tutor.id}>
                            {tutor.first_name} {tutor.last_name} ({tutor.email})
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No tutors found</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="course-label">Course</InputLabel>
                    <Select
                      labelId="course-label"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      label="Course"
                      required
                    >
                      {allCourses && allCourses.length > 0 ? (
                        allCourses.map((course) => (
                          <MenuItem key={course.id} value={course.id}>
                            {course.title || course.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No courses found</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="term-label">Term</InputLabel>
                    <Select
                      labelId="term-label"
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      label="Term"
                      required
                    >
                      {termsLoading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : terms.length > 0 ? (
                        terms.map((term) => (
                          <MenuItem key={term.id} value={term.id}>
                            <div className="flex flex-col">
                              <div className="font-medium">
                                {term.name} ({term.session?.year || "N/A"})
                                {term.is_active && (
                                  <span className="ml-2 text-green-600 text-xs font-bold">
                                    [ACTIVE]
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                {term.start_date} to {term.end_date}
                              </div>
                            </div>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No terms found</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <DialogActions>
                    <Button
                      onClick={() => setOpenAssignModal(false)}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      disabled={assigning}
                    >
                      {assigning ? "Assigning..." : "Assign"}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            {/* Tutor Assignments Table */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Tutor Assignments</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Tutor</th>
                      <th className="px-4 py-2 border">Course</th>
                      <th className="px-4 py-2 border">Term</th>
                      <th className="px-4 py-2 border">Assigned At</th>
                      <th className="px-4 py-2 border">Active</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentsLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          Loading...
                        </td>
                      </tr>
                    ) : assignments.length > 0 ? (
                      assignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td className="border px-4 py-2">
                            {assignment.tutor_full_name ||
                              assignment.first_name +
                                " " +
                                assignment.last_name}
                          </td>
                          <td className="border px-4 py-2">
                            {assignment.course}
                          </td>
                          <td className="border px-4 py-2">
                            {assignment.term}
                          </td>
                          <td className="border px-4 py-2">
                            {assignment.assigned_at
                              ? new Date(
                                  assignment.assigned_at
                                ).toLocaleString()
                              : "-"}
                          </td>
                          <td className="border px-4 py-2">
                            {assignment.is_active ? "Yes" : "No"}
                          </td>
                          <td className="border px-4 py-2">
                            <Button
                              color="error"
                              onClick={() => deleteAssignment(assignment.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No assignments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LIST COURSES */}
            <section className="py-12 ">
              <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8">
                {status === "loading" ? (
                  <div>Loading...</div>
                ) : (
                  allCourses?.map((course) => (
                    <div
                      key={course.id}
                      className="group shadow-xl w-[250px] rounded-md overflow-hidden mt-8 bg-gray-100 "
                    >
                      <div className=" w-full h-[200px] relative">
                        <Image
                          src={
                            course.image_url?.startsWith("http")
                              ? course.image_url
                              : IMAGES.course_1
                          }
                          // width={200}
                          // height={300}
                          fill
                          alt={course.title}
                          objectFit="cover"
                        />
                      </div>
                      {/* course bottom */}
                      <div className="px-2 py-2">
                        <div className="text-xm text-red-600">
                          {course.category}
                        </div>
                        <div className="min-h-[50px]">
                          <h3 className="text-lg font-semibold">
                            {course.title}
                          </h3>
                        </div>

                        {/* Course Description */}
                        <div className="text-sm text-gray-700 capitalize italic py-2">
                          {course.description}
                        </div>

                        {/* Created Date */}
                        <div className="text-xs py-2 text-neutral-600">
                          Created on:{" "}
                          {format(
                            new Date(course.created_at),
                            "MMMM d, yyyy h:mm a"
                          )}
                        </div>

                        <div className="flex justify-between items-center py-2 text-xs">
                          <div
                            className="px-3 py-2 border-2 border-primary hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-300 rounded "
                            onClick={() => handleEditCourse(course?.id)}
                          >
                            Edit
                          </div>
                          <div
                            className="bg-red-600 px-3 py-2 text-white cursor-pointer hover:bg-red-800 transition-all duration-300 rounded"
                            onClick={() => handleOpenDeleteModal(course?.id)}
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Pagination */}
            {status !== "loading" && courseCount !== 0 && (
              <section className="pt-4 pb-12">
                <div className="w-4/5 mx-auto border flex flex-col lg:flex-row justify-between items-center px-4 rounded">
                  <div>Total COURSES: {courseCount}</div>
                  <div>
                    <Stack spacing={2} className="py-5">
                      <Pagination
                        count={totalPages}
                        variant="outlined"
                        shape="rounded"
                        onChange={handleChange}
                      />
                    </Stack>
                  </div>
                </div>
              </section>
            )}

            {/* Delete Confirmation Modal */}
            <Dialog
              open={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              aria-labelledby="delete-course-dialog-title"
              aria-describedby="delete-course-dialog-description"
            >
              <DialogTitle id="delete-course-dialog-title">
                Are you sure you want to delete this course?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-course-dialog-description">
                  This action cannot be undone. Please confirm if you want to
                  delete this course.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition-all duration-300"
                >
                  Delete
                </button>
              </DialogActions>
            </Dialog>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Page;
