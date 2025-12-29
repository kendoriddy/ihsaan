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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";

const AssessmentsReport = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAssessments, setTotalAssessments] = useState(0);
  
  // Internal search state to allow smooth typing
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    questionType: "",
    course: "",
    term: "",
    tutor: "",
    isActive: "",
    createdAfter: "",
    createdBefore: "",
    startsAfter: "",
    startsBefore: "",
    endsAfter: "",
    endsBefore: "",
  });

  const fetchAssessments = useCallback(async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };

      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("page_size", rowsPerPage);

      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.questionType) params.append("question_type", filters.questionType);
      if (filters.course) params.append("course", filters.course);
      if (filters.term) params.append("term", filters.term);
      if (filters.tutor) params.append("tutor", filters.tutor);
      
      // Ensure boolean strings are passed correctly
      if (filters.isActive !== "") params.append("is_active", filters.isActive);

      if (filters.createdAfter) params.append("created_after", filters.createdAfter);
      if (filters.createdBefore) params.append("created_before", filters.createdBefore);
      if (filters.startsAfter) params.append("starts_after", filters.startsAfter);
      if (filters.startsBefore) params.append("starts_before", filters.startsBefore);
      if (filters.endsAfter) params.append("ends_after", filters.endsAfter);
      if (filters.endsBefore) params.append("ends_before", filters.endsBefore);

      const response = await axios.get(
        `https://api.ihsaanacademia.com/assessment/base/?${params.toString()}`,
        { headers }
      );
      
      setAssessments(response.data.results || []);
      setTotalAssessments(response.data.total || 0);
      setError(null);
    } catch (err) {
      setError("Failed to fetch assessments");
      console.error("Error fetching assessments:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  // Handle Search Debounce: Only update filters.search 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Main Effect: Fetch data when filters (except search typing), page or rows change
  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      search: "",
      type: "",
      questionType: "",
      course: "",
      term: "",
      tutor: "",
      isActive: "",
      createdAfter: "",
      createdBefore: "",
      startsAfter: "",
      startsBefore: "",
      endsAfter: "",
      endsBefore: "",
    });
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search title, course, or tutor..."
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Assessment Type</InputLabel>
            <Select
              value={filters.type}
              label="Assessment Type"
              onChange={handleFilterChange("type")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="INDIVIDUAL">Individual</MenuItem>
              <MenuItem value="GROUP">Group</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={filters.questionType}
              label="Question Type"
              onChange={handleFilterChange("questionType")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="MCQ">MCQ</MenuItem>
              <MenuItem value="MANUAL">Manual</MenuItem>
              <MenuItem value="FILE_UPLOAD">File Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.isActive}
              label="Status"
              onChange={handleFilterChange("isActive")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date Range Filters */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Created After"
            type="date"
            value={filters.createdAfter}
            onChange={handleFilterChange("createdAfter")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Created Before"
            type="date"
            value={filters.createdBefore}
            onChange={handleFilterChange("createdBefore")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Course ID"
            variant="outlined"
            value={filters.course}
            onChange={handleFilterChange("course")}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Tutor ID"
            variant="outlined"
            value={filters.tutor}
            onChange={handleFilterChange("tutor")}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={clearFilters}
            sx={{ height: "56px" }}
          >
            Clear All Filters
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Question Type</TableCell>
                <TableCell>Tutor</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Max Score</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.length > 0 ? (
                assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>{assessment.title}</TableCell>
                    <TableCell>{assessment.course_title}</TableCell>
                    <TableCell>{assessment.type}</TableCell>
                    <TableCell>{assessment.question_type}</TableCell>
                    <TableCell>{assessment.tutor_name}</TableCell>
                    <TableCell>{formatDate(assessment.start_date)}</TableCell>
                    <TableCell>{formatDate(assessment.end_date)}</TableCell>
                    <TableCell>{assessment.max_score}</TableCell>
                    <TableCell>
                      <Chip
                        label={assessment.is_active ? "Active" : "Inactive"}
                        color={assessment.is_active ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">No assessments found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalAssessments}
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

export default AssessmentsReport;