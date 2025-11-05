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
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    classGroup: "",
    specialType: "",
    level: "",
  });

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
        `https://api.ihsaanacademia.com/programmes/?${params.toString()}`,
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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={filters.search}
            onChange={handleFilterChange("search")}
            placeholder="Search by name or code"
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
            Clear Filters
          </Button>
        </Grid>
      </Grid>

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
              <TableRow key={programme.id}>
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
    </Box>
  );
};

export default ProgrammesReport;
