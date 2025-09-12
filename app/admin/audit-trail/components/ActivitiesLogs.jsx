import Loader from "@/components/Loader";
import { AccessTime, Person } from "@mui/icons-material";
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
import Lottie from "lottie-react";
import React from "react";
import animation from "../../../../assets/no_data.json";

const ActivitiesLogs = ({
  activityData,
  isLoading,
  isFetching,
  totalActivities,
  currentPage,
  onPageChange,
}) => {
  const ActivitiesData = activityData?.data?.audit_trails || [];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        User Activity Logs
      </h2>
      {isFetching || isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size={20} />
          <p className="animate-pulse">Fetching activity logs...</p>
        </div>
      ) : ActivitiesData.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-red-50">
                    <TableCell className="font-bold text-blue-600">
                      User
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Action Performed
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Message
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      Timestamp
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ActivitiesData?.map((log, index) => (
                    <TableRow
                      key={log.id}
                      className={`hover:bg-blue-50 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Person className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{log.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.action}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.description}
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
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(totalActivities / 10)}
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
            There are no activities to log at the moment, check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesLogs;
