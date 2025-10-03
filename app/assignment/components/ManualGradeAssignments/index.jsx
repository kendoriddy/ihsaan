"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Chip,
} from "@mui/material";
import Button from "@/components/Button";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { formatDate } from "@/utils/utilFunctions";
import AssignmentDetails from "./components/AssignmentDetails";

const tableHeaders = [
  { id: "title", label: "Title" },
  { id: "creator", label: "Creator" },
  { id: "course", label: "Course" },
  { id: "type", label: "Type" },
  { id: "mark", label: "Mark" },
  { id: "status", label: "Status" },
  { id: "start", label: "Start Date" },
  { id: "end", label: "End Date" },
  { id: "view", label: "View" },
];

const statusColors = {
  submitted: "bg-green-600 rounded-md text-white py-2 px-3",
  pending: "bg-blue-600 rounded-md text-white py-2 px-[1.25rem]",
};

const ManualGradeAssignemnts = () => {
  const [page, setPage] = useState(1);
  const [totalAssignments, setTotalAssignments] = useState(10);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    isLoading,
    data: AssignmentsList,
    refetch,
  } = useFetch(
    "assignmentsList",
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/assessment/base/?question_type=MANUAL&page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalAssignments(data.total);
      }
    }
  );

  const Assignments = AssignmentsList?.data?.results || [];

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewClick = (assignment) => {
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAssignment(null);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Assignment List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell
                  key={header.id}
                  className="font-semibold text-nowrap"
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{assignment.tutor_name}</TableCell>
                <TableCell>{assignment.course_code}</TableCell>
                <TableCell className="capitalize">
                  {assignment.type.toLowerCase()}
                </TableCell>
                <TableCell>{assignment.max_score}</TableCell>
                <TableCell className="p-3 space-x-2">
                  {assignment.is_open ? (
                    <span className={statusColors.pending}>Pending</span>
                  ) : (
                    <span className="bg-red-600 rounded-md text-white py-2 px-[1.4rem]">
                      Closed
                    </span>
                  )}
                </TableCell>
                <TableCell>{formatDate(assignment.start_date)}</TableCell>
                <TableCell>{formatDate(assignment.end_date)}</TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    variant="text"
                    onClick={() => handleViewClick(assignment)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(totalAssignments / 15)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
      <AssignmentDetails
        handleCloseModal={handleCloseModal}
        selectedAssignment={selectedAssignment}
        modalOpen={modalOpen}
      />
    </div>
  );
};

export default ManualGradeAssignemnts;
