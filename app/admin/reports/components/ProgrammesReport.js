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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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

const ProgrammesReport = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProgrammes, setTotalProgrammes] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    classGroup: "",
    specialType: "",
    level: "",
  });
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProgrammes = async () => {
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
      if (filters.type) params.append("type", filters.type);
      if (filters.classGroup) params.append("class_group", filters.classGroup);
      if (filters.specialType)
        params.append("special_type", filters.specialType);
      if (filters.level) params.append("level", filters.level);

      const response = await axios.get(
        `https://ihsaanlms.onrender.com/programmes/?${params.toString()}`,
        { headers }
      );
      setProgrammes(response.data.results);
      setTotalProgrammes(response.data.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch programmes");
      console.error("Error fetching programmes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, [filters, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchProgrammes();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchProgrammes();
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
    setPage(0);
    fetchProgrammes();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      classGroup: "",
      specialType: "",
      level: "",
    });
    setPage(0);
    fetchProgrammes();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleRowClick = (programme) => {
    setSelectedProgramme(programme);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProgramme(null);
  };

  return (
    <Box>
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={handleFilterChange("search")}
              placeholder="Search by name or code"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={handleFilterChange("type")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="0">Regular</option>
              <option value="1">Special</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full border border-red-400 text-red-600 font-medium py-2 px-4 rounded-md hover:bg-red-50 transition"
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
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Class Group</TableCell>
                <TableCell>Special Type</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Duration (Months)</TableCell>
                <TableCell>Courses</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programmes.map((programme) => (
                <TableRow
                  key={programme.id}
                  hover
                  style={{ cursor: "pointer", transition: "background 0.2s" }}
                  onClick={() => handleRowClick(programme)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f0f4ff",
                    },
                  }}
                >
                  <TableCell>{programme.code}</TableCell>
                  <TableCell>{programme.name}</TableCell>
                  <TableCell>{programme.type_name}</TableCell>
                  <TableCell>{programme.class_group_name}</TableCell>
                  <TableCell>{programme.special_type_name}</TableCell>
                  <TableCell>{programme.level_name}</TableCell>
                  <TableCell>{programme.duration_months}</TableCell>
                  <TableCell>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                          {programme.courses.length} Courses
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {programme.courses.map((course) => (
                          <Box key={course.id} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {course.description}
                            </Typography>
                            <Typography variant="body2">
                              Assessment Count: {course.assessment_count}
                            </Typography>
                            <Typography variant="body2">
                              Enrolled Users: {course.enrolled_users.length}
                            </Typography>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                  <TableCell>{formatDate(programme.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalProgrammes}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* Programme Details Modal */}
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
          <span>Programme Details</span>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          {selectedProgramme && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {/* Programme Title */}
              <h2 className="text-2xl font-bold text-indigo-700">
                {selectedProgramme.name}
              </h2>

              {/* Programme Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <Detail label="Code" value={selectedProgramme.code} />
                <Detail label="Type" value={selectedProgramme.type_name} />
                <Detail
                  label="Class Group"
                  value={selectedProgramme.class_group_name}
                />
                <Detail
                  label="Special Type"
                  value={selectedProgramme.special_type_name}
                />
                <Detail label="Level" value={selectedProgramme.level_name} />
                <Detail
                  label="Duration (Months)"
                  value={selectedProgramme.duration_months}
                />
                <Detail
                  label="Created At"
                  value={formatDate(selectedProgramme.created_at)}
                />
              </div>

              {/* Courses Section */}
              <div className="border-t pt-4 space-y-3">
                <h3 className="text-xl font-semibold text-indigo-700">
                  Courses
                </h3>
                {selectedProgramme.courses?.length > 0 ? (
                  selectedProgramme.courses.map((course) => (
                    <div
                      key={course.id}
                      className="border-l-4 border-indigo-500 bg-slate-100 rounded-md p-4"
                    >
                      <h4 className="text-lg font-semibold text-gray-800">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {course.description || "No description provided."}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Assessment Count:</span>{" "}
                        {course.assessment_count}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Enrolled Users:</span>{" "}
                        {course.enrolled_users.length}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No courses available.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProgrammesReport;
