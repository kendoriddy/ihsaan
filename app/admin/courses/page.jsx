"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button as MuiButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import {
  useFetch,
  usePost,
  useDelete,
  usePatch,
} from "@/hooks/useHttp/useHttp";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Autocomplete from "@mui/material/Autocomplete";
import { getAuthToken } from "@/hooks/axios/axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Page() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentRoute, setCurrentRoute] = useState("");

  // Constants
  const coursesPerPage = 10;

  // Track if initial mount has happened
  const hasMountedRef = useRef(false);

  // Fetch courses on mount - show cached data immediately, refresh in background
  useEffect(() => {
    if (hasMountedRef.current) return; // Only run once on mount
    hasMountedRef.current = true;

    // Always fetch - Redux will show cached data if available while fetching
    dispatch(
      fetchCourses({
        page: 1,
        page_size: coursesPerPage,
        programme: null,
        search: null,
      })
    );
  }, [dispatch, coursesPerPage]);

  // Fetch programmes for filter dropdown
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/programmes/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProgrammes(response.data.results || []);
      } catch (error) {
        console.error("Error fetching programmes:", error);
      }
    };
    fetchProgrammes();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const {
    courses: allCourses,
    courseCount,
    status,
    totalPages,
    isRefreshing,
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

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [programmes, setProgrammes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

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
    dispatch(
      fetchCourses({
        page: value,
        page_size: coursesPerPage,
        programme: selectedProgramme || null,
        search: searchTerm || null,
      })
    );
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchValue) => {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(true);
        dispatch(
          fetchCourses({
            page: 1,
            page_size: coursesPerPage,
            programme: selectedProgramme || null,
            search: searchValue || null,
          })
        ).finally(() => {
          setIsSearching(false);
        });
      }, 500); // 500ms delay
    },
    [dispatch, coursesPerPage, selectedProgramme]
  );

  // Handle search input change
  const handleSearchInputChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    debouncedSearch(value);
  };

  // Handle programme filter
  const handleProgrammeFilter = (value) => {
    setSelectedProgramme(value);
    setCurrentPage(1); // Reset to first page when filtering
    dispatch(
      fetchCourses({
        page: 1,
        page_size: coursesPerPage,
        programme: value || null,
        search: searchTerm || null,
      })
    );
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedProgramme("");
    setCurrentPage(1);
    dispatch(
      fetchCourses({
        page: 1,
        page_size: coursesPerPage,
        programme: null,
        search: null,
      })
    );
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/${courseToDelete}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      if (response.status === 204) {
        toast.success("Course deleted successfully!");
        dispatch(
          fetchCourses({
            page: currentPage,
            page_size: coursesPerPage,
            programme: selectedProgramme || null,
            search: searchTerm || null,
          })
        ); // Refresh the course list
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
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  // Tutor to Students Assignment Modal State
  const [openTutorStudentModal, setOpenTutorStudentModal] = useState(false);
  const [selectedTutorForStudents, setSelectedTutorForStudents] =
    useState(null);
  const [selectedCourseForStudents, setSelectedCourseForStudents] =
    useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [courseStudents, setCourseStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [assignmentNotes, setAssignmentNotes] = useState("");

  // Tutor-Student Assignments List and Edit Modal State
  const [openEditAssignmentModal, setOpenEditAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editAssignmentNotes, setEditAssignmentNotes] = useState("");
  const [editAssignmentTutor, setEditAssignmentTutor] = useState(null);
  const [editAssignmentStudent, setEditAssignmentStudent] = useState(null);
  const [editAssignmentCourse, setEditAssignmentCourse] = useState(null);
  const [openDeleteTutorStudentDialog, setOpenDeleteTutorStudentDialog] =
    useState(false);
  const [tutorStudentToDelete, setTutorStudentToDelete] = useState(null);

  // Course-Tutor Assignment Edit Modal State
  const [openEditCourseTutorModal, setOpenEditCourseTutorModal] =
    useState(false);
  const [selectedCourseTutorAssignment, setSelectedCourseTutorAssignment] =
    useState(null);
  const [editCourseTutorTutor, setEditCourseTutorTutor] = useState(null);
  const [editCourseTutorCourse, setEditCourseTutorCourse] = useState(null);
  const [editCourseTutorTerm, setEditCourseTutorTerm] = useState(null);
  const [editCourseTutorIsActive, setEditCourseTutorIsActive] = useState(true);
  const [openDeleteCourseTutorDialog, setOpenDeleteCourseTutorDialog] =
    useState(false);
  const [courseTutorToDelete, setCourseTutorToDelete] = useState(null);
  const [openDeassignDialog, setOpenDeassignDialog] = useState(false);
  const [courseTutorToDeassign, setCourseTutorToDeassign] = useState(null);

  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    courses: false,
    tutorCourseAssignments: false,
    tutorStudentAssignments: false,
  });

  // Filter states for Tutor-Course Assignments
  const [tutorCourseFilters, setTutorCourseFilters] = useState({
    course: "",
    term: "",
    tutor: "",
    is_active: "",
    search: "",
  });

  // Filter states for Tutor-Student Assignments
  const [tutorStudentFilters, setTutorStudentFilters] = useState({
    course: "",
    tutor: "",
    student: "",
    is_active: "",
    search: "",
  });

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

  // Build query string for tutor-course assignments filters
  const tutorCourseAssignmentsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (tutorCourseFilters.course)
      params.append("course", tutorCourseFilters.course);
    if (tutorCourseFilters.term) params.append("term", tutorCourseFilters.term);
    if (tutorCourseFilters.tutor)
      params.append("user", tutorCourseFilters.tutor);
    if (tutorCourseFilters.is_active !== "")
      params.append("is_active", tutorCourseFilters.is_active);
    if (tutorCourseFilters.search)
      params.append("search", tutorCourseFilters.search);
    const queryString = params.toString();
    return `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/course/course-tutor-assignments/${queryString ? `?${queryString}` : ""}`;
  }, [tutorCourseFilters]);

  // Fetch assignments with filters
  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    refetch: refetchAssignments,
  } = useFetch(
    ["tutorAssignments", tutorCourseFilters],
    tutorCourseAssignmentsUrl
  );
  console.log(assignmentsData, "assignments data here:");
  // API returns direct array: [{...}, {...}]
  // useFetch returns axios response object, so assignmentsData.data is the actual API response (the array)
  const assignments = Array.isArray(assignmentsData?.data)
    ? assignmentsData.data
    : assignmentsData?.data?.results || [];
  console.log(assignments, "assignments here:");

  // Build query string for tutor-student assignments filters
  const tutorStudentAssignmentsUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (tutorStudentFilters.course)
      params.append("course", tutorStudentFilters.course);
    if (tutorStudentFilters.tutor)
      params.append("tutor", tutorStudentFilters.tutor);
    if (tutorStudentFilters.student)
      params.append("student", tutorStudentFilters.student);
    if (tutorStudentFilters.is_active !== "")
      params.append("is_active", tutorStudentFilters.is_active);
    if (tutorStudentFilters.search)
      params.append("search", tutorStudentFilters.search);
    const queryString = params.toString();
    return `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/course/tutor-student-assignments/${queryString ? `?${queryString}` : ""}`;
  }, [tutorStudentFilters]);

  // Fetch tutor-student assignments with filters
  const {
    data: tutorStudentAssignmentsData,
    isLoading: tutorStudentAssignmentsLoading,
    refetch: refetchTutorStudentAssignments,
  } = useFetch(
    ["tutorStudentAssignments", tutorStudentFilters],
    tutorStudentAssignmentsUrl
  );
  const tutorStudentAssignments =
    tutorStudentAssignmentsData?.data?.results || [];

  // Fetch all students for edit modal
  const { data: allStudentsData, isLoading: allStudentsLoading } = useFetch(
    "allStudents",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/all-student?page_size=1000`
  );
  const allStudents = allStudentsData?.data?.results || [];

  // Handle multiple tutor assignments
  const [assigningTutors, setAssigningTutors] = useState(false);

  const handleAssignMultipleTutors = async (e) => {
    e.preventDefault();

    if (!selectedTerm) {
      toast.error("Please select a term");
      return;
    }

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    if (selectedTutors.length === 0) {
      toast.error("Please select at least one tutor");
      return;
    }

    setAssigningTutors(true);

    try {
      const token = getAuthToken();
      const assignments = selectedTutors.map((tutor) => {
        const tutorId = tutor?.id || tutor;
        return {
          user: tutorId,
          course: selectedCourse,
          term: selectedTerm,
        };
      });

      // Make all assignments in parallel
      const results = await Promise.allSettled(
        assignments.map((assignment) =>
          axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments/`,
            assignment,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      // Count successes and failures
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (failed === 0) {
        toast.success(
          `Successfully assigned ${successful} tutor(s) to the course`
        );
        setOpenAssignModal(false);
        setSelectedTutors([]);
        setSelectedCourse("");
        setSelectedTerm("");
        refetchAssignments();
      } else if (successful > 0) {
        toast.warning(
          `Assigned ${successful} tutor(s), but ${failed} assignment(s) failed`
        );
        // Log errors for debugging
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(
              `Failed to assign tutor ${selectedTutors[index]}:`,
              result.reason
            );
          }
        });
        refetchAssignments();
      } else {
        toast.error("Failed to assign tutors");
        // Show first error
        const firstError = results.find((r) => r.status === "rejected");
        if (firstError?.reason?.response?.data) {
          const errorData = firstError.reason.response.data;
          if (typeof errorData === "string") {
            toast.error(errorData);
          } else if (typeof errorData === "object") {
            const messages = Object.values(errorData)
              .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
              .join(" ");
            toast.error(messages);
          }
        }
      }
    } catch (error) {
      console.error("Error assigning tutors:", error);
      const errorData = error.response?.data;
      if (typeof errorData === "string") {
        toast.error(errorData);
      } else if (typeof errorData === "object" && errorData !== null) {
        const messages = Object.values(errorData)
          .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
          .join(" ");
        toast.error(messages);
      } else {
        toast.error("Failed to assign tutors");
      }
    } finally {
      setAssigningTutors(false);
    }
  };

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

  // Handle edit course-tutor assignment
  const handleOpenEditCourseTutorModal = async (assignmentId) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments/${assignmentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const assignment = response.data;
      setSelectedCourseTutorAssignment(assignment);

      // Find and set tutor, course, and term objects
      const tutor = tutors.find(
        (t) => t.id === assignment.user || t.id === assignment.user?.id
      );
      const course = allCourses.find(
        (c) => c.id === assignment.course || c.id === assignment.course?.id
      );
      const term = terms.find(
        (t) => t.id === assignment.term || t.id === assignment.term?.id
      );

      setEditCourseTutorTutor(tutor || null);
      setEditCourseTutorCourse(course || null);
      setEditCourseTutorTerm(term || null);
      setEditCourseTutorIsActive(assignment.is_active !== false);
      setOpenEditCourseTutorModal(true);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      toast.error("Failed to fetch assignment details");
    }
  };

  // Update course-tutor assignment mutation
  const {
    mutate: updateCourseTutorAssignment,
    isLoading: updatingCourseTutorAssignment,
  } = usePatch(
    selectedCourseTutorAssignment
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments/${selectedCourseTutorAssignment.id}/`
      : null,
    {
      onSuccess: () => {
        toast.success("Assignment updated successfully");
        setOpenEditCourseTutorModal(false);
        setSelectedCourseTutorAssignment(null);
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
          toast.error("Failed to update assignment");
        }
      },
    }
  );

  // Handle edit course-tutor assignment submission
  const handleUpdateCourseTutorAssignment = (e) => {
    e.preventDefault();

    if (!selectedCourseTutorAssignment) return;

    const tutorId = editCourseTutorTutor?.id || editCourseTutorTutor;
    const courseId = editCourseTutorCourse?.id || editCourseTutorCourse;
    const termId = editCourseTutorTerm?.id || editCourseTutorTerm || null;

    if (!tutorId || !courseId) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateCourseTutorAssignment({
      user: tutorId,
      course: courseId,
      term: termId,
      is_active: editCourseTutorIsActive,
    });
  };

  // Handle delete course-tutor assignment
  const handleOpenDeleteCourseTutorDialog = (assignmentId) => {
    setCourseTutorToDelete(assignmentId);
    setOpenDeleteCourseTutorDialog(true);
  };

  const handleCloseDeleteCourseTutorDialog = () => {
    setOpenDeleteCourseTutorDialog(false);
    setCourseTutorToDelete(null);
  };

  const handleConfirmDeleteCourseTutor = async () => {
    if (!courseTutorToDelete) return;

    try {
      const token = getAuthToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments/${courseTutorToDelete}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Assignment deleted successfully");
      refetchAssignments();
      handleCloseDeleteCourseTutorDialog();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error(
        error.response?.data?.detail || "Failed to delete assignment"
      );
    }
  };

  // Handle deassign course-tutor assignment
  const handleOpenDeassignDialog = (assignmentId) => {
    setCourseTutorToDeassign(assignmentId);
    setOpenDeassignDialog(true);
  };

  const handleCloseDeassignDialog = () => {
    setOpenDeassignDialog(false);
    setCourseTutorToDeassign(null);
  };

  const handleConfirmDeassign = async () => {
    if (!courseTutorToDeassign) return;

    try {
      const token = getAuthToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/course-tutor-assignments/${courseTutorToDeassign}/deassign/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Tutor deassigned successfully");
      refetchAssignments();
      handleCloseDeassignDialog();
    } catch (error) {
      console.error("Error deassigning tutor:", error);
      toast.error(error.response?.data?.detail || "Failed to deassign tutor");
    }
  };

  // Fetch students enrolled in a course
  const fetchCourseStudents = async (courseId) => {
    if (!courseId) {
      setCourseStudents([]);
      return;
    }
    setIsLoadingStudents(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/courses/${courseId}/enrolled_students/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourseStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching course students:", error);
      toast.error("Failed to fetch students for this course");
      setCourseStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Get tutors assigned to a specific course
  const getTutorsForSelectedCourse = (courseId) => {
    if (!courseId || !assignments.length) return [];
    const courseIdNum =
      typeof courseId === "string" ? parseInt(courseId) : courseId;
    const courseAssignments = assignments.filter((assignment) => {
      const assignmentCourseId = assignment.course?.id || assignment.course;
      const assignmentCourseIdNum =
        typeof assignmentCourseId === "string"
          ? parseInt(assignmentCourseId)
          : assignmentCourseId;
      return (
        assignmentCourseIdNum === courseIdNum || assignmentCourseId === courseId
      );
    });

    // Extract unique tutor IDs from assignments
    const tutorIds = new Set();
    courseAssignments.forEach((assignment) => {
      const tutorId = assignment.user?.id || assignment.user;
      if (tutorId) tutorIds.add(tutorId);
    });

    // Return tutors that match the IDs
    return tutors.filter((tutor) => {
      const tutorId = tutor.id;
      const tutorIdNum =
        typeof tutorId === "string" ? parseInt(tutorId) : tutorId;
      return Array.from(tutorIds).some((id) => {
        const idNum = typeof id === "string" ? parseInt(id) : id;
        return idNum === tutorIdNum || id === tutorId;
      });
    });
  };

  // Handle term selection change for tutor assignment
  const handleTermChangeForAssignment = (termId) => {
    setSelectedTerm(termId);
    // Clear selected course if it doesn't match the new term
    if (selectedCourse) {
      const currentCourse = allCourses.find(
        (c) => c.id === parseInt(selectedCourse) || c.id === selectedCourse
      );
      const termIdNum = termId ? parseInt(termId) : null;
      const courseTermId = currentCourse?.term
        ? typeof currentCourse.term === "object"
          ? currentCourse.term.id
          : currentCourse.term
        : null;

      // If course term doesn't match selected term, clear the selection
      if (termIdNum && courseTermId !== termIdNum) {
        setSelectedCourse("");
      }
    }
  };

  // Filter courses based on selected term
  const getFilteredCoursesForTerm = () => {
    if (!selectedTerm) {
      // If no term selected, show all courses
      return allCourses || [];
    }
    const termIdNum = parseInt(selectedTerm);
    // Filter courses that match the selected term (or have null term)
    return (allCourses || []).filter((course) => {
      const courseTermId = course.term
        ? typeof course.term === "object"
          ? course.term.id
          : course.term
        : null;
      // Show courses with matching term or null term (courses without term assignment)
      return courseTermId === termIdNum || courseTermId === null;
    });
  };

  // Handle course selection change for tutor-student assignment
  const handleCourseChangeForStudents = (course) => {
    const courseId = course?.id || course;
    setSelectedCourseForStudents(course);
    setSelectedTutorForStudents(null);
    setSelectedStudents([]);
    if (courseId) {
      fetchCourseStudents(courseId);
    } else {
      setCourseStudents([]);
    }
  };

  // Handle tutor to students assignment submission
  const [assigningToStudents, setAssigningToStudents] = useState(false);

  const handleAssignTutorToStudents = async (e) => {
    e.preventDefault();

    const courseId = selectedCourseForStudents?.id || selectedCourseForStudents;
    const tutorId = selectedTutorForStudents?.id || selectedTutorForStudents;

    if (!courseId) {
      toast.error("Please select a course");
      return;
    }

    if (!tutorId) {
      toast.error("Please select a tutor");
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setAssigningToStudents(true);

    try {
      const token = getAuthToken();
      const assignments = selectedStudents.map((student) => {
        const studentId = student?.id || student;
        return {
          tutor: tutorId,
          student: studentId,
          course: courseId,
          notes: assignmentNotes || "",
        };
      });

      // Make all assignments in parallel
      const results = await Promise.allSettled(
        assignments.map((assignment) =>
          axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/tutor-student-assignments/`,
            assignment,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      // Count successes and failures
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (failed === 0) {
        toast.success(
          `Successfully assigned tutor to ${successful} student(s)`
        );
        setOpenTutorStudentModal(false);
        setSelectedTutorForStudents(null);
        setSelectedCourseForStudents(null);
        setSelectedStudents([]);
        setCourseStudents([]);
        setAssignmentNotes("");
        refetchTutorStudentAssignments();
      } else if (successful > 0) {
        toast.warning(
          `Assigned tutor to ${successful} student(s), but ${failed} assignment(s) failed`
        );
        // Log errors for debugging
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(
              `Failed to assign student ${selectedStudents[index]}:`,
              result.reason
            );
          }
        });
      } else {
        toast.error("Failed to assign tutor to students");
        // Show first error
        const firstError = results.find((r) => r.status === "rejected");
        if (firstError?.reason?.response?.data) {
          const errorData = firstError.reason.response.data;
          if (typeof errorData === "string") {
            toast.error(errorData);
          } else if (typeof errorData === "object") {
            const messages = Object.values(errorData)
              .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
              .join(" ");
            toast.error(messages);
          }
        }
      }
    } catch (error) {
      console.error("Error assigning tutor to students:", error);
      const errorData = error.response?.data;
      if (typeof errorData === "string") {
        toast.error(errorData);
      } else if (typeof errorData === "object" && errorData !== null) {
        const messages = Object.values(errorData)
          .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
          .join(" ");
        toast.error(messages);
      } else {
        toast.error("Failed to assign tutor to students");
      }
    } finally {
      setAssigningToStudents(false);
    }
  };

  // Handle edit assignment
  const handleOpenEditModal = async (assignmentId) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/tutor-student-assignments/${assignmentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const assignment = response.data;
      setSelectedAssignment(assignment);
      setEditAssignmentNotes(assignment.notes || "");

      // Find and set tutor, student, and course objects
      const tutor = tutors.find(
        (t) => t.id === assignment.tutor || t.id === assignment.tutor?.id
      );
      const student = allStudents.find(
        (s) => s.id === assignment.student || s.id === assignment.student?.id
      );
      const course = allCourses.find(
        (c) => c.id === assignment.course || c.id === assignment.course?.id
      );

      setEditAssignmentTutor(tutor || null);
      setEditAssignmentStudent(student || null);
      setEditAssignmentCourse(course || null);
      setOpenEditAssignmentModal(true);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      toast.error("Failed to fetch assignment details");
    }
  };

  // Update assignment mutation
  const { mutate: updateAssignment, isLoading: updatingAssignment } = usePatch(
    selectedAssignment
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/tutor-student-assignments/${selectedAssignment.id}/`
      : null,
    {
      onSuccess: () => {
        toast.success("Assignment updated successfully");
        setOpenEditAssignmentModal(false);
        setSelectedAssignment(null);
        refetchTutorStudentAssignments();
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
          toast.error("Failed to update assignment");
        }
      },
    }
  );

  // Handle edit assignment submission
  const handleUpdateAssignment = (e) => {
    e.preventDefault();

    if (!selectedAssignment) return;

    const tutorId = editAssignmentTutor?.id || editAssignmentTutor;
    const studentId = editAssignmentStudent?.id || editAssignmentStudent;
    const courseId = editAssignmentCourse?.id || editAssignmentCourse;

    if (!tutorId || !studentId || !courseId) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateAssignment({
      tutor: tutorId,
      student: studentId,
      course: courseId,
      notes: editAssignmentNotes || "",
    });
  };

  // Handle delete tutor-student assignment
  const handleOpenDeleteTutorStudentDialog = (assignmentId) => {
    setTutorStudentToDelete(assignmentId);
    setOpenDeleteTutorStudentDialog(true);
  };

  const handleCloseDeleteTutorStudentDialog = () => {
    setOpenDeleteTutorStudentDialog(false);
    setTutorStudentToDelete(null);
  };

  const handleConfirmDeleteTutorStudent = async () => {
    if (!tutorStudentToDelete) return;

    try {
      const token = getAuthToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/tutor-student-assignments/${tutorStudentToDelete}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Assignment deleted successfully");
      refetchTutorStudentAssignments();
      handleCloseDeleteTutorStudentDialog();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error(
        error.response?.data?.detail || "Failed to delete assignment"
      );
    }
  };

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
                <Button
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-all duration-300 cursor-pointer"
                  onClick={() => setOpenTutorStudentModal(true)}
                >
                  Assign Tutor to Students
                </Button>
                <Link href="/admin/courses/add-course">
                  <Button className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer">
                    Add Course
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="flex-1 min-w-0">
                  <TextField
                    fullWidth
                    label="Search courses"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    placeholder="Search by course title, description..."
                    size="small"
                    InputProps={{
                      endAdornment: isSearching && (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      ),
                    }}
                  />
                </div>

                {/* Programme Filter */}
                <div className="min-w-[200px]">
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Programme</InputLabel>
                    <Select
                      value={selectedProgramme}
                      onChange={(e) => handleProgrammeFilter(e.target.value)}
                      label="Filter by Programme"
                    >
                      <MenuItem value="">
                        <em>All Programmes</em>
                      </MenuItem>
                      {programmes.map((programme) => (
                        <MenuItem key={programme.id} value={programme.id}>
                          {programme.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Clear Filters Button */}
                {(searchTerm || selectedProgramme) && (
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    size="small"
                    className="whitespace-nowrap"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Active Filters Display */}
              {(searchTerm || selectedProgramme) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedProgramme && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Programme:{" "}
                      {programmes.find((p) => p.id === selectedProgramme)
                        ?.name || selectedProgramme}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Tutor Assignment Modal */}
            <Dialog
              open={openAssignModal}
              onClose={() => {
                setOpenAssignModal(false);
                setSelectedTerm("");
                setSelectedCourse("");
                setSelectedTutors([]);
              }}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Assign Tutors to Course</DialogTitle>
              <DialogContent>
                <form
                  onSubmit={handleAssignMultipleTutors}
                  className="space-y-4 mt-2"
                >
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="term-label">Term</InputLabel>
                    <Select
                      labelId="term-label"
                      value={selectedTerm}
                      onChange={(e) =>
                        handleTermChangeForAssignment(e.target.value)
                      }
                      label="Term"
                      required
                    >
                      {termsLoading ? (
                        <MenuItem disabled>Loading terms...</MenuItem>
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
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="course-label">Course</InputLabel>
                    <Select
                      labelId="course-label"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      label="Course"
                      required
                      disabled={!selectedTerm}
                    >
                      {!selectedTerm ? (
                        <MenuItem disabled>Please select a term first</MenuItem>
                      ) : getFilteredCoursesForTerm().length > 0 ? (
                        getFilteredCoursesForTerm().map((course) => (
                          <MenuItem key={course.id} value={course.id}>
                            {course.title || course.name}
                            {!course.term && (
                              <span className="ml-2 text-xs text-gray-500">
                                (No term)
                              </span>
                            )}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          No courses found for this term
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={tutors || []}
                    getOptionLabel={(option) =>
                      option
                        ? `${option.first_name || ""} ${
                            option.last_name || ""
                          } (${option.email || ""})`.trim()
                        : ""
                    }
                    value={selectedTutors}
                    onChange={(event, newValue) => {
                      setSelectedTutors(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tutors"
                        margin="normal"
                        disabled={tutorsLoading}
                        placeholder="Select one or more tutors"
                        inputProps={{
                          ...params.inputProps,
                          required: false,
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      const tutorId = option.id;
                      const tutorName = `${option.first_name || ""} ${
                        option.last_name || ""
                      } (${option.email || ""})`.trim();

                      return (
                        <li {...props} key={tutorId}>
                          <Checkbox
                            checked={selectedTutors.some(
                              (t) => (t?.id || t) === tutorId
                            )}
                          />
                          <ListItemText primary={tutorName} />
                        </li>
                      );
                    }}
                    isOptionEqualToValue={(option, value) => {
                      if (!value || !option) return false;
                      return option.id === value.id;
                    }}
                    loading={tutorsLoading}
                  />
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenAssignModal(false);
                        setSelectedTerm("");
                        setSelectedCourse("");
                        setSelectedTutors([]);
                      }}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      disabled={assigningTutors || selectedTutors.length === 0}
                    >
                      {assigningTutors
                        ? `Assigning ${selectedTutors.length} tutor(s)...`
                        : `Assign ${selectedTutors.length || ""} Tutor${
                            selectedTutors.length !== 1 ? "s" : ""
                          }`}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            {/* Tutor to Students Assignment Modal */}
            <Dialog
              open={openTutorStudentModal}
              onClose={() => {
                setOpenTutorStudentModal(false);
                setSelectedTutorForStudents(null);
                setSelectedCourseForStudents(null);
                setSelectedStudents([]);
                setCourseStudents([]);
                setAssignmentNotes("");
              }}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Assign Tutor to Students for Course</DialogTitle>
              <DialogContent>
                <form
                  onSubmit={handleAssignTutorToStudents}
                  className="space-y-4 mt-2"
                >
                  <Autocomplete
                    fullWidth
                    options={allCourses || []}
                    getOptionLabel={(option) =>
                      option.title || option.name || ""
                    }
                    value={selectedCourseForStudents}
                    onChange={(event, newValue) => {
                      handleCourseChangeForStudents(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Course"
                        margin="normal"
                        required
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value) return false;
                      return option.id === value.id;
                    }}
                  />

                  <Autocomplete
                    fullWidth
                    options={
                      selectedCourseForStudents
                        ? getTutorsForSelectedCourse(
                            selectedCourseForStudents?.id ||
                              selectedCourseForStudents
                          )
                        : []
                    }
                    getOptionLabel={(option) =>
                      option
                        ? `${option.first_name || ""} ${
                            option.last_name || ""
                          } (${option.email || ""})`.trim()
                        : ""
                    }
                    value={selectedTutorForStudents}
                    onChange={(event, newValue) => {
                      setSelectedTutorForStudents(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tutor"
                        margin="normal"
                        required
                        disabled={
                          tutorsLoading ||
                          !selectedCourseForStudents ||
                          assignmentsLoading
                        }
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value || !option) return false;
                      return option.id === value.id;
                    }}
                    loading={tutorsLoading || assignmentsLoading}
                    disabled={!selectedCourseForStudents}
                  />

                  <Autocomplete
                    fullWidth
                    multiple
                    options={courseStudents || []}
                    getOptionLabel={(option) => {
                      return option?.fullname || option?.id || "";
                    }}
                    value={selectedStudents}
                    onChange={(event, newValue) => {
                      setSelectedStudents(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Students"
                        margin="normal"
                        disabled={
                          isLoadingStudents || !selectedCourseForStudents
                        }
                        helperText={
                          isLoadingStudents
                            ? "Loading students enrolled in this course..."
                            : !selectedCourseForStudents
                            ? "Please select a course first"
                            : courseStudents.length === 0
                            ? "No students enrolled in this course"
                            : ""
                        }
                      />
                    )}
                    renderOption={(props, option) => {
                      const studentId = option.id;
                      const studentName =
                        option.fullname || `Student ${studentId}`;
                      const termName = option.term?.name || "";

                      return (
                        <li {...props} key={studentId}>
                          <Checkbox
                            checked={selectedStudents.some(
                              (s) => (s?.id || s) === studentId
                            )}
                          />
                          <ListItemText
                            primary={studentName}
                            secondary={termName ? `Term: ${termName}` : ""}
                          />
                        </li>
                      );
                    }}
                    isOptionEqualToValue={(option, value) => {
                      if (!value || !option) return false;
                      return option.id === value.id;
                    }}
                    loading={isLoadingStudents}
                    disabled={!selectedCourseForStudents || isLoadingStudents}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    placeholder="Add any notes about this assignment..."
                  />

                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenTutorStudentModal(false);
                        setSelectedTutorForStudents(null);
                        setSelectedCourseForStudents(null);
                        setSelectedStudents([]);
                        setCourseStudents([]);
                        setAssignmentNotes("");
                      }}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      disabled={
                        assigningToStudents || selectedStudents.length === 0
                      }
                    >
                      {assigningToStudents ? "Assigning..." : "Assign"}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            {/* Collapsible Section: Courses */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b"
                onClick={() =>
                  setCollapsedSections((prev) => ({
                    ...prev,
                    courses: !prev.courses,
                  }))
                }
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Courses ({courseCount || 0})
                  </h2>
                  {isRefreshing && allCourses.length > 0 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></span>
                      Refreshing...
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {collapsedSections.courses ? (
                    <FaChevronDown className="text-gray-500" />
                  ) : (
                    <FaChevronUp className="text-gray-500" />
                  )}
                </div>
              </div>
              {!collapsedSections.courses && (
                <div className="p-4">
                  {/* LIST COURSES */}
                  <section className="py-12 ">
                    <div className="flex flex-col md:flex-row items-center justify-center flex-wrap gap-8">
                      {status === "loading" && allCourses.length === 0 ? (
                        <div className="w-full text-center py-8">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-600">
                            Loading courses...
                          </p>
                        </div>
                      ) : allCourses.length === 0 ? (
                        <div className="w-full text-center py-8 text-gray-500">
                          No courses found
                        </div>
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
                                  onClick={() =>
                                    handleOpenDeleteModal(course?.id)
                                  }
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
                </div>
              )}
            </div>

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

            {/* Collapsible Section: Tutor to Course Assignments */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b"
                onClick={() =>
                  setCollapsedSections((prev) => ({
                    ...prev,
                    tutorCourseAssignments: !prev.tutorCourseAssignments,
                  }))
                }
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Tutor to Course Assignments ({assignments.length})
                </h2>
                <div className="flex items-center gap-2">
                  {collapsedSections.tutorCourseAssignments ? (
                    <FaChevronDown className="text-gray-500" />
                  ) : (
                    <FaChevronUp className="text-gray-500" />
                  )}
                </div>
              </div>
              {!collapsedSections.tutorCourseAssignments && (
                <div className="p-4">
                  {/* Filters for Tutor-Course Assignments */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <FormControl fullWidth size="small">
                        <InputLabel>Course</InputLabel>
                        <Select
                          value={tutorCourseFilters.course}
                          onChange={(e) =>
                            setTutorCourseFilters({
                              ...tutorCourseFilters,
                              course: e.target.value,
                            })
                          }
                          label="Course"
                        >
                          <MenuItem value="">
                            <em>All Courses</em>
                          </MenuItem>
                          {allCourses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                              {course.title || course.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel>Term</InputLabel>
                        <Select
                          value={tutorCourseFilters.term}
                          onChange={(e) =>
                            setTutorCourseFilters({
                              ...tutorCourseFilters,
                              term: e.target.value,
                            })
                          }
                          label="Term"
                        >
                          <MenuItem value="">
                            <em>All Terms</em>
                          </MenuItem>
                          {terms.map((term) => (
                            <MenuItem key={term.id} value={term.id}>
                              {term.name} ({term.session?.year || "N/A"})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel>Tutor</InputLabel>
                        <Select
                          value={tutorCourseFilters.tutor}
                          onChange={(e) =>
                            setTutorCourseFilters({
                              ...tutorCourseFilters,
                              tutor: e.target.value,
                            })
                          }
                          label="Tutor"
                        >
                          <MenuItem value="">
                            <em>All Tutors</em>
                          </MenuItem>
                          {tutors.map((tutor) => (
                            <MenuItem key={tutor.id} value={tutor.id}>
                              {tutor.first_name} {tutor.last_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={tutorCourseFilters.is_active}
                          onChange={(e) =>
                            setTutorCourseFilters({
                              ...tutorCourseFilters,
                              is_active: e.target.value,
                            })
                          }
                          label="Status"
                        >
                          <MenuItem value="">
                            <em>All</em>
                          </MenuItem>
                          <MenuItem value="true">Active</MenuItem>
                          <MenuItem value="false">Inactive</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        size="small"
                        label="Search"
                        value={tutorCourseFilters.search}
                        onChange={(e) =>
                          setTutorCourseFilters({
                            ...tutorCourseFilters,
                            search: e.target.value,
                          })
                        }
                        placeholder="Search assignments..."
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          setTutorCourseFilters({
                            course: "",
                            term: "",
                            tutor: "",
                            is_active: "",
                            search: "",
                          })
                        }
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="font-semibold">Tutor</TableCell>
                          <TableCell className="font-semibold">
                            Course
                          </TableCell>
                          <TableCell className="font-semibold">Term</TableCell>
                          <TableCell className="font-semibold">
                            Assigned At
                          </TableCell>
                          <TableCell className="font-semibold">
                            Status
                          </TableCell>
                          <TableCell className="font-semibold">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignmentsLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              Loading tutor assignments...
                            </TableCell>
                          </TableRow>
                        ) : assignments.length > 0 ? (
                          assignments.map((assignment) => {
                            const course = allCourses.find(
                              (c) =>
                                c.id === assignment.course ||
                                c.id === assignment.course?.id
                            );
                            const term = terms.find(
                              (t) =>
                                t.id === assignment.term ||
                                t.id === assignment.term?.id
                            );

                            return (
                              <TableRow key={assignment.id}>
                                <TableCell>
                                  {assignment.tutor_full_name ||
                                    `${assignment.first_name || ""} ${
                                      assignment.last_name || ""
                                    }`.trim() ||
                                    "N/A"}
                                </TableCell>
                                <TableCell>
                                  {course
                                    ? course.title || course.name
                                    : assignment.course || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {term
                                    ? `${term.name} (${
                                        term.session?.year || "N/A"
                                      })`
                                    : assignment.term || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {assignment.assigned_at
                                    ? format(
                                        new Date(assignment.assigned_at),
                                        "MMMM d, yyyy h:mm a"
                                      )
                                    : "-"}
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded text-sm ${
                                      assignment.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {assignment.is_active
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <IconButton
                                      color="primary"
                                      onClick={() =>
                                        handleOpenEditCourseTutorModal(
                                          assignment.id
                                        )
                                      }
                                      size="small"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleOpenDeassignDialog(assignment.id)
                                      }
                                      size="small"
                                      title="Deassign"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No tutor-to-course assignments found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </div>

            {/* Collapsible Section: Tutor-Student Assignments */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b"
                onClick={() =>
                  setCollapsedSections((prev) => ({
                    ...prev,
                    tutorStudentAssignments: !prev.tutorStudentAssignments,
                  }))
                }
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  Tutor-Student Assignments ({tutorStudentAssignments.length})
                </h2>
                <div className="flex items-center gap-2">
                  {collapsedSections.tutorStudentAssignments ? (
                    <FaChevronDown className="text-gray-500" />
                  ) : (
                    <FaChevronUp className="text-gray-500" />
                  )}
                </div>
              </div>
              {!collapsedSections.tutorStudentAssignments && (
                <div className="p-4">
                  {/* Filters for Tutor-Student Assignments */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <FormControl fullWidth size="small">
                        <InputLabel>Course</InputLabel>
                        <Select
                          value={tutorStudentFilters.course}
                          onChange={(e) =>
                            setTutorStudentFilters({
                              ...tutorStudentFilters,
                              course: e.target.value,
                            })
                          }
                          label="Course"
                        >
                          <MenuItem value="">
                            <em>All Courses</em>
                          </MenuItem>
                          {allCourses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                              {course.title || course.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel>Tutor</InputLabel>
                        <Select
                          value={tutorStudentFilters.tutor}
                          onChange={(e) =>
                            setTutorStudentFilters({
                              ...tutorStudentFilters,
                              tutor: e.target.value,
                            })
                          }
                          label="Tutor"
                        >
                          <MenuItem value="">
                            <em>All Tutors</em>
                          </MenuItem>
                          {tutors.map((tutor) => (
                            <MenuItem key={tutor.id} value={tutor.id}>
                              {tutor.first_name} {tutor.last_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel>Student</InputLabel>
                        <Select
                          value={tutorStudentFilters.student}
                          onChange={(e) =>
                            setTutorStudentFilters({
                              ...tutorStudentFilters,
                              student: e.target.value,
                            })
                          }
                          label="Student"
                        >
                          <MenuItem value="">
                            <em>All Students</em>
                          </MenuItem>
                          {allStudents.map((student) => (
                            <MenuItem key={student.id} value={student.id}>
                              {student.first_name} {student.last_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={tutorStudentFilters.is_active}
                          onChange={(e) =>
                            setTutorStudentFilters({
                              ...tutorStudentFilters,
                              is_active: e.target.value,
                            })
                          }
                          label="Status"
                        >
                          <MenuItem value="">
                            <em>All</em>
                          </MenuItem>
                          <MenuItem value="true">Active</MenuItem>
                          <MenuItem value="false">Inactive</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        size="small"
                        label="Search"
                        value={tutorStudentFilters.search}
                        onChange={(e) =>
                          setTutorStudentFilters({
                            ...tutorStudentFilters,
                            search: e.target.value,
                          })
                        }
                        placeholder="Search assignments..."
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          setTutorStudentFilters({
                            course: "",
                            tutor: "",
                            student: "",
                            is_active: "",
                            search: "",
                          })
                        }
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="font-semibold">Tutor</TableCell>
                          <TableCell className="font-semibold">
                            Student
                          </TableCell>
                          <TableCell className="font-semibold">
                            Course
                          </TableCell>
                          <TableCell className="font-semibold">Notes</TableCell>
                          <TableCell className="font-semibold">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tutorStudentAssignmentsLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : tutorStudentAssignments.length > 0 ? (
                          tutorStudentAssignments.map((assignment) => {
                            const tutor = tutors.find(
                              (t) =>
                                t.id === assignment.tutor ||
                                t.id === assignment.tutor?.id
                            );
                            const student = allStudents.find(
                              (s) =>
                                s.id === assignment.student ||
                                s.id === assignment.student?.id
                            );
                            const course = allCourses.find(
                              (c) =>
                                c.id === assignment.course ||
                                c.id === assignment.course?.id
                            );

                            return (
                              <TableRow key={assignment.id}>
                                <TableCell>
                                  {tutor
                                    ? `${tutor.first_name} ${tutor.last_name} (${tutor.email})`
                                    : assignment.tutor || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {student
                                    ? `${student.first_name} ${student.last_name} (${student.email})`
                                    : assignment.student || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {course
                                    ? course.title || course.name
                                    : assignment.course || "N/A"}
                                </TableCell>
                                <TableCell>{assignment.notes || "-"}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <IconButton
                                      color="primary"
                                      onClick={() =>
                                        handleOpenEditModal(assignment.id)
                                      }
                                      size="small"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleOpenDeleteTutorStudentDialog(
                                          assignment.id
                                        )
                                      }
                                      size="small"
                                      title="Delete"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No tutor-student assignments found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </div>

            {/* Edit Assignment Modal */}
            <Dialog
              open={openEditAssignmentModal}
              onClose={() => {
                setOpenEditAssignmentModal(false);
                setSelectedAssignment(null);
                setEditAssignmentNotes("");
                setEditAssignmentTutor(null);
                setEditAssignmentStudent(null);
                setEditAssignmentCourse(null);
              }}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Edit Tutor-Student Assignment</DialogTitle>
              <DialogContent>
                <form
                  onSubmit={handleUpdateAssignment}
                  className="space-y-4 mt-2"
                >
                  <Autocomplete
                    fullWidth
                    options={allCourses || []}
                    getOptionLabel={(option) =>
                      option.title || option.name || ""
                    }
                    value={editAssignmentCourse}
                    onChange={(event, newValue) => {
                      setEditAssignmentCourse(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Course"
                        margin="normal"
                        required
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value) return false;
                      return option.id === value.id;
                    }}
                  />

                  <Autocomplete
                    fullWidth
                    options={tutors || []}
                    getOptionLabel={(option) =>
                      option
                        ? `${option.first_name || ""} ${
                            option.last_name || ""
                          } (${option.email || ""})`.trim()
                        : ""
                    }
                    value={editAssignmentTutor}
                    onChange={(event, newValue) => {
                      setEditAssignmentTutor(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tutor"
                        margin="normal"
                        required
                        disabled={tutorsLoading}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value || !option) return false;
                      return option.id === value.id;
                    }}
                    loading={tutorsLoading}
                  />

                  <Autocomplete
                    fullWidth
                    options={allStudents || []}
                    getOptionLabel={(option) =>
                      option
                        ? `${option.first_name || ""} ${
                            option.last_name || ""
                          } (${option.email || ""})`.trim()
                        : ""
                    }
                    value={editAssignmentStudent}
                    onChange={(event, newValue) => {
                      setEditAssignmentStudent(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Student"
                        margin="normal"
                        required
                        disabled={allStudentsLoading}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value || !option) return false;
                      return option.id === value.id;
                    }}
                    loading={allStudentsLoading}
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Notes (Optional)"
                    multiline
                    rows={3}
                    value={editAssignmentNotes}
                    onChange={(e) => setEditAssignmentNotes(e.target.value)}
                    placeholder="Add any notes about this assignment..."
                  />

                  <DialogActions>
                    <MuiButton
                      onClick={() => {
                        setOpenEditAssignmentModal(false);
                        setSelectedAssignment(null);
                        setEditAssignmentNotes("");
                        setEditAssignmentTutor(null);
                        setEditAssignmentStudent(null);
                        setEditAssignmentCourse(null);
                      }}
                      color="primary"
                    >
                      Cancel
                    </MuiButton>
                    <MuiButton
                      type="submit"
                      color="primary"
                      variant="contained"
                      disabled={updatingAssignment}
                    >
                      {updatingAssignment ? "Updating..." : "Update"}
                    </MuiButton>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Course-Tutor Assignment Modal */}
            <Dialog
              open={openEditCourseTutorModal}
              onClose={() => {
                setOpenEditCourseTutorModal(false);
                setSelectedCourseTutorAssignment(null);
                setEditCourseTutorTutor(null);
                setEditCourseTutorCourse(null);
                setEditCourseTutorTerm(null);
                setEditCourseTutorIsActive(true);
              }}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Edit Tutor to Course Assignment</DialogTitle>
              <DialogContent>
                <form
                  onSubmit={handleUpdateCourseTutorAssignment}
                  className="space-y-4 mt-2"
                >
                  <Autocomplete
                    fullWidth
                    options={tutors || []}
                    getOptionLabel={(option) =>
                      option
                        ? `${option.first_name || ""} ${
                            option.last_name || ""
                          } (${option.email || ""})`.trim()
                        : ""
                    }
                    value={editCourseTutorTutor}
                    onChange={(event, newValue) => {
                      setEditCourseTutorTutor(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tutor"
                        margin="normal"
                        required
                        disabled={tutorsLoading}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value || !option) return false;
                      return option.id === value.id;
                    }}
                    loading={tutorsLoading}
                  />

                  <Autocomplete
                    fullWidth
                    options={allCourses || []}
                    getOptionLabel={(option) =>
                      option.title || option.name || ""
                    }
                    value={editCourseTutorCourse}
                    onChange={(event, newValue) => {
                      setEditCourseTutorCourse(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Course"
                        margin="normal"
                        required
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value) return false;
                      return option.id === value.id;
                    }}
                  />

                  <Autocomplete
                    fullWidth
                    options={terms || []}
                    getOptionLabel={(option) =>
                      option
                        ? `${option.name} (${option.session?.year || "N/A"})`
                        : ""
                    }
                    value={editCourseTutorTerm}
                    onChange={(event, newValue) => {
                      setEditCourseTutorTerm(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Term (Optional)"
                        margin="normal"
                        disabled={termsLoading}
                      />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (!value || !option) return false;
                      return option.id === value.id;
                    }}
                    loading={termsLoading}
                  />

                  <div className="flex items-center mt-4">
                    <Checkbox
                      checked={editCourseTutorIsActive}
                      onChange={(e) =>
                        setEditCourseTutorIsActive(e.target.checked)
                      }
                      color="primary"
                    />
                    <span className="ml-2">Active</span>
                  </div>

                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenEditCourseTutorModal(false);
                        setSelectedCourseTutorAssignment(null);
                        setEditCourseTutorTutor(null);
                        setEditCourseTutorCourse(null);
                        setEditCourseTutorTerm(null);
                        setEditCourseTutorIsActive(true);
                      }}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      disabled={updatingCourseTutorAssignment}
                    >
                      {updatingCourseTutorAssignment ? "Updating..." : "Update"}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Course-Tutor Assignment Dialog */}
            <Dialog
              open={openDeleteCourseTutorDialog}
              onClose={handleCloseDeleteCourseTutorDialog}
              aria-labelledby="delete-course-tutor-dialog-title"
              aria-describedby="delete-course-tutor-dialog-description"
            >
              <DialogTitle id="delete-course-tutor-dialog-title">
                Delete Tutor Assignment
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-course-tutor-dialog-description">
                  Are you sure you want to permanently delete this tutor
                  assignment? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <MuiButton
                  onClick={handleCloseDeleteCourseTutorDialog}
                  color="primary"
                >
                  Cancel
                </MuiButton>
                <MuiButton
                  onClick={handleConfirmDeleteCourseTutor}
                  color="error"
                  variant="contained"
                >
                  Delete
                </MuiButton>
              </DialogActions>
            </Dialog>

            {/* Deassign Tutor Dialog */}
            <Dialog
              open={openDeassignDialog}
              onClose={handleCloseDeassignDialog}
              aria-labelledby="deassign-dialog-title"
              aria-describedby="deassign-dialog-description"
            >
              <DialogTitle id="deassign-dialog-title">
                Deassign Tutor from Course
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="deassign-dialog-description">
                  Are you sure you want to deassign this tutor from the course?
                  This will remove the assignment but may preserve historical
                  data.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <MuiButton onClick={handleCloseDeassignDialog} color="primary">
                  Cancel
                </MuiButton>
                <button
                  onClick={handleConfirmDeassign}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
                >
                  Deassign
                </button>
              </DialogActions>
            </Dialog>

            {/* Delete Tutor-Student Assignment Dialog */}
            <Dialog
              open={openDeleteTutorStudentDialog}
              onClose={handleCloseDeleteTutorStudentDialog}
              aria-labelledby="delete-tutor-student-dialog-title"
              aria-describedby="delete-tutor-student-dialog-description"
            >
              <DialogTitle id="delete-tutor-student-dialog-title">
                Delete Tutor-Student Assignment
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-tutor-student-dialog-description">
                  Are you sure you want to permanently delete this tutor-student
                  assignment? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <MuiButton
                  onClick={handleCloseDeleteTutorStudentDialog}
                  color="primary"
                >
                  Cancel
                </MuiButton>
                <button
                  onClick={handleConfirmDeleteTutorStudent}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
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
