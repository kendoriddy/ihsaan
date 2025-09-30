"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  Add,
  Email,
  CheckCircle,
  Cancel,
  TableChart,
  MarkEmailRead,
  VerifiedUser,
  MoreVert,
} from "@mui/icons-material";
import AdminLayout from "@/components/AdminLayout";
import { useDelete, useFetch } from "@/hooks/useHttp/useHttp";
import CustomModal from "@/components/CustomModal";
import NewsletterStats from "./components/NewsletterStats";
import NewsletterForm from "./components/NewsletterForm";

const NewsletterAdmin = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [newsletterPage, setNewsletterPage] = useState(1);
  const [totalNewsletters, setTotalNewsletters] = useState(0);
  const [newsletterFilters, setNewsletterFilters] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  // Build newsletter query string
  const buildNewsletterQuery = () => {
    const baseParams = {
      page: newsletterPage,
      page_size: 10,
    };
    const allParams = { ...baseParams, ...newsletterFilters };
    return Object.entries(allParams)
      .filter(([_, value]) => value !== "" && value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  };

  // Subscribers fetch
  const {
    isLoading: newsletterLoading,
    data: newsletterData,
    isFetching: newsletterFetching,
    refetch: newsletterRefetch,
  } = useFetch(
    ["subscribers", newsletterPage, newsletterFilters],
    `https://ihsaanlms.onrender.com/newsletter/api/subscribers/?${buildNewsletterQuery()}`,
    (data) => {
      if (data?.total) {
        setTotalNewsletters(data.total);
      }
    }
  );

  const Subscribers = newsletterData?.data?.results;

  const stats = {
    total: Subscribers?.length,
    active: Subscribers?.filter((sub) => sub.active).length,
    verified: Subscribers?.filter((sub) => sub.verified).length,
  };

  // DELETE MANUAL GRADE
  const { mutate: deleteSubscriber, isLoading: isDeleting } = useDelete(
    `https://ihsaanlms.onrender.com/newsletter/api/subscribers`,
    {
      onSuccess: () => {
        toast.success("Manual grade deleted successfully");
        newsletterRefetch();
        setOpenDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    }
  );

  const handleMenuOpen = (event, subscriber) => {
    setSelectedSubscriber(subscriber);
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle Menu Close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setNewsletterPage(newPage);
    refetch();
  };

  const handleDelete = () => {
    if (selectedSubscriber?.id) {
      deleteSubscriber(`${selectedSubscriber.id}`);
    }
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
        <NewsletterStats stats={stats} />

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setOpenDialog(true);
                }}
                className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 normal-case font-semibold px-6"
              >
                Add Subscriber
              </Button>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TableChart className="text-blue-600" />
              Newsletter Subscribers ({Subscribers?.length})
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
                {Subscribers?.map((subscriber, index) => (
                  <TableRow
                    key={subscriber.id}
                    className={`hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <TableCell>
                      <Avatar className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold">
                        {subscriber?.firstname?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {subscriber?.full_name}
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
                        className={`px-3 py-1 rounded-full text-sm font-semibold`}
                      >
                        {subscriber.category_name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
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
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`normal-case font-semibold ${
                          subscriber.verified
                            ? "text-blue-600 hover:bg-blue-50"
                            : "text-orange-600 hover:bg-orange-50"
                        }`}
                      >
                        {subscriber.verified ? (
                          <>
                            <VerifiedUser className="w-4 h-4 mr-1" />
                            Verified
                          </>
                        ) : (
                          "Pending"
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, subscriber)}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            setOpenUpdateDialog(true);
                            handleMenuClose();
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            handleMenuClose();
                          }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Create Manual Grade Modal */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create Subscriber</DialogTitle>
          <DialogContent>
            <NewsletterForm
              onClose={() => setOpenDialog(false)}
              onSuccess={() => {
                setOpenDialog(false);
                newsletterRefetch();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Update Manual Grade Modal */}
        <Dialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Subscriber</DialogTitle>
          <DialogContent>
            <NewsletterForm
              subscriber={selectedSubscriber}
              isEdit={true}
              onClose={() => setOpenUpdateDialog(false)}
              onSuccess={() => {
                setOpenUpdateDialog(false);
                newsletterRefetch();
              }}
            />
          </DialogContent>
        </Dialog>

        <CustomModal
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          title="Confirm Delete"
          onConfirm={handleDelete}
          confirmText="Delete"
          isLoading={isDeleting}
        >
          <p>
            Are you sure you want to delete this subscriber{" "}
            <strong>{selectedSubscriber?.email} </strong>?
          </p>
        </CustomModal>
      </div>
    </AdminLayout>
  );
};

export default NewsletterAdmin;
