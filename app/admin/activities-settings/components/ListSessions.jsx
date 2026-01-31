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
} from "@mui/material";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import EditSession from "./EditSession";
import { Delete, Edit } from "@mui/icons-material";

const AllSessions = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalSession, setTotalSession] = useState(0);

  const { isLoading, data, refetch, isFetching } = useFetch(
    "academicSession",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/academic-sessions/?page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalSession(data.total);
      }
    }
  );

  const Sessions = data?.data?.results || [];

  // DELETE QUESTION
  const { mutate: sessionDelete, isLoading: isDeleting } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/academic-sessions`,
    {
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries("academicSession");
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
    if (selectedSession?.id) {
      sessionDelete(`${selectedSession.id}`);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Academic Year</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching && (
              <div className="flex pl-6 py-3 items-center justify-center gap-2">
                <Loader />
                <p className="animate-pulse">Loading...</p>
              </div>
            )}
            {!isFetching && (
              <>
                {Sessions.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell>{year.year}</TableCell>
                    <TableCell>{year.start_date}</TableCell>
                    <TableCell>{year.end_date}</TableCell>
                    <TableCell className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <Button
                        color="secondary"
                        onClick={() => {
                          setSelectedSession(year);
                          setOpenUpdateModal(true);
                        }}
                      >
                        <Edit />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedSession(year);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(totalSession / 15)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Confirm Delete"
        onConfirm={handleDelete}
        confirmText="Delete"
        isLoading={isDeleting}
      >
        <p>Are you sure you want to delete this academic session?</p>
      </CustomModal>

      {/* Update Session Modal */}
      <EditSession
        openUpdateModal={openUpdateModal}
        setOpenUpdateModal={setOpenUpdateModal}
        selectedSession={selectedSession}
        refetchSessions={() => refetch()}
      />
    </div>
  );
};

export default AllSessions;
