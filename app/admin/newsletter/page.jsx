"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Upload,
  Download,
  Add,
  Edit,
  Delete,
  Email,
  Person,
  Category,
  CheckCircle,
  Cancel,
  FileUpload,
  TableChart,
  PeopleAlt,
  MarkEmailRead,
  VerifiedUser,
} from "@mui/icons-material";
import AdminLayout from "@/components/AdminLayout";

// Dummy newsletter subscribers data
const initialSubscribers = [
  {
    id: 1,
    surname: "Johnson",
    firstName: "Emily",
    email: "emily.johnson@email.com",
    category: "Premium",
    verify: true,
    active: true,
  },
  {
    id: 2,
    surname: "Smith",
    firstName: "Michael",
    email: "michael.smith@gmail.com",
    category: "Basic",
    verify: true,
    active: true,
  },
  {
    id: 3,
    surname: "Davis",
    firstName: "Sarah",
    email: "sarah.davis@outlook.com",
    category: "Premium",
    verify: false,
    active: true,
  },
  {
    id: 4,
    surname: "Wilson",
    firstName: "David",
    email: "david.wilson@yahoo.com",
    category: "Basic",
    verify: true,
    active: false,
  },
  {
    id: 5,
    surname: "Brown",
    firstName: "Lisa",
    email: "lisa.brown@email.com",
    category: "VIP",
    verify: true,
    active: true,
  },
  {
    id: 6,
    surname: "Taylor",
    firstName: "James",
    email: "james.taylor@gmail.com",
    category: "Premium",
    verify: true,
    active: true,
  },
  {
    id: 7,
    surname: "Anderson",
    firstName: "Maria",
    email: "maria.anderson@hotmail.com",
    category: "Basic",
    verify: false,
    active: true,
  },
  {
    id: 8,
    surname: "Martinez",
    firstName: "Robert",
    email: "robert.martinez@email.com",
    category: "VIP",
    verify: true,
    active: true,
  },
];

