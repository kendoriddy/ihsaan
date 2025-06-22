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
  const [selectedResult, setSelectedResult] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleRowClick = (result) => {
    setSelectedResult(result);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedResult(null);
  };

  return (
    <Box>
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* Primary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assessment ID
            </label>
            <input
              type="text"
              value={filters.assessment}
              onChange={handleFilterChange("assessment")}
              placeholder="Enter assessment ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assessment Type
            </label>
            <select
              value={filters.assessmentType}
              onChange={handleFilterChange("assessmentType")}
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
              Published Status
            </label>
            <select
              value={filters.isPublished}
              onChange={handleFilterChange("isPublished")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Not Published</option>
            </select>
          </div>
        </div>

        {/* Date Range Filters */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-2">
            Date Filters
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              placeholder="Enter course ID"
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
              placeholder="Enter term ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              value={filters.student}
              onChange={handleFilterChange("student")}
              placeholder="Enter student ID"
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
              placeholder="Enter tutor ID"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group ID
            </label>
            <input
              type="text"
              value={filters.group}
              onChange={handleFilterChange("group")}
              placeholder="Enter group ID"
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
          minHeight="400px"
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
                <TableRow
                  key={result.id}
                  hover
                  style={{ cursor: "pointer", transition: "background 0.2s" }}
                  onClick={() => handleRowClick(result)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f0f4ff",
                    },
                  }}
                >
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
      )}

      {/* Result Details Modal */}
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
          <span>Result Details</span>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          {selectedResult && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {/* Title */}
              <h2 className="text-2xl font-bold text-indigo-700">
                {selectedResult.assessment_title}
              </h2>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <Detail label="Student" value={selectedResult.student_name} />
                <Detail label="Course" value={selectedResult.course_title} />
                <Detail
                  label="Score"
                  value={`${selectedResult.score} / ${selectedResult.assessment_max_score}`}
                />
                <Detail
                  label="Percentage"
                  value={`${selectedResult.percentage_score}%`}
                />
                <Detail
                  label="Status"
                  value={
                    selectedResult.is_passing ? (
                      <span className="text-green-600 font-semibold">
                        Passing
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Failing
                      </span>
                    )
                  }
                />
                <Detail
                  label="Graded By"
                  value={selectedResult.graded_by_name}
                />
                <Detail
                  label="Assessment Type"
                  value={selectedResult.assessment_type}
                />
                <Detail
                  label="Question Type"
                  value={selectedResult.assessment_question_type}
                />
                <Detail
                  label="Created At"
                  value={formatDate(selectedResult.created_at)}
                />
                <Detail
                  label="Updated At"
                  value={formatDate(selectedResult.updated_at)}
                />
                <Detail
                  label="Feedback"
                  value={selectedResult.feedback || "-"}
                  full
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AssessmentResultsReport;
