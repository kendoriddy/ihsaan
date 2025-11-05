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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
        `https://api.ihsaanacademia.com/course/courses/?${params.toString()}`,
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
              <TableRow key={course.id}>
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
    </Box>
  );
};

export default CoursesReport;