const NewsletterAdmin = () => {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Statistics
  const stats = {
    total: subscribers.length,
    active: subscribers.filter((sub) => sub.active).length,
    verified: subscribers.filter((sub) => sub.verify).length,
    premium: subscribers.filter(
      (sub) => sub.category === "Premium" || sub.category === "VIP"
    ).length,
  };

  // Filter subscribers based on search
  const filteredSubscribers = subscribers.filter(
    (subscriber) =>
      subscriber.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case "VIP":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "Premium":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "Basic":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Here you would process the Excel file
            console.log("File uploaded:", file.name);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleEdit = (subscriber) => {
    setEditingSubscriber(subscriber);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setSubscribers(subscribers.filter((sub) => sub.id !== id));
  };

  const toggleStatus = (id, field) => {
    setSubscribers(
      subscribers.map((sub) =>
        sub.id === id ? { ...sub, [field]: !sub[field] } : sub
      )
    );
  };

  const exportToExcel = () => {
    // Here you would implement Excel export functionality
    console.log("Exporting to Excel...");
  };

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-900 to-blue-600 text-white p-8 mb-8 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Email className="text-5xl" />
                Newsletter Management
              </h1>
              <p className="text-white/90 text-lg">
                Manage subscribers, upload lists, and track engagement
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <MarkEmailRead className="text-6xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  Total Subscribers
                </h3>
                <p className="text-3xl font-bold text-blue-700">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-200 text-blue-700 p-3 rounded-full">
                <PeopleAlt className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  Active Users
                </h3>
                <p className="text-3xl font-bold text-green-700">
                  {stats.active}
                </p>
              </div>
              <div className="bg-green-200 text-green-700 p-3 rounded-full">
                <CheckCircle className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  Verified
                </h3>
                <p className="text-3xl font-bold text-purple-700">
                  {stats.verified}
                </p>
              </div>
              <div className="bg-purple-200 text-purple-700 p-3 rounded-full">
                <VerifiedUser className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  Premium Users
                </h3>
                <p className="text-3xl font-bold text-orange-700">
                  {stats.premium}
                </p>
              </div>
              <div className="bg-orange-200 text-orange-700 p-3 rounded-full">
                <Category className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <TextField
                placeholder="Search subscribers..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-80"
              />
            </div>

            <div className="flex gap-3">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="excel-upload"
              />
              <label htmlFor="excel-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<FileUpload />}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white normal-case font-semibold px-6"
                >
                  Upload Excel
                </Button>
              </label>

              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={exportToExcel}
                className="border-blue-500 text-blue-500 hover:bg-blue-50 normal-case font-semibold px-6"
              >
                Export
              </Button>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditingSubscriber(null);
                  setOpenDialog(true);
                }}
                className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 normal-case font-semibold px-6"
              >
                Add Subscriber
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="mt-4">
              <Alert severity="info" className="mb-2">
                Uploading Excel file... Please wait.
              </Alert>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </div>
          )}
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TableChart className="text-blue-600" />
              Newsletter Subscribers ({filteredSubscribers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableCell className="font-bold text-gray-700">
                    Avatar
                  </TableCell>
                  <TableCell className="font-bold text-gray-700">
                    Name
                  </TableCell>
                  <TableCell className="font-bold text-gray-700">
                    Email
                  </TableCell>
                  <TableCell className="font-bold text-gray-700">
                    Category
                  </TableCell>
                  <TableCell className="font-bold text-gray-700">
                    Status
                  </TableCell>
                  <TableCell className="font-bold text-gray-700">
                    Verified
                  </TableCell>
                  <TableCell className="font-bold text-gray-700">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubscribers.map((subscriber, index) => (
                  <TableRow
                    key={subscriber.id}
                    className={`hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <TableCell>
                      <Avatar className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold">
                        {subscriber.firstName[0]}
                        {subscriber.surname[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {subscriber.firstName} {subscriber.surname}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Email className="w-4 h-4 text-gray-500" />
                        {subscriber.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(
                          subscriber.category
                        )}`}
                      >
                        {subscriber.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => toggleStatus(subscriber.id, "active")}
                        className={`normal-case font-semibold ${
                          subscriber.active
                            ? "text-green-600 hover:bg-green-50"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {subscriber.active ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Cancel className="w-4 h-4 mr-1" />
                            Inactive
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => toggleStatus(subscriber.id, "verify")}
                        className={`normal-case font-semibold ${
                          subscriber.verify
                            ? "text-blue-600 hover:bg-blue-50"
                            : "text-orange-600 hover:bg-orange-50"
                        }`}
                      >
                        {subscriber.verify ? (
                          <>
                            <VerifiedUser className="w-4 h-4 mr-1" />
                            Verified
                          </>
                        ) : (
                          "Pending"
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip title="Edit Subscriber">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(subscriber)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Subscriber">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Delete className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="bg-gradient-to-r from-red-900 to-blue-600 text-white">
            {editingSubscriber ? "Edit Subscriber" : "Add New Subscriber"}
          </DialogTitle>
          <DialogContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                defaultValue={editingSubscriber?.firstName || ""}
              />
              <TextField
                label="Surname"
                variant="outlined"
                fullWidth
                defaultValue={editingSubscriber?.surname || ""}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                className="md:col-span-2"
                defaultValue={editingSubscriber?.email || ""}
              />
              <TextField
                label="Category"
                variant="outlined"
                fullWidth
                select
                SelectProps={{ native: true }}
                defaultValue={editingSubscriber?.category || "Basic"}
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
              </TextField>
            </div>
          </DialogContent>
          <DialogActions className="p-6">
            <Button
              onClick={() => setOpenDialog(false)}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="bg-gradient-to-r from-red-900 to-blue-600 text-white"
            >
              {editingSubscriber ? "Update" : "Add"} Subscriber
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default NewsletterAdmin;
