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
import { Detail } from "@/components/Detail";

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
        `https://api.ihsaanacademia.com/assessment/base/?${params.toString()}`,
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

  return (
    <Box>
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={handleSearch}
              placeholder="Search by title, description, course, or tutor"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assessment Type
            </label>
            <select
              value={filters.type}
              onChange={handleFilterChange("type")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="GROUP">Group</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Type
            </label>
            <select
              value={filters.questionType}
              onChange={handleFilterChange("questionType")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="MCQ">MCQ</option>
              <option value="MANUAL">Manual</option>
              <option value="FILE_UPLOAD">File Upload</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={handleFilterChange("isActive")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Date Filters */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Date Filters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created After
              </label>
              <input
                type="date"
                value={filters.createdAfter}
                onChange={handleFilterChange("createdAfter")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created Before
              </label>
              <input
                type="date"
                value={filters.createdBefore}
                onChange={handleFilterChange("createdBefore")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starts After
              </label>
              <input
                type="date"
                value={filters.startsAfter}
                onChange={handleFilterChange("startsAfter")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starts Before
              </label>
              <input
                type="date"
                value={filters.startsBefore}
                onChange={handleFilterChange("startsBefore")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ends After
              </label>
              <input
                type="date"
                value={filters.endsAfter}
                onChange={handleFilterChange("endsAfter")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ends Before
              </label>
              <input
                type="date"
                value={filters.endsBefore}
                onChange={handleFilterChange("endsBefore")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course ID
            </label>
            <input
              type="text"
              value={filters.course}
              onChange={handleFilterChange("course")}
              placeholder="Course ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term ID
            </label>
            <input
              type="text"
              value={filters.term}
              onChange={handleFilterChange("term")}
              placeholder="Term ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tutor ID
            </label>
            <input
              type="text"
              value={filters.tutor}
              onChange={handleFilterChange("tutor")}
              placeholder="Tutor ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-white border border-red-400 text-red-600 font-medium py-2 px-4 rounded-md hover:bg-red-50 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="40px"
        >
          <CircularProgress />
        </Box>
      )}

      {error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <Typography color="error">{error}</Typography>
        </Box>
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
      )}

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
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-indigo-700">
                {selectedAssessment.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <Detail
                  label="Course"
                  value={selectedAssessment.course_title}
                />
                <Detail
                  label="Course Code"
                  value={selectedAssessment.course_code}
                />
                <Detail label="Type" value={selectedAssessment.type} />
                <Detail
                  label="Question Type"
                  value={selectedAssessment.question_type}
                />
                {selectedAssessment.mcq_duration && (
                  <Detail
                    label="Duration"
                    value={selectedAssessment.mcq_duration}
                  />
                )}
                <Detail label="Tutor" value={selectedAssessment.tutor_name} />
                <Detail
                  label="Start Date"
                  value={formatDate(selectedAssessment.start_date)}
                />
                <Detail
                  label="End Date"
                  value={formatDate(selectedAssessment.end_date)}
                />
                <Detail
                  label="Max Score"
                  value={selectedAssessment.max_score}
                />
                <Detail
                  label="Status"
                  value={
                    selectedAssessment.is_active ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )
                  }
                />
                <Detail
                  label="Term"
                  value={
                    selectedAssessment.term_title ||
                    selectedAssessment.term ||
                    "-"
                  }
                />
                <Detail
                  label="Description"
                  value={selectedAssessment.description || "-"}
                  full
                />
                <Detail
                  label="Created At"
                  value={formatDate(selectedAssessment.created_at)}
                />
                <Detail
                  label="Updated At"
                  value={formatDate(selectedAssessment.updated_at)}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AssessmentsReport;
