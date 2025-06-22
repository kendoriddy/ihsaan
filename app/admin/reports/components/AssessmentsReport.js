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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";

const AssessmentsReport = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAssessments, setTotalAssessments] = useState(0);
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
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };

      // Build query parameters
      const params = new URLSearchParams();

      // Add pagination parameters
      params.append("page", page + 1); // API uses 1-based indexing
      params.append("page_size", rowsPerPage);

      // Add filter parameters
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.questionType)
        params.append("question_type", filters.questionType);
      if (filters.course) params.append("course", filters.course);
      if (filters.term) params.append("term", filters.term);
      if (filters.tutor) params.append("tutor", filters.tutor);
      if (filters.isActive !== "") params.append("is_active", filters.isActive);

      // Date filters
      if (filters.createdAfter)
        params.append("created_after", filters.createdAfter);
      if (filters.createdBefore)
        params.append("created_before", filters.createdBefore);
      if (filters.startsAfter)
        params.append("starts_after", filters.startsAfter);
      if (filters.startsBefore)
        params.append("starts_before", filters.startsBefore);
      if (filters.endsAfter) params.append("ends_after", filters.endsAfter);
      if (filters.endsBefore) params.append("ends_before", filters.endsBefore);

      const response = await axios.get(
        `https://ihsaanlms.onrender.com/assessment/base/?${params.toString()}`,
        { headers }
      );
      setAssessments(response.data.results);
      setTotalAssessments(response.data.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch assessments");
      console.error("Error fetching assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [filters, page, rowsPerPage]); // Refetch when filters, page, or rowsPerPage change

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchAssessments();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
    fetchAssessments();
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
    setPage(0); // Reset to first page when filters change
    fetchAssessments();
  };

  const handleSearch = (event) => {
    setFilters({
      ...filters,
      search: event.target.value,
    });
    setPage(0); // Reset to first page when search changes
  };

  const clearFilters = () => {
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
    setPage(0); // Reset to first page when clearing filters
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleRowClick = (assessment) => {
    setSelectedAssessment(assessment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAssessment(null);
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
            label="Search"
            variant="outlined"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search by title, description, course, or tutor"
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
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Starts After"
            type="date"
            value={filters.startsAfter}
            onChange={handleFilterChange("startsAfter")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Starts Before"
            type="date"
            value={filters.startsBefore}
            onChange={handleFilterChange("startsBefore")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Ends After"
            type="date"
            value={filters.endsAfter}
            onChange={handleFilterChange("endsAfter")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Ends Before"
            type="date"
            value={filters.endsBefore}
            onChange={handleFilterChange("endsBefore")}
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
            label="Tutor ID"
            variant="outlined"
            value={filters.tutor}
            onChange={handleFilterChange("tutor")}
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
            {assessments.map((assessment) => (
              <TableRow
                key={assessment.id}
                hover
                style={{ cursor: "pointer", transition: "background 0.2s" }}
                onClick={() => handleRowClick(assessment)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f0f4ff",
                  },
                }}
              >
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
            ))}
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

      {/* Assessment Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
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
          <span>Assessment Details</span>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          {selectedAssessment && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                {selectedAssessment.title}
              </Typography>
              <Typography variant="body1">
                <strong>Course:</strong> {selectedAssessment.course_title}
              </Typography>
              <Typography variant="body1">
                <strong>Type:</strong> {selectedAssessment.type}
              </Typography>
              <Typography variant="body1">
                <strong>Question Type:</strong>{" "}
                {selectedAssessment.question_type}
              </Typography>
              <Typography variant="body1">
                <strong>Tutor:</strong> {selectedAssessment.tutor_name}
              </Typography>
              <Typography variant="body1">
                <strong>Start Date:</strong>{" "}
                {formatDate(selectedAssessment.start_date)}
              </Typography>
              <Typography variant="body1">
                <strong>End Date:</strong>{" "}
                {formatDate(selectedAssessment.end_date)}
              </Typography>
              <Typography variant="body1">
                <strong>Max Score:</strong> {selectedAssessment.max_score}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{" "}
                {selectedAssessment.is_active ? "Active" : "Inactive"}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong>{" "}
                {selectedAssessment.description || "-"}
              </Typography>
              <Typography variant="body1">
                <strong>Term:</strong>{" "}
                {selectedAssessment.term_title ||
                  selectedAssessment.term ||
                  "-"}
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong>{" "}
                {formatDate(selectedAssessment.created_at)}
              </Typography>
              <Typography variant="body1">
                <strong>Updated At:</strong>{" "}
                {formatDate(selectedAssessment.updated_at)}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AssessmentsReport;
