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
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";

const ProgrammesReport = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProgrammes, setTotalProgrammes] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    classGroup: "",
    specialType: "",
    level: "",
  });

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
      setProgrammes(response.data.results || []);
      setTotalProgrammes(response.data.total || 0);
      setError(null);
    } catch (err) {
      setError("Failed to fetch programmes");
      console.error("Error fetching programmes:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
    setSearchTerm("");
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

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name or code..."
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type}
              label="Type"
              onChange={handleFilterChange("type")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="0">Regular</MenuItem>
              <MenuItem value="1">Special</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Class Group</InputLabel>
            <Select
              value={filters.classGroup}
              label="Class Group"
              onChange={handleFilterChange("classGroup")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="0">Group A</MenuItem>
              <MenuItem value="1">Group B</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={clearFilters}
            sx={{ height: "56px" }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          {/* Removed minWidth: 1000 to follow AssessmentResultsReport layout */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Class Group</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Courses</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programmes.length > 0 ? (
                programmes.map((programme) => (
                  <TableRow key={programme.id} hover>
                    <TableCell sx={{ fontWeight: "bold" }}>{programme.code}</TableCell>
                    <TableCell>{programme.name}</TableCell>
                    <TableCell>{programme.type_name}</TableCell>
                    <TableCell>{programme.class_group_name}</TableCell>
                    <TableCell>{programme.level_name}</TableCell>
                    <TableCell>{programme.duration_months} Months</TableCell>
                    <TableCell sx={{ minWidth: '200px' }}>
                      <Accordion sx={{ boxShadow: "none", border: "1px solid #eee" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2">
                            {programme.courses?.length || 0} Courses
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ maxHeight: "200px", overflowY: "auto", p: 1 }}>
                          {(programme.courses || []).map((course, idx) => (
                            <Box key={course.id || idx} sx={{ mb: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: "bold", display: "block" }}>
                                {course.title || "Untitled Course"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Assessments: {course.assessment_count || 0} | Users: {course.enrolled_users?.length || 0}
                              </Typography>
                              {idx < (programme.courses?.length || 0) - 1 && <Divider sx={{ my: 0.5 }} />}
                            </Box>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                    <TableCell>{formatDate(programme.created_at)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No programmes found matching the filters.
                  </TableCell>
                </TableRow>
              )}
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
    </Box>
  );
};

export default ProgrammesReport;