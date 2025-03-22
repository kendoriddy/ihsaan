"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { formatDate } from "@/utils/utilFunctions";

const tableHeaders = [
  { id: "title", label: "Title" },
  { id: "creator", label: "Creator" },
  { id: "course", label: "Course" },
  { id: "type", label: "Type" },
  { id: "mark", label: "Mark" },
  { id: "status", label: "Status" },
  { id: "start", label: "Start Date" },
  { id: "end", label: "End Date" },
  { id: "file", label: "File" },
  { id: "view", label: "View" },
];

const statusColors = {
  Submitted: "bg-green-600 rounded-md text-white py-2 px-3",
  Closed: "bg-red-600 rounded-md text-white py-2 px-[1.4rem]",
  Pending: "bg-blue-600 rounded-md text-white py-2 px-[1.25rem]",
};

const AssignmentTable = () => {
  const router = useRouter();
  const [fetchAll, setFetchAll] = useState(false);
  const [page, setPage] = useState(1);
  const [totalAssignments, setTotalAssignments] = useState(10);
  const rowsPerPage = 5;

  const {
    isLoading,
    data: AssignmentsList,
    refetch,
  } = useFetch(
    "courses",
    `https://ihsaanlms.onrender.com/assessment/base/?page_size=15&page=${page}`,
    (data) => {
      if (data?.total) {
        setTotalAssignments(data.total);
      }
    }
  );

  const Assignments = AssignmentsList?.data?.results || [];

  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
  };

  return (
    <Layout>
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
                  <TableCell className="p-3">
                    {/* <span className={statusColors[assignment.status]}>
                      {assignment.status}
                    </span> */}
                    <span
                      className={`${
                        assignment.isOpen
                          ? "bg-green-600 rounded-md text-white py-2 px-3"
                          : "bg-red-600 rounded-md text-white py-2 px-[1.4rem]"
                      }`}
                    >
                      {assignment.isOpen ? "Open" : "Closed"}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(assignment.start_date)}</TableCell>
                  <TableCell>{formatDate(assignment.end_date)}</TableCell>
                  <TableCell>
                    {assignment.question_type === "FILE_UPLOAD" ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      variant="text"
                      onClick={() =>
                        router.push(
                          `/assignment/${
                            assignment.type === "INDIVIDUAL"
                              ? "individual-assignment"
                              : "group-assignment"
                          }/${assignment.id}`
                        )
                      }
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
      </div>
    </Layout>
  );
};

export default AssignmentTable;
