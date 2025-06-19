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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAuthToken()}`,
      };
      const endpoint =
        userType === "student"
          ? "https://ihsaanlms.onrender.com/api/all-student"
          : "https://ihsaanlms.onrender.com/api/all-tutor";

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
    fetchUsers();
  }, [userType]);

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
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              label="User Type"
              onChange={handleUserTypeChange}
            >
              <MenuItem value="student">Students</MenuItem>
              <MenuItem value="tutor">Tutors</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              value={filters.country}
              label="Country"
              onChange={handleFilterChange("country")}
            >
              <MenuItem value="">All</MenuItem>
              {Array.from(new Set(users.map((user) => user.country))).map(
                (country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={filters.gender}
              label="Gender"
              onChange={handleFilterChange("gender")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={handleFilterChange("status")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" sx={{ color: "#3730a3" }}>
                {selectedUser.first_name} {selectedUser.last_name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedUser.email}
              </Typography>
              <Typography variant="body1">
                <strong>Country:</strong> {selectedUser.country}
              </Typography>
              <Typography variant="body1">
                <strong>Gender:</strong> {selectedUser.gender}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{" "}
                {userType === "student"
                  ? selectedUser.student_application_status
                  : selectedUser.tutor_application_status}
              </Typography>
              <Typography variant="body1">
                <strong>Qualification:</strong>{" "}
                {selectedUser.highest_qualification}
              </Typography>
              <Typography variant="body1">
                <strong>Experience:</strong> {selectedUser.years_of_experience}
              </Typography>
              {userType === "student" && (
                <>
                  <Typography variant="body1">
                    <strong>Matric No:</strong> {selectedUser.matric_no || "-"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Level:</strong> {selectedUser.level || "-"}
                  </Typography>
                </>
              )}
              {userType === "tutor" && (
                <>
                  <Typography variant="body1">
                    <strong>Specialization:</strong>{" "}
                    {selectedUser.specialization || "-"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Bio:</strong> {selectedUser.bio || "-"}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UsersReport;
