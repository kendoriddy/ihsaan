"use client";
import Loader from "@/components/Loader";
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
import { AccessTime } from "@mui/icons-material";
import Lottie from "lottie-react";
import React from "react";
import animation from "../../../../assets/no_data.json";

const tableHeaders = [
  { id: "request_method", label: "Request Method" },
  { id: "request_user_first_name", label: "Request By" },
  { id: "status_code", label: "Status Code" },
  { id: "message", label: "Error Message" },
  { id: "level", label: "Severity Level" },
  { id: "timestamp", label: "Timestamp" },
];

const ErrorLogs = ({
  errorData,
  isLoading,
  isFetching,
  totalErrors,
  currentPage,
  onPageChange,
}) => {
  const ErrorsData = errorData?.data?.results || [];

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4 text-red-900">
        System Error Logs
      </h2>

      {isFetching || isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size={20} />
          <p className="animate-pulse">Fetching error logs...</p>
        </div>
      ) : ErrorsData.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className="bg-gradient-to-r from-red-50 to-blue-50">
                  {tableHeaders.map((header) => (
                    <TableCell
                      key={header.id}
                      className="font-semibold text-nowrap text-red-900"
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {ErrorsData.map((log, index) => (
                  <TableRow
                    key={log.id}
                    className={`hover:bg-red-50 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <TableCell className="font-medium">
                      {log.request_method}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.request_user_first_name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.status_code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.message || log.short_message}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
                          log.level
                        )}`}
                      >
                        {log.level}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AccessTime className="w-4 h-4 text-gray-500" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(totalErrors / 10)}
              page={currentPage}
              onChange={onPageChange}
              color="primary"
            />
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Lottie
            animationData={animation}
            loop={false}
            autoPlay
            className="w-48 h-48 mx-auto"
          />
          <p className="mt-4 text-gray-600">
            There are no error logs available at the moment, check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ErrorLogs;
