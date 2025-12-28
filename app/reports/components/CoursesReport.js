import React, { useState, useEffect, useCallback } from "react";
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

  // Local state for immediate UI response
  const [searchTerm, setSearchTerm] = useState("");
  const [programmeTerm, setProgrammeTerm] = useState("");

  // Filter state for API calls
  const [filters, setFilters] = useState({
    search: "",
    programme: "",
  });

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };

      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("page_size", rowsPerPage);

      if (filters.search) params.append("search", filters.search);
      if (filters.programme) params.append("programme", filters.programme);

      const response = await axios.get(
        `https://api.ihsaanacademia.com/course/courses/?${params.toString()}`,
        { headers }
      );
      setCourses(response.data.results || []);
      setTotalCourses(response.data.count || 0);
      setError(null);
    } catch (err) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  // Debounce logic for Search and Programme ID
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        search: searchTerm,
        programme: programmeTerm,
      });
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, programmeTerm]);

  // Unified fetch effect
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setProgrammeTerm("");
    setFilters({
      search: "",
      programme: "",
    });
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Title, name, or code"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Programme ID"
            variant="outlined"
            value={programmeTerm}
            onChange={(e) => setProgrammeTerm(e.target.value)}
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

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Programme</TableCell>
                <TableCell>Enrolled</TableCell>
                <TableCell>Assessments</TableCell>
                <TableCell>Sections</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell sx={{ fontWeight: "medium" }}>{course.title}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.programme_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${course.enrolled_users?.length || 0} Students`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.assessment_count || 0}
                        color="secondary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Accordion sx={{ boxShadow: "none", border: "1px solid #eee" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2">{course.sections?.length || 0} Sections</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {course.sections?.map((section) => (
                            <Box key={section.id} sx={{ mb: 1, borderBottom: "1px solid #f5f5f5", pb: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: "bold", display: "block" }}>
                                {section.title}
                              </Typography>
                              <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                <Chip label={`${section.videos?.length || 0}V`} size="tiny" sx={{ fontSize: "0.65rem" }} />
                                <Chip label={`${section.materials?.length || 0}M`} size="tiny" sx={{ fontSize: "0.65rem" }} />
                              </Box>
                            </Box>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                    <TableCell>{formatDate(course.created_at)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No courses found matching your search.
                  </TableCell>
                </TableRow>
              )}
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
      )}
    </Box>
  );
};

export default CoursesReport;