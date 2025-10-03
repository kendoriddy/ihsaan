"use client";
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
} from "@mui/material";
import { toast } from "react-toastify";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import { MoreVert } from "@mui/icons-material";
import ReasonsForm from "./ReasonsForm";

const Reasons = ({ openReasonCreateModal, setReasonOpenCreateModal }) => {
  const queryClient = useQueryClient();
  const [reasonPage, setReasonPage] = useState(1);
  const [openReasonUpdateModal, setReasonOpenUpdateModal] = useState(false);
  const [openReasonDeleteDialog, setReasonOpenDeleteDialog] = useState(false);
  const [reasonTotalGrades, setReasonTotalGrades] = useState(0);
  const [reasonMenuAnchorEl, setReasonMenuAnchorEl] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);

  const { isLoading, data, refetch, isFetching } = useFetch(
    "reasons",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/reason-options/?page_size=15&page=${reasonPage}`,
    (data) => {
      if (data?.total) {
        setReasonTotalGrades(data.total);
      }
    }
  );

  const manualGradeReasons = data?.data?.results || [];

  // DELETE MANUAL GRADE
  const { mutate: deleteReason, isLoading: isDeleting } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/reason-options`,
    {
      onSuccess: () => {
        toast.success("Manual grade reason deleted successfully");
        queryClient.refetchQueries("reasons");
        refetch();
        setReasonOpenDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete");
      },
    }
  );

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setReasonPage(newPage);
    refetch();
  };

  const handleDelete = () => {
    if (selectedReason?.id) {
      deleteReason(`${selectedReason.id}`);
    }
  };

  // Handle Menu Open
  const handleMenuOpen = (event, reason) => {
    setSelectedReason(reason);
    setReasonMenuAnchorEl(event.currentTarget);
  };

  // Handle Menu Close
  const handleMenuClose = () => {
    setReasonMenuAnchorEl(null);
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <TableContainer component={Paper} className="w-full">
          <Table className="w-full table-auto">
            <TableHead>
              <TableRow>
                <TableCell className="text-nowrap font-bold">Name</TableCell>
                <TableCell className="text-nowrap font-bold">
                  Description
                </TableCell>
                <TableCell className="text-nowrap font-bold">
                  Date Created
                </TableCell>
                <TableCell className="text-nowrap font-bold">Actions</TableCell>
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
              {!isFetching && manualGradeReasons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No manual grade reason found
                  </TableCell>
                </TableRow>
              )}
              {!isFetching &&
                manualGradeReasons.map((reason) => (
                  <TableRow key={reason.id}>
                    <TableCell>{reason.name}</TableCell>
                    <TableCell>{reason.description}</TableCell>
                    <TableCell>
                      {new Date(reason.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, reason)}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={reasonMenuAnchorEl}
                        open={Boolean(reasonMenuAnchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            setReasonOpenUpdateModal(true);
                            handleMenuClose();
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setReasonOpenDeleteDialog(true);
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
      </div>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(reasonTotalGrades / 15)}
        page={reasonPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={openReasonDeleteDialog}
        onClose={() => setReasonOpenDeleteDialog(false)}
        title="Confirm Delete"
        onConfirm={handleDelete}
        confirmText="Delete"
        isLoading={isDeleting}
      >
        <p>
          Are you sure you want to delete this manual grade reason{" "}
          <strong>{selectedReason?.name} </strong>?
        </p>
      </CustomModal>

      {/* Create Manual Grade Modal */}
      <Dialog
        open={openReasonCreateModal}
        onClose={() => setReasonOpenCreateModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Manual Grade Reason</DialogTitle>
        <DialogContent>
          <ReasonsForm
            onClose={() => setReasonOpenCreateModal(false)}
            onSuccess={() => {
              setReasonOpenCreateModal(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Update Manual Grade Modal */}
      <Dialog
        open={openReasonUpdateModal}
        onClose={() => setReasonOpenUpdateModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Manual Grade</DialogTitle>
        <DialogContent>
          <ReasonsForm
            reason={selectedReason}
            isEdit={true}
            onClose={() => setReasonOpenUpdateModal(false)}
            onSuccess={() => {
              setReasonOpenUpdateModal(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reasons;
