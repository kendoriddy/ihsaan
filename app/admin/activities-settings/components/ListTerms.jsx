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
import EditTerm from "./EditTerm";
import { Delete, Edit } from "@mui/icons-material";

const ListTerms = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalTerms, setTotalTerms] = useState(0);

  const { isLoading, data, refetch, isFetching } = useFetch(
    "terms",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms/?page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalTerms(data.total);
      }
    }
  );

  const Terms = data?.data?.results || [];

  // DELETE TERM
  const { mutate: sessionDelete, isLoading: isDeleting } = useDelete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/terms`,
    {
      onSuccess: () => {
        toast.success("Deleted successfully");
        queryClient.invalidateQueries("terms");
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
    if (selectedTerm?.id) {
      sessionDelete(`${selectedTerm.id}/`);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Academic Year</TableCell>
              <TableCell>Term</TableCell>
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
                {Terms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell>{term.session.year}</TableCell>
                    <TableCell>{term.name}</TableCell>
                    <TableCell>{term.start_date}</TableCell>
                    <TableCell>{term.end_date}</TableCell>
                    <TableCell className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <Button
                        color="secondary"
                        onClick={() => {
                          setSelectedTerm(term);
                          setOpenUpdateModal(true);
                        }}
                      >
                        <Edit />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedTerm(term);
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
        count={Math.ceil(totalTerms / 15)}
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
        <p>Are you sure you want to delete this term?</p>
      </CustomModal>

      {/* Update Term Modal */}
      <EditTerm
        openUpdateModal={openUpdateModal}
        setOpenUpdateModal={setOpenUpdateModal}
        selectedTerm={selectedTerm}
        refetchTerms={() => refetch()}
      />
    </div>
  );
};

export default ListTerms;
