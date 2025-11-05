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
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import axios from "axios";
import { getAuthToken } from "@/hooks/axios/axios";

const SessionsReport = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSessions, setTotalSessions] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    year: "",
  });

  const fetchSessions = async () => {
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
      if (filters.year) params.append("year", filters.year);

      const response = await axios.get(
        `https://api.ihsaanacademia.com/academic-sessions/?${params.toString()}`,
        { headers }
      );
      setSessions(response.data.results);
      setTotalSessions(response.data.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sessions");
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filters, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchSessions();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchSessions();
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
    setPage(0);
    fetchSessions();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      year: "",
    });
    setPage(0);
    fetchSessions();
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
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={filters.search}
            onChange={handleFilterChange("search")}
            placeholder="Search by year"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Year"
            variant="outlined"
            value={filters.year}
            onChange={handleFilterChange("year")}
            placeholder="e.g., 2025/2026"
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Duration (Days)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => {
              const startDate = new Date(session.start_date);
              const endDate = new Date(session.end_date);
              const durationDays = Math.ceil(
                (endDate - startDate) / (1000 * 60 * 60 * 24)
              );

              return (
                <TableRow key={session.id}>
                  <TableCell>{session.id}</TableCell>
                  <TableCell>{session.year}</TableCell>
                  <TableCell>{formatDate(session.start_date)}</TableCell>
                  <TableCell>{formatDate(session.end_date)}</TableCell>
                  <TableCell>{durationDays}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalSessions}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default SessionsReport;
