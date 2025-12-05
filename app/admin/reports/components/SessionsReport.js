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
import { useRouter } from "next/navigation";

const SessionsReport = () => {
  const router = useRouter();
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

  const handleSessionClick = () => {
    router.push("/admin/activities-settings");
  };

  return (
    <Box>
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
          {/* Search by Year */}
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={handleFilterChange("search")}
              placeholder="Search by year"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Year Field */}
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              value={filters.year}
              onChange={handleFilterChange("year")}
              placeholder="e.g., 2025/2026"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Clear Filters Button */}
          <div className="md:col-span-2 flex items-end">
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
                  <TableRow key={session.id} onClick={handleSessionClick}>
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
      )}
    </Box>
  );
};

export default SessionsReport;
