import Loader from "@/components/Loader";
import { AccessTime, Person, FilterList, Clear } from "@mui/icons-material";
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
import Lottie from "lottie-react";
import React, { useState } from "react";
import animation from "../../../../assets/no_data.json";
import Button from "@/components/Button";

const ActivitiesLogs = ({
  activityData,
  isLoading,
  isFetching,
  totalActivities,
  currentPage,
  onPageChange,
  onFiltersChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    action: "",
    username: "",
    days: "",
  });

  const ActivitiesData = activityData?.data?.audit_trails || [];

  const daysOptions = [
    { value: "1", label: "Last 1 day" },
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "365", label: "Last year" },
  ];

  // Common actions - you might want to get these dynamically from your API
  const actionOptions = [
    { value: "LOGIN", label: "Login" },
    { value: "LOGOUT", label: "Logout" },
    { value: "CREATE", label: "Create" },
    { value: "UPDATE", label: "Update" },
    { value: "DELETE", label: "Delete" },
    { value: "VIEW", label: "View" },
    { value: "DOWNLOAD", label: "Download" },
    { value: "UPLOAD", label: "Upload" },
  ];

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
      action: "",
      username: "",
      days: "",
    });
    onFiltersChange({});
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-600">
          User Activity Logs
        </h2>
        <Button color="secondary" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Section */}
      <Collapse in={showFilters}>
        <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Action</InputLabel>
                <Select
                  value={filters.action}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  label="Action"
                >
                  <MenuItem value="">All actions</MenuItem>
                  {actionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Username"
                placeholder="Enter username..."
                value={filters.username}
                onChange={(e) => handleFilterChange("username", e.target.value)}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={filters.days}
                  onChange={(e) => handleFilterChange("days", e.target.value)}
                  label="Time Period"
                >
                  <MenuItem value="">All time</MenuItem>
                  {daysOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button color="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button
              color="secondary"
              onClick={clearFilters}
              icon={<Clear className="w-4 h-4" />}
            >
              Clear All
            </Button>
          </Box>
        </Box>
      </Collapse>

      {isFetching || isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size={20} />
          <p className="animate-pulse">Fetching activity logs...</p>
        </div>
      ) : ActivitiesData.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-red-50">
                    <TableCell className="font-bold text-blue-600">
                      User
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Action Performed
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Message
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Timestamp
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ActivitiesData?.map((log, index) => (
                    <TableRow
                      key={log.id}
                      className={`hover:bg-blue-50 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Person className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{log.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.action}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.description}
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
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(totalActivities / 10)}
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
            There are no activities to log at the moment, check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesLogs;
