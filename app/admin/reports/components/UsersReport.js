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

const UsersReport = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("student");
  const [filters, setFilters] = useState({
    country: "",
    gender: "",
    status: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = async (search = "") => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };
      let endpoint =
        userType === "student"
          ? "https://api.ihsaanacademia.com/api/all-student"
          : "https://api.ihsaanacademia.com/api/all-tutor";

      // Add search param if present
      if (search) {
        endpoint += `?search=${encodeURIComponent(search)}`;
      }

      const response = await axios.get(endpoint, { headers });

      setUsers(response.data.results);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm, userType]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (filterName) => (event) => {
    setFilters({
      ...filters,
      [filterName]: event.target.value,
    });
    setPage(0);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.country || user.country === filters.country) &&
      (!filters.gender || user.gender === filters.gender) &&
      (!filters.status ||
        (userType === "student"
          ? user.student_application_status === filters.status
          : user.tutor_application_status === filters.status));

    return matchesSearch && matchesFilters;
  });

  const handleRowClick = (user) => {
    console.log("User clicked:", user);
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box>
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by name or email..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* User Type */}
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Type
            </label>
            <select
              value={userType}
              onChange={handleUserTypeChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Students</option>
              <option value="tutor">Tutors</option>
            </select>
          </div>

          {/* Country */}
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={filters.country}
              onChange={handleFilterChange("country")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              {Array.from(new Set(users.map((user) => user.country))).map(
                (country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Gender */}
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={handleFilterChange("gender")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* Status */}
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={handleFilterChange("status")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Qualification</TableCell>
                <TableCell>Experience</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    style={{ cursor: "pointer", transition: "background 0.2s" }}
                    onClick={() => handleRowClick(user)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f0f4ff",
                      },
                    }}
                  >
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.country}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>
                      {userType === "student"
                        ? user.student_application_status
                        : user.tutor_application_status}
                    </TableCell>
                    <TableCell>{user.highest_qualification}</TableCell>
                    <TableCell>{user.years_of_experience}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* User Details Modal */}
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
          <span>User Details</span>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mb: 2 }} />
        <DialogContent>
          {selectedUser && (
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-indigo-700">
                {selectedUser.first_name} {selectedUser.last_name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                <Detail label="Email" value={selectedUser.email} />
                <Detail label="Country" value={selectedUser.country} />
                <Detail label="Gender" value={selectedUser.gender} />
                <Detail
                  label="Date of Birth"
                  value={selectedUser.date_of_birth}
                />
                <Detail
                  label="Marital Status"
                  value={selectedUser.marital_status}
                />
                <Detail
                  label="Status"
                  value={
                    userType === "student"
                      ? selectedUser.student_application_status
                      : selectedUser.tutor_application_status
                  }
                />
                <Detail
                  label="Qualification"
                  value={selectedUser.highest_qualification}
                />
                <Detail
                  label="Experience"
                  value={`${selectedUser.years_of_experience} years`}
                />

                {userType === "student" && (
                  <>
                    <Detail
                      label="Matric No"
                      value={selectedUser.matric_no || "-"}
                    />
                    <Detail label="Level" value={selectedUser.level || "-"} />
                    <Detail
                      label="Additional Info"
                      full
                      value={selectedUser.additional_info}
                    />
                  </>
                )}

                {userType === "tutor" && (
                  <>
                    <Detail
                      label="Specialization"
                      value={selectedUser.specialization || "-"}
                    />
                    <Detail label="Bio" value={selectedUser.bio || "-"} full />
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UsersReport;
