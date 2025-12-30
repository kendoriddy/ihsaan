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

  // Local state for immediate UI feedback while typing
  const [searchTerm, setSearchTerm] = useState("");
  const [yearTerm, setYearTerm] = useState("");

  // Filter state that actually triggers the API call
  const [filters, setFilters] = useState({
    search: "",
    year: "",
  });

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };

      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("page_size", rowsPerPage);

      if (filters.search) params.append("search", filters.search);
      if (filters.year) params.append("year", filters.year);

      const response = await axios.get(
        `https://api.ihsaanacademia.com/academic-sessions/?${params.toString()}`,
        { headers }
      );
      setSessions(response.data.results || []);
      setTotalSessions(response.data.total || 0);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sessions");
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, rowsPerPage]);

  // Debounce Logic: Updates the 'filters' state 500ms after typing stops
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({
        search: searchTerm,
        year: yearTerm,
      });
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, yearTerm]);

  // Main Fetch Effect
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setYearTerm("");
    setFilters({
      search: "",
      year: "",
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
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sessions..."
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Year"
            variant="outlined"
            value={yearTerm}
            onChange={(e) => setYearTerm(e.target.value)}
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
                <TableCell>ID</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Duration (Days)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.length > 0 ? (
                sessions.map((session) => {
                  const startDate = new Date(session.start_date);
                  const endDate = new Date(session.end_date);
                  const durationDays = isNaN(startDate) || isNaN(endDate) 
                    ? "N/A" 
                    : Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

                  return (
                    <TableRow key={session.id}>
                      <TableCell>{session.id}</TableCell>
                      <TableCell>{session.year}</TableCell>
                      <TableCell>{formatDate(session.start_date)}</TableCell>
                      <TableCell>{formatDate(session.end_date)}</TableCell>
                      <TableCell>{durationDays}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
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
      )}
    </Box>
  );
};

export default SessionsReport;