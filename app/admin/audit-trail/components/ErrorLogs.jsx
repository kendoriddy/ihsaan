// // "use client";
// // import Loader from "@/components/Loader";
// // import { useFetch } from "@/hooks/useHttp/useHttp";
// // import { AccessTime } from "@mui/icons-material";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableRow,
// // } from "@mui/material";
// // import Lottie from "lottie-react";
// // import React, { useState } from "react";
// // import animation from "../../../../assets/no_data.json";

// // const ErrorLogs = () => {
// //   const [errorPageSize, setErrorPageSize] = useState(null);
// //   const {
// //     isLoading: loadingErrors,
// //     data: Errors,
// //     refetch: refetchError,
// //     isFetching: isFetchingErrors,
// //   } = useFetch(
// //     ["grades", errorPageSize],
// //     `https://ihsaanlms.onrender.com/utils/api/logs/errors/`, //${ errorPageSize ? `&page_size=${errorPageSize}` : ""}
// //     (data) => {
// //       if (data?.total && !errorPageSize) {
// //         setErrorPageSize(data.total);
// //       }
// //     }
// //   );
// //   console.log("data is", Errors?.data?.results);
// //   const ErrorsData = Errors?.data?.results;

// //   const getLevelColor = (level) => {
// //     switch (level) {
// //       case "Critical":
// //         return "bg-red-100 text-red-800";
// //       case "Warning":
// //         return "bg-yellow-100 text-yellow-800";
// //       case "Info":
// //         return "bg-blue-100 text-blue-800";
// //       default:
// //         return "bg-green-100 text-green-800";
// //     }
// //   };

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-2xl font-semibold text-red-900 mb-6">
// //         System Error Logs
// //       </h2>
// //       <div className="bg-white rounded-xl shadow-md overflow-hidden">
// //         {isFetchingErrors || loadingErrors ? (
// //           <div className="flex gap-2">
// //             <Loader size={20} />
// //             <p className="animate-pulse">Fetching all error logs</p>
// //           </div>
// //         ) : ErrorsData?.length > 0 ? (
// //           <Table>
// //             <TableHead>
// //               <TableRow className="bg-gradient-to-r from-red-50 to-blue-50">
// //                 <TableCell className="font-bold text-red-900">ID</TableCell>
// //                 <TableCell className="font-bold text-red-900">
// //                   Error Message
// //                 </TableCell>
// //                 <TableCell className="font-bold text-red-900">
// //                   Severity Level
// //                 </TableCell>
// //                 <TableCell className="font-bold text-red-900">
// //                   Timestamp
// //                 </TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {ErrorsData?.map((log, index) => (
// //                 <TableRow
// //                   key={log.id}
// //                   className={`hover:bg-red-50 ${
// //                     index % 2 === 0 ? "bg-gray-50" : "bg-white"
// //                   }`}
// //                 >
// //                   <TableCell>
// //                     <div className="bg-red-100 text-red-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
// //                       {log.id}
// //                     </div>
// //                   </TableCell>
// //                   <TableCell className="font-medium">{log.message}</TableCell>
// //                   <TableCell>
// //                     <span
// //                       className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
// //                         log.level
// //                       )}`}
// //                     >
// //                       {log.level}
// //                     </span>
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex items-center gap-2">
// //                       <AccessTime className="w-4 h-4 text-gray-500" />
// //                       {log.time}
// //                     </div>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         ) : (
// //           <div className="text-center py-8">
// //             <Lottie
// //               animationData={animation}
// //               loop={false}
// //               autoPlay
// //               className="w-48 h-48 mx-auto"
// //             />
// //             <p className="mt-4 text-gray-600">
// //               There is no errors avaiable at the moment, check back later.
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ErrorLogs;

// "use client";
// import Loader from "@/components/Loader";
// import { useFetch } from "@/hooks/useHttp/useHttp";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
// } from "@mui/material";
// import { AccessTime } from "@mui/icons-material";
// import Lottie from "lottie-react";
// import React, { useState } from "react";
// import animation from "../../../../assets/no_data.json";

// const tableHeaders = [
//   { id: "request_method", label: "Request Method" },
//   { id: "request_user_first_name", label: "Request By" },
//   { id: "status_code", label: "Status Code" },
//   { id: "message", label: "Error Message" },
//   { id: "level", label: "Severity Level" },
//   { id: "timestamp", label: "Timestamp" },
// ];

// const ErrorLogs = () => {
//   const [page, setPage] = useState(1);
//   const [totalLogs, setTotalLogs] = useState(10);

//   const {
//     isLoading,
//     data: Errors,
//     isFetching,
//     refetch,
//   } = useFetch(
//     ["errorLogs", page],
//     `https://ihsaanlms.onrender.com/utils/api/logs/errors/?page=${page}&page_size=10`,
//     (data) => {
//       console.log("pagination", data.total);
//       if (data?.total) {
//         setTotalLogs(data.total);
//       }
//     }
//   );

//   const ErrorsData = Errors?.data?.results || [];

//   const handlePageChange = (event, value) => {
//     setPage(value);
//     refetch();
//   };

//   const getLevelColor = (level) => {
//     switch (level?.toLowerCase()) {
//       case "critical":
//         return "bg-red-100 text-red-800";
//       case "warning":
//         return "bg-yellow-100 text-yellow-800";
//       case "info":
//         return "bg-blue-100 text-blue-800";
//       case "error":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-green-100 text-green-800";
//     }
//   };

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-bold text-center mb-4 text-red-900">
//         System Error Logs
//       </h2>

//       {isFetching || isLoading ? (
//         <div className="flex items-center gap-2">
//           <Loader size={20} />
//           <p className="animate-pulse">Fetching error logs...</p>
//         </div>
//       ) : ErrorsData.length > 0 ? (
//         <>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow className="bg-gradient-to-r from-red-50 to-blue-50">
//                   {tableHeaders.map((header) => (
//                     <TableCell
//                       key={header.id}
//                       className="font-semibold text-nowrap text-red-900"
//                     >
//                       {header.label}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {ErrorsData.map((log, index) => (
//                   <TableRow
//                     key={log.id}
//                     className={`hover:bg-red-50 ${
//                       index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     }`}
//                   >
//                     <TableCell className="font-medium">
//                       {log.request_method}
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {log.request_user_first_name}
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {log.status_code}
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {log.message || log.short_message}
//                     </TableCell>
//                     <TableCell>
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
//                           log.level
//                         )}`}
//                       >
//                         {log.level}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <AccessTime className="w-4 h-4 text-gray-500" />
//                         {new Date(log.timestamp).toLocaleString()}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           <div className="flex justify-center mt-4">
//             <Pagination
//               count={Math.ceil(totalLogs / 10)}
//               page={page}
//               onChange={handlePageChange}
//               color="primary"
//             />
//           </div>
//         </>
//       ) : (
//         <div className="text-center py-8">
//           <Lottie
//             animationData={animation}
//             loop={false}
//             autoPlay
//             className="w-48 h-48 mx-auto"
//           />
//           <p className="mt-4 text-gray-600">
//             There are no error logs available at the moment, check back later.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ErrorLogs;

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
