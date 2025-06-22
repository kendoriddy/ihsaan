import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";
import { Detail } from "@/components/Detail";

const CoursesReport = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCourses, setTotalCourses] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    programme: "",
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };

      // Build query parameters
      const params = new URLSearchParams();

      // Add pagination parameters
      params.append("page", page + 1); // backend expects 1-based page
      params.append("page_size", rowsPerPage);

      // Add filter parameters
      if (filters.search) params.append("search", filters.search);
      if (filters.programme) params.append("programme", filters.programme);

      const response = await axios.get(
        `https://ihsaanlms.onrender.com/course/courses/?${params.toString()}`,
        { headers }
      );
      console.log("here:", response.data);
      setCourses(response.data.results);
      setTotalCourses(response.data.total);
      if (rowsPerPage !== response.data.page_size) {
        setRowsPerPage(response.data.page_size);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      programme: "",
    });
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleRowClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
          {/* Search by title, name, or code */}
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={handleFilterChange("search")}
              placeholder="Search by title, name, or code"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Programme ID
            </label>
            <input
              type="text"
              value={filters.programme}
              onChange={handleFilterChange("programme")}
              placeholder="Enter programme ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Clear Filters Button */}
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={clearFilters}
              className="w-full border border-red-400 text-red-600 font-medium py-2 px-4 rounded-md hover:bg-red-50 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Programme</TableCell>
              <TableCell>Enrolled Students</TableCell>
              <TableCell>Assessments</TableCell>
              <TableCell>Sections</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
                hover
                style={{ cursor: "pointer", transition: "background 0.2s" }}
                onClick={() => handleRowClick(course)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f0f4ff",
                  },
                }}
              >
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.programme_name}</TableCell>
                <TableCell>
                  <Chip
                    label={`${course.enrolled_users.length} Students`}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.assessment_count}
                    color="secondary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{course.sections.length} Sections</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {course.sections.map((section) => (
                        <Box key={section.id} sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">
                            {section.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {section.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={`${section.videos.length} Videos`}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={`${section.materials.length} Materials`}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            {section.has_mcq_assessment && (
                              <Chip
                                label="MCQ Assessment"
                                color="success"
                                size="small"
                              />
                            )}
                          </Box>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell>{formatDate(course.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCourses}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Course Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 0,
          }}
        >
          <span>Course Details</span>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          {selectedCourse && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
              {/* Course Header */}
              <h2 className="text-2xl font-bold text-indigo-700">
                {selectedCourse.title}
              </h2>

              {/* Course Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <Detail label="Code" value={selectedCourse.code} />
                <Detail
                  label="Programme"
                  value={selectedCourse.programme_name}
                />
                <Detail
                  label="Description"
                  value={selectedCourse.description}
                />
                <Detail
                  label="Created At"
                  value={formatDate(selectedCourse.created_at)}
                />
                <Detail
                  label="Updated At"
                  value={formatDate(selectedCourse.updated_at)}
                />
                <Detail
                  label="Enrolled Users"
                  value={selectedCourse.enrolled_users.length}
                />
              </div>

              {/* Sections */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 border-t pt-4">
                  Sections
                </h3>
                {selectedCourse.sections?.length > 0 ? (
                  selectedCourse.sections.map((section) => (
                    <SectionCard
                      key={section.id}
                      title={section.title}
                      description={section.description}
                      border="border-indigo-500"
                    >
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Order:</strong> {section.order}
                        </p>
                        <p>
                          <strong>Active:</strong>{" "}
                          {section.is_active ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Max Attempts:</strong> {section.max_attempts}
                        </p>
                        <p>
                          <strong>Has MCQ Assessment:</strong>{" "}
                          {section.has_mcq_assessment ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {formatDate(section.created_at)}
                        </p>
                        <p>
                          <strong>Updated At:</strong>{" "}
                          {formatDate(section.updated_at)}
                        </p>

                        <div className="mt-2">
                          <p className="font-semibold text-sm">Videos</p>
                          {section.videos?.length > 0 ? (
                            section.videos.map((video) => (
                              <div key={video.id} className="pl-2 text-sm">
                                <p>
                                  <strong>Title:</strong> {video.title}
                                </p>
                                <p>
                                  <strong>Duration:</strong> {video.duration}
                                </p>
                                <p>
                                  <strong>Order:</strong> {video.order}
                                </p>
                                <p>
                                  <a
                                    href={video.video_resource.media_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    View Video
                                  </a>
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No videos available.</p>
                          )}

                          <p className="font-semibold text-sm mt-2">
                            Materials
                          </p>
                          {section.materials?.length > 0 ? (
                            section.materials.map((material) => (
                              <div key={material.id} className="pl-2 text-sm">
                                <p>
                                  <strong>Title:</strong> {material.title}
                                </p>
                                <p>
                                  <a
                                    href={material.material_resource.media_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    View Material
                                  </a>
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No materials available.</p>
                          )}
                        </div>
                      </div>
                    </SectionCard>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    No sections available.
                  </p>
                )}
              </div>

              {/* Tutors */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-indigo-700 border-t pt-4">
                  Tutors
                </h3>
                {selectedCourse.tutors?.length > 0 ? (
                  selectedCourse.tutors.map((tutor) => (
                    <SectionCard
                      key={tutor.id}
                      title={tutor.tutor_full_name}
                      description={`Assigned At: ${formatDate(
                        tutor.assigned_at
                      )}`}
                      border="border-green-500 bg-green-50"
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No tutors available.</p>
                )}
              </div>

              {/* Groups */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-indigo-700 border-t pt-4">
                  Groups
                </h3>
                {selectedCourse.groups?.length > 0 ? (
                  selectedCourse.groups.map((group) => (
                    <SectionCard
                      key={group.id}
                      title={group.name}
                      description={`Created At: ${formatDate(
                        group.created_at
                      )}`}
                      border="border-rose-500 bg-rose-50"
                    >
                      <p className="text-sm">
                        <strong>Students:</strong> {group.students.length}
                      </p>
                    </SectionCard>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No groups available.</p>
                )}
              </div>

              {/* Enrolled Users */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-indigo-700 border-t pt-4">
                  Enrolled Users
                </h3>
                <p className="text-sm text-gray-700">
                  {selectedCourse.enrolled_users?.length > 0
                    ? selectedCourse.enrolled_users.join(", ")
                    : "No enrolled users."}
                </p>
              </div>

              {/* Assessments */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-700 border-t pt-4">
                  Assessments
                </h3>
                {selectedCourse.assessments?.length > 0 ? (
                  selectedCourse.assessments.map((assessment) => (
                    <SectionCard
                      key={assessment.id}
                      title={assessment.title}
                      description={assessment.description}
                      border="border-yellow-500 bg-yellow-50"
                    >
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Type:</strong> {assessment.type}
                        </p>
                        <p>
                          <strong>Question Type:</strong>{" "}
                          {assessment.question_type}
                        </p>
                        <p>
                          <strong>Max Score:</strong> {assessment.max_score}
                        </p>
                        <p>
                          <strong>Passing Score:</strong>{" "}
                          {assessment.passing_score}
                        </p>
                        <p>
                          <strong>Start Date:</strong>{" "}
                          {formatDate(assessment.start_date)}
                        </p>
                        <p>
                          <strong>End Date:</strong>{" "}
                          {formatDate(assessment.end_date)}
                        </p>
                        <p>
                          <strong>Tutor:</strong> {assessment.tutor_name}
                        </p>
                        <p>
                          <strong>Created At:</strong>{" "}
                          {formatDate(assessment.created_at)}
                        </p>
                        <p>
                          <strong>Updated At:</strong>{" "}
                          {formatDate(assessment.updated_at)}
                        </p>
                      </div>
                    </SectionCard>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    No assessments available.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const SectionCard = ({ title, description, children, border }) => (
  <div className={`border-l-4 rounded-md p-4 ${border} bg-gray-50 space-y-1`}>
    <h4 className="text-lg font-semibold text-gray-800">
      {typeof title === "string" && title.length > 0
        ? title.charAt(0).toUpperCase() + title.slice(1)
        : title}
    </h4>
    <p className="text-sm text-gray-600">{description}</p>
    {children}
  </div>
);

export default CoursesReport;
