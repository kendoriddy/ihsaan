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
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Loader";
import EditAssignmentQuestion from "./components/EditAssignment";
import Link from "next/link";

const AllAssignment = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [totalAssignments, setTotalAssignments] = useState(0);

  const { isLoading, data, refetch, isFetching } = useFetch(
    "assignments",
    `https://ihsaanlms.onrender.com/assessment/base/?page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalAssignments(data.total);
      }
    }
  );

  const assignments = data?.data?.results || [];

  // DELETE QUESTION
  const { mutate: questionDelete, isLoading: isDeleting } = useDelete(
    `https://ihsaanlms.onrender.com/assessment/base`,
    {
      onSuccess: () => {
        toast.success("Assignment deleted successfully");
        queryClient.invalidateQueries("assignments");
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
    if (selectedAssignment?.id) {
      questionDelete(`${selectedAssignment.id}/`);
    }
  };

  return (
    <Layout>
      <div className="max-w-full">
        <div className="w-full">
          <Link
            href="/set-assignment/create-assignment"
            className="flex justify-end mb-6"
          >
            <Button color="secondary">Create new Assignment/Quiz</Button>
          </Link>
          <TableContainer
            component={Paper}
            className="overflow-x-auto max-w-full"
          >
            <Table className="table-auto">
              <TableHead>
                <TableRow>
                  <TableCell className="text-nowrap">
                    Assignment Title
                  </TableCell>
                  <TableCell className="text-nowrap">Description</TableCell>
                  <TableCell className="text-nowrap">Assignment Type</TableCell>
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
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{assignment.description}</TableCell>
                        <TableCell className="capitalize">
                          {assignment.type.toLowerCase()}
                        </TableCell>
                        <TableCell className="flex flex-col md:flex-row items-center justify-center gap-3">
                          <Button
                            color="secondary"
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setOpenUpdateModal(true);
                            }}
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(totalAssignments / 15)}
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
          <p>Are you sure you want to delete this question?</p>
        </CustomModal>

        {/* Update Question Modal */}
        <EditAssignmentQuestion
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          selectedAssignment={selectedAssignment}
          refetchQuestions={() => refetch()}
        />
      </div>
    </Layout>
  );
};

export default AllAssignment;
