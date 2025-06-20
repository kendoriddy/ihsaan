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
      params.append("page", page + 1);
      params.append("page_size", rowsPerPage);

      // Add filter parameters
      if (filters.search) params.append("search", filters.search);
      if (filters.programme) params.append("programme", filters.programme);

      const response = await axios.get(
        `https://ihsaanlms.onrender.com/course/courses/?${params.toString()}`,
        { headers }
      );
      setCourses(response.data.results);
      setTotalCourses(response.data.count);
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
    fetchCourses();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchCourses();
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
    setPage(0);
    fetchCourses();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      programme: "",
    });
    setPage(0);
    fetchCourses();
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
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={filters.search}
            onChange={handleFilterChange("search")}
            placeholder="Search by title, name, or code"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Programme ID"
            variant="outlined"
            value={filters.programme}
            onChange={handleFilterChange("programme")}
            placeholder="Enter programme ID"
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={clearFilters}
            sx={{ height: "56px" }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>

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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                {selectedCourse.title}
              </Typography>
              <Typography variant="body1">
                <strong>Code:</strong> {selectedCourse.code}
              </Typography>
              <Typography variant="body1">
                <strong>Programme:</strong> {selectedCourse.programme_name}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedCourse.description}
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong>{" "}
                {formatDate(selectedCourse.created_at)}
              </Typography>
              <Typography variant="body1">
                <strong>Updated At:</strong>{" "}
                {formatDate(selectedCourse.updated_at)}
              </Typography>
              <Typography variant="body1">
                <strong>Enrolled Users:</strong>{" "}
                {selectedCourse.enrolled_users.length}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                Sections
              </Typography>
              {selectedCourse.sections && selectedCourse.sections.length > 0 ? (
                selectedCourse.sections.map((section) => (
                  <Box
                    key={section.id}
                    sx={{
                      mb: 2,
                      pl: 2,
                      borderLeft: "3px solid #6366f1",
                      background: "#f1f5f9",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {section.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Order:</strong> {section.order}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Active:</strong>{" "}
                      {section.is_active ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Max Attempts:</strong> {section.max_attempts}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Has MCQ Assessment:</strong>{" "}
                      {section.has_mcq_assessment ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong>{" "}
                      {formatDate(section.created_at)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Updated At:</strong>{" "}
                      {formatDate(section.updated_at)}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2">Videos</Typography>
                    {section.videos && section.videos.length > 0 ? (
                      section.videos.map((video) => (
                        <Box key={video.id} sx={{ mb: 1, pl: 1 }}>
                          <Typography variant="body2">
                            <strong>Title:</strong> {video.title}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {video.duration}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Order:</strong> {video.order}
                          </Typography>
                          <Typography variant="body2">
                            <a
                              href={video.video_resource.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#2563eb" }}
                            >
                              View Video
                            </a>
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">
                        No videos available.
                      </Typography>
                    )}
                    <Typography variant="subtitle2">Materials</Typography>
                    {section.materials && section.materials.length > 0 ? (
                      section.materials.map((material) => (
                        <Box key={material.id} sx={{ mb: 1, pl: 1 }}>
                          <Typography variant="body2">
                            <strong>Title:</strong> {material.title}
                          </Typography>
                          <Typography variant="body2">
                            <a
                              href={material.material_resource.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#2563eb" }}
                            >
                              View Material
                            </a>
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">
                        No materials available.
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No sections available.</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                Assessments
              </Typography>
              {selectedCourse.assessments &&
              selectedCourse.assessments.length > 0 ? (
                selectedCourse.assessments.map((assessment) => (
                  <Box
                    key={assessment.id}
                    sx={{
                      mb: 2,
                      pl: 2,
                      borderLeft: "3px solid #f59e42",
                      background: "#fef9c3",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {assessment.title}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description:</strong> {assessment.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {assessment.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Question Type:</strong> {assessment.question_type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Max Score:</strong> {assessment.max_score}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Passing Score:</strong> {assessment.passing_score}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Start Date:</strong>{" "}
                      {formatDate(assessment.start_date)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>End Date:</strong>{" "}
                      {formatDate(assessment.end_date)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tutor:</strong> {assessment.tutor_name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong>{" "}
                      {formatDate(assessment.created_at)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Updated At:</strong>{" "}
                      {formatDate(assessment.updated_at)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">
                  No assessments available.
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                Tutors
              </Typography>
              {selectedCourse.tutors && selectedCourse.tutors.length > 0 ? (
                selectedCourse.tutors.map((tutor) => (
                  <Box
                    key={tutor.id}
                    sx={{
                      mb: 2,
                      pl: 2,
                      borderLeft: "3px solid #10b981",
                      background: "#ecfdf5",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Name:</strong> {tutor.tutor_full_name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Assigned At:</strong>{" "}
                      {formatDate(tutor.assigned_at)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No tutors available.</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                Groups
              </Typography>
              {selectedCourse.groups && selectedCourse.groups.length > 0 ? (
                selectedCourse.groups.map((group) => (
                  <Box
                    key={group.id}
                    sx={{
                      mb: 2,
                      pl: 2,
                      borderLeft: "3px solid #f43f5e",
                      background: "#fef2f2",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Name:</strong> {group.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong>{" "}
                      {formatDate(group.created_at)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Students:</strong> {group.students.length}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No groups available.</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                Enrolled Users
              </Typography>
              <Typography variant="body2">
                {selectedCourse.enrolled_users &&
                selectedCourse.enrolled_users.length > 0
                  ? selectedCourse.enrolled_users.join(", ")
                  : "No enrolled users."}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CoursesReport;
