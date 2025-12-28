"use client";

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

  // LOGIC FIX: Wrapped in useCallback to prevent unnecessary re-renders
  const fetchProgrammes = useCallback(async () => {
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
      if (filters.classGroup) params.append("class_group", filters.classGroup);
      if (filters.specialType) params.append("special_type", filters.specialType);
      if (filters.level) params.append("level", filters.level);

      const response = await axios.get(
        `https://api.ihsaanacademia.com/programmes/?${params.toString()}`,
        { headers }
      );
      
      // ERROR FIX: Optional chaining and fallbacks
      setProgrammes(response.data?.results || []);
      setTotalProgrammes(response.data?.total || 0);
      setError(null);
    } catch (err) {
      setError("Failed to fetch programmes");
      console.error("Error fetching programmes:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchProgrammes();
  }, [fetchProgrammes]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: event.target.value,
    }));
    setPage(0);
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
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
      <div className="bg-white p-6 rounded-xl shadow space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={handleFilterChange("search")}
              placeholder="Search by name or code"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
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
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {error ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          {/* MOBILE RESPONSIVENESS: Container with scroll and min-width */}
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Class Group</TableCell>
                  <TableCell>Special Type</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programmes.map((programme) => (
                  <TableRow
                    key={programme.id}
                    hover
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(programme)}
                  >
                    <TableCell sx={{ fontWeight: 'bold' }}>{programme.code}</TableCell>
                    <TableCell>{programme.name}</TableCell>
                    <TableCell>{programme.type_name}</TableCell>
                    <TableCell>{programme.class_group_name}</TableCell>
                    <TableCell>{programme.special_type_name}</TableCell>
                    <TableCell>{programme.level_name}</TableCell>
                    <TableCell>{programme.duration_months} Months</TableCell>
                    <TableCell sx={{ minWidth: '220px' }}>
                      <Accordion onClick={(e) => e.stopPropagation()}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2">
                            {/* ERROR FIX: Optional Chaining */}
                            {programme.courses?.length || 0} Courses
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ maxHeight: 200, overflowY: 'auto' }}>
                          {(programme.courses || []).map((course) => (
                            <Box key={course.id} sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {course.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Assessments: {course.assessment_count || 0} | Users: {course.enrolled_users?.length || 0}
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
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalProgrammes}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Details Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Programme Details</span>
          <IconButton onClick={handleCloseModal}><CloseIcon /></IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedProgramme && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-indigo-700">{selectedProgramme.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Detail label="Code" value={selectedProgramme.code} />
                <Detail label="Type" value={selectedProgramme.type_name} />
                <Detail label="Class Group" value={selectedProgramme.class_group_name} />
                <Detail label="Level" value={selectedProgramme.level_name} />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-4">Courses</h3>
                {/* ERROR FIX: Optional Chaining for Modal */}
                {selectedProgramme.courses?.length > 0 ? (
                  selectedProgramme.courses.map((course) => (
                    <div key={course.id} className="border-l-4 border-indigo-500 bg-slate-50 p-4 mb-3 rounded">
                      <h4 className="font-bold">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.description || "No description."}</p>
                      <div className="flex gap-4 mt-2 text-xs font-medium">
                        <span>Assessments: {course.assessment_count || 0}</span>
                        <span>Enrolled: {course.enrolled_users?.length || 0}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No courses available.</p>
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