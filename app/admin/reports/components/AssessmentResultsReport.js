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

const AssessmentResultsReport = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    assessment: "",
    assessmentType: "",
    course: "",
    group: "",
    isPublished: "",
    questionType: "",
    student: "",
    term: "",
    tutor: "",
    createdAfter: "",
    createdBefore: "",
  });

  const fetchResults = async () => {
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
      if (filters.assessment) params.append("assessment", filters.assessment);
      if (filters.assessmentType)
        params.append("assessment_type", filters.assessmentType);
      if (filters.course) params.append("course", filters.course);
      if (filters.group) params.append("group", filters.group);
      if (filters.isPublished !== "")
        params.append("is_published", filters.isPublished);
      if (filters.questionType)
        params.append("question_type", filters.questionType);
      if (filters.student) params.append("student", filters.student);
      if (filters.term) params.append("term", filters.term);
      if (filters.tutor) params.append("tutor", filters.tutor);
      if (filters.createdAfter)
        params.append("created_after", filters.createdAfter);
      if (filters.createdBefore)
        params.append("created_before", filters.createdBefore);

      const response = await axios.get(
        `https://ihsaanlms.onrender.com/assessment/grades/?${params.toString()}`,
        { headers }
      );
      setResults(response.data.results);
      setTotalResults(response.data.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch assessment results");
      console.error("Error fetching assessment results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [filters, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchResults();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchResults();
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
    setPage(0);
    fetchResults();
  };

  const clearFilters = () => {
    setFilters({
      assessment: "",
      assessmentType: "",
      course: "",
      group: "",
      isPublished: "",
      questionType: "",
      student: "",
      term: "",
      tutor: "",
      createdAfter: "",
      createdBefore: "",
    });
    setPage(0);
    fetchResults();
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
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Assessment ID"
            variant="outlined"
            value={filters.assessment}
            onChange={handleFilterChange("assessment")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Assessment Type</InputLabel>
            <Select
              value={filters.assessmentType}
              label="Assessment Type"
              onChange={handleFilterChange("assessmentType")}
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
            <InputLabel>Published Status</InputLabel>
            <Select
              value={filters.isPublished}
              label="Published Status"
              onChange={handleFilterChange("isPublished")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Published</MenuItem>
              <MenuItem value="false">Not Published</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date Range Filters */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Date Filters
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Created After"
            type="date"
            value={filters.createdAfter}
            onChange={handleFilterChange("createdAfter")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Created Before"
            type="date"
            value={filters.createdBefore}
            onChange={handleFilterChange("createdBefore")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Additional Filters */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Course ID"
            variant="outlined"
            value={filters.course}
            onChange={handleFilterChange("course")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Term ID"
            variant="outlined"
            value={filters.term}
            onChange={handleFilterChange("term")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Student ID"
            variant="outlined"
            value={filters.student}
            onChange={handleFilterChange("student")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Tutor ID"
            variant="outlined"
            value={filters.tutor}
            onChange={handleFilterChange("tutor")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Group ID"
            variant="outlined"
            value={filters.group}
            onChange={handleFilterChange("group")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
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
              <TableCell>Student Name</TableCell>
              <TableCell>Assessment Title</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Graded By</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.student_name}</TableCell>
                <TableCell>{result.assessment_title}</TableCell>
                <TableCell>{result.course_title}</TableCell>
                <TableCell>{`${result.score}/${result.assessment_max_score}`}</TableCell>
                <TableCell>{`${result.percentage_score}%`}</TableCell>
                <TableCell>
                  <Chip
                    label={result.is_passing ? "Passing" : "Failing"}
                    color={result.is_passing ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{result.graded_by_name}</TableCell>
                <TableCell>{result.feedback}</TableCell>
                <TableCell>{formatDate(result.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalResults}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default AssessmentResultsReport;
