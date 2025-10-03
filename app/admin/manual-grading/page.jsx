"use client";
import AdminLayout from "@/components/AdminLayout";
import React, { useState } from "react";
import { useFetch, useDelete } from "@/hooks/useHttp/useHttp";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  MenuItem,
  Menu,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import { MoreVert } from "@mui/icons-material";
import ManualGradeForm from "@/app/manual-grading/components/ManualGradeForm";
import Reasons from "./components/Reasons";

const AdminManualGrading = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalGrades, setTotalGrades] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("grades");
  const [openReasonCreateModal, setReasonOpenCreateModal] = useState(false);

  const { isLoading, data, refetch, isFetching } = useFetch(
    "manual-grades",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades/?page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalGrades(data.total);
      }
    }
  );

  const manualGrades = data?.data?.results || [];

  // DELETE MANUAL GRADE
  const { mutate: deleteGrade, isLoading: isDeleting } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/manual-grades`,
    {
      onSuccess: () => {
        toast.success("Manual grade deleted successfully");
        queryClient.refetchQueries("manual-grades");
        refetch();
        setOpenDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    }
  );

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    refetch();
  };

  const handleDelete = () => {
    if (selectedGrade?.id) {
      deleteGrade(`${selectedGrade.id}`);
    }
  };

  // Handle Menu Open
  const handleMenuOpen = (event, grade) => {
    setSelectedGrade(grade);
    setMenuAnchorEl(event.currentTarget);
  };

  // Handle Menu Close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="w-full">
          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-2xl font-bold">Manual Grades Management</h1>
            <div className="flex justify-between items-center">
              <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                  value={currentScreen}
                  onChange={(e, newValue) => setCurrentScreen(newValue)}
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab value="grades" label="Manual Grades" />
                  <Tab value="reasons" label="Manual Grade Reasons" />
                </Tabs>
              </Box>
              {currentScreen === "grades" ? (
                <Button
                  color="secondary"
                  onClick={() => setOpenCreateModal(true)}
                >
                  Create Manual Grade
                </Button>
              ) : (
                <Button
                  color="secondary"
                  onClick={() => setReasonOpenCreateModal(true)}
                >
                  Create Reason
                </Button>
              )}
            </div>
          </div>
        </div>
        {currentScreen === "grades" && (
          <>
            <TableContainer
              component={Paper}
              className="overflow-x-auto max-w-full"
            >
              <Table className="table-auto">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-nowrap font-bold">
                      Tutor's/Admin's Name
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Student Name
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Course Name
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Course Code
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Reason
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Score
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Details
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Date Created
                    </TableCell>
                    <TableCell className="text-nowrap font-bold">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isFetching && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <div className="flex items-center justify-center gap-2 py-4">
                          <Loader />
                          <p className="animate-pulse">Loading...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!isFetching && manualGrades.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No manual grades found
                      </TableCell>
                    </TableRow>
                  )}
                  {!isFetching &&
                    manualGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.created_by_name}</TableCell>
                        <TableCell>{grade.student_name}</TableCell>
                        <TableCell>{grade.course_title}</TableCell>
                        <TableCell>{grade.course_code}</TableCell>
                        <TableCell>{grade.reason_name}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{grade.score}</span>
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-xs truncate"
                            title={grade.details}
                          >
                            {grade.details}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(grade.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={(event) => handleMenuOpen(event, grade)}
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
                                setOpenUpdateModal(true);
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
            </TableContainer>
            {/* Pagination */}
            <Pagination
              count={Math.ceil(totalGrades / 15)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />
          </>
        )}

        {currentScreen === "reasons" && (
          <Reasons
            openReasonCreateModal={openReasonCreateModal}
            setReasonOpenCreateModal={setReasonOpenCreateModal}
          />
        )}

        {/* Delete Confirmation Modal */}
        <CustomModal
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          title="Confirm Delete"
          onConfirm={handleDelete}
          confirmText="Delete"
          isLoading={isDeleting}
        >
          <p>
            Are you sure you want to delete this manual grade for{" "}
            <strong>{selectedGrade?.student_name} </strong>?
          </p>
        </CustomModal>

        {/* Create Manual Grade Modal */}
        <Dialog
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create Manual Grade</DialogTitle>
          <DialogContent>
            <ManualGradeForm
              onClose={() => setOpenCreateModal(false)}
              onSuccess={() => {
                setOpenCreateModal(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Update Manual Grade Modal */}
        <Dialog
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Manual Grade</DialogTitle>
          <DialogContent>
            <ManualGradeForm
              grade={selectedGrade}
              isEdit={true}
              onClose={() => setOpenUpdateModal(false)}
              onSuccess={() => {
                setOpenUpdateModal(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminManualGrading;
