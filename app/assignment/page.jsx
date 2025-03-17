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

const assignments = [
  {
    id: 1,
    title: "Individual Assignment",
    creator: "John Doe",
    course: "Mathematics 101",
    type: "Individual",
    mark: "15.00",
    status: "Submitted",
    start: "01/03/24",
    end: "10/04/24",
    file: "--",
  },
  {
    id: 2,
    title: "Group Project",
    creator: "Jane Smith",
    course: "Physics 201",
    type: "Group",
    mark: "10.00",
    status: "Pending",
    start: "05/03/24",
    end: "12/04/24",
    file: "--",
  },
  {
    id: 3,
    title: "Research Paper",
    creator: "Mark Lee",
    course: "History 102",
    type: "Individual",
    mark: "20.00",
    status: "Closed",
    start: "12/02/24",
    end: "15/03/24",
    file: "--",
  },
];

const AssignmentTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handlePageChange = (event, value) => {
    setPage(value);
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
              {assignments
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.creator}</TableCell>
                    <TableCell>{assignment.course}</TableCell>
                    <TableCell>{assignment.type}</TableCell>
                    <TableCell>{assignment.mark}</TableCell>
                    <TableCell className="p-3">
                      <span className={statusColors[assignment.status]}>
                        {assignment.status}
                      </span>
                    </TableCell>
                    <TableCell>{assignment.start}</TableCell>
                    <TableCell>{assignment.end}</TableCell>
                    <TableCell>{assignment.file}</TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        variant="text"
                        onClick={() =>
                          router.push(
                            `/assignment/${
                              assignment.type === "Group"
                                ? "group-assignment"
                                : "individual-assignment"
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
            count={Math.ceil(assignments.length / rowsPerPage)}
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
