"use client";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Collapse,
} from "@mui/material";
import { AccessTime, FilterList, Clear } from "@mui/icons-material";
import Lottie from "lottie-react";
import React, { useState } from "react";
import animation from "../../../../assets/no_data.json";

const tableHeaders = [
  { id: "request_method", label: "Request Method" },
  { id: "request_user_first_name", label: "Request By" },
  { id: "status_code", label: "Status Code" },
  { id: "message", label: "Error Message" },
  { id: "level", label: "Severity Level" },
  { id: "timestamp", label: "Timestamp" },
];

const ErrorLogs = ({
  errorData,
  isLoading,
  isFetching,
  totalErrors,
  currentPage,
  onPageChange,
  onFiltersChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    level: "",
    logger_name: "",
    message: "",
    request_method: "",
    request_path: "",
    search: "",
    server_name: "",
    status_code: "",
    status_code__gte: "",
    status_code__lte: "",
    timestamp__date: "",
    timestamp__gte: "",
    timestamp__lte: "",
  });

  const ErrorsData = errorData?.data?.results || [];

  const levelOptions = [
    { value: "CRITICAL", label: "Critical" },
    { value: "ERROR", label: "Error" },
    { value: "WARNING", label: "Warning" },
    { value: "INFO", label: "Info" },
    { value: "DEBUG", label: "Debug" },
  ];

  const methodOptions = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
  ];

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    onFiltersChange(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      level: "",
      logger_name: "",
      message: "",
      request_method: "",
      request_path: "",
      search: "",
      server_name: "",
      status_code: "",
      status_code__gte: "",
      status_code__lte: "",
      timestamp__date: "",
      timestamp__gte: "",
      timestamp__lte: "",
    });
    onFiltersChange({});
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-red-900">System Error Logs</h2>
        <Button color="primary" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Section */}
      <Collapse in={showFilters}>
        <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select
                  value={filters.level}
                  onChange={(e) => handleFilterChange("level", e.target.value)}
                  label="Level"
                >
                  <MenuItem value="">All levels</MenuItem>
                  {levelOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Request Method</InputLabel>
                <Select
                  value={filters.request_method}
                  onChange={(e) =>
                    handleFilterChange("request_method", e.target.value)
                  }
                  label="Request Method"
                >
                  <MenuItem value="">All methods</MenuItem>
                  {methodOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Status Code"
                type="number"
                placeholder="e.g., 500"
                value={filters.status_code}
                onChange={(e) =>
                  handleFilterChange("status_code", e.target.value)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Logger Name"
                placeholder="Logger name..."
                value={filters.logger_name}
                onChange={(e) =>
                  handleFilterChange("logger_name", e.target.value)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Message Contains"
                placeholder="Error message..."
                value={filters.message}
                onChange={(e) => handleFilterChange("message", e.target.value)}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Request Path"
                placeholder="/api/endpoint"
                value={filters.request_path}
                onChange={(e) =>
                  handleFilterChange("request_path", e.target.value)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Server Name"
                placeholder="Server name..."
                value={filters.server_name}
                onChange={(e) =>
                  handleFilterChange("server_name", e.target.value)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Status Code"
                type="number"
                placeholder="e.g., 400"
                value={filters.status_code__gte}
                onChange={(e) =>
                  handleFilterChange("status_code__gte", e.target.value)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Status Code"
                type="number"
                placeholder="e.g., 599"
                value={filters.status_code__lte}
                onChange={(e) =>
                  handleFilterChange("status_code__lte", e.target.value)
                }
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={filters.timestamp__date}
                onChange={(e) =>
                  handleFilterChange("timestamp__date", e.target.value)
                }
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="From DateTime"
                type="datetime-local"
                value={filters.timestamp__gte}
                onChange={(e) =>
                  handleFilterChange("timestamp__gte", e.target.value)
                }
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="To DateTime"
                type="datetime-local"
                value={filters.timestamp__lte}
                onChange={(e) =>
                  handleFilterChange("timestamp__lte", e.target.value)
                }
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button size="large" color="secondary" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button size="large" onClick={clearFilters}>
              Clear All
            </Button>
          </Box>
        </Box>
      </Collapse>

      {isFetching || isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size={20} />
          <p className="animate-pulse">Fetching error logs...</p>
        </div>
      ) : ErrorsData.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="bg-gradient-to-r from-red-50 to-blue-50">
                  {tableHeaders.map((header) => (
                    <TableCell
                      key={header.id}
                      className="font-semibold text-nowrap text-red-900"
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ErrorsData.map((log, index) => (
                  <TableRow
                    key={log.id}
                    className={`hover:bg-red-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <TableCell className="font-medium">
                      {log.request_method}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.request_user_first_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.status_code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.message || log.short_message}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
                          log.level
                        )}`}
                      >
                        {log.level}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AccessTime className="w-4 h-4 text-gray-500" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(totalErrors / 10)}
              page={currentPage}
              onChange={onPageChange}
              color="primary"
            />
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Lottie
            animationData={animation}
            loop={false}
            autoPlay
            className="w-48 h-48 mx-auto"
          />
          <p className="mt-4 text-gray-600">
            There are no error logs available at the moment, check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorLogs;
