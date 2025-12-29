import { formatQualification } from "@/utils/utilFunctions";
import { Box } from "@mui/material";
import React from "react";

const EditApplication = ({ selectedApplication, handleClose, userRoles }) => {
  if (!selectedApplication) return null;

  // Extract nested user details safely
  const details = selectedApplication.user_details || {};

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <Box 
        className="bg-white  rounded-lg shadow-2xl md:w-[60%] w-[95%]"
        sx={{
          maxHeight: '85vh', // Limits height to 85% of screen
          overflowY: 'auto', // Adds vertical scrollbar when content exceeds maxHeight
          position: 'relative',
          margin: 'auto',
          // Optional: Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {/* Header - Sticky for easy closing */}
        <div className="flex justify-between items-center p-4 mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h2 className="text-xl font-bold text-primary">Application Details</h2>
          <button
            className="text-red-600 font-bold hover:text-red-800 transition-all duration-300 px-2 py-1"
            onClick={handleClose}
          >
            ✕ Close
          </button>
        </div>

        <div className="py-4">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr className="bg-gray-100">
                <td className="border px-4 py-2 font-semibold w-1/3">Full Name</td>
                <td className="border px-4 py-2">
                  {details.first_name || ""} {details.last_name || ""}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Email</td>
                <td className="border px-4 py-2">{details.email || "N/A"}</td>
              </tr>
              
              <tr className="bg-gray-100">
                <td className="border px-4 py-2 font-semibold text-blue-700">Application Status</td>
                <td className="border px-4 py-2 font-bold uppercase">
                  {userRoles?.includes("TUTOR")
                    ? selectedApplication.tutor_application_status || "PENDING"
                    : selectedApplication.student_application_status || "PENDING"}
                </td>
              </tr>

              {(selectedApplication.tutor_rejection_reason || selectedApplication.student_rejection_reason) && (
                <tr className="bg-red-50">
                  <td className="border px-4 py-2 font-semibold text-red-600">Rejection Reason</td>
                  <td className="border px-4 py-2">
                    {userRoles?.includes("TUTOR")
                      ? selectedApplication.tutor_rejection_reason
                      : selectedApplication.student_rejection_reason}
                  </td>
                </tr>
              )}

              <tr>
                <td className="border px-4 py-2 font-semibold">Gender</td>
                <td className="border px-4 py-2 uppercase">
                  {selectedApplication.gender || details.gender || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Qualification</td>
                <td className="border px-4 py-2">
                  {formatQualification(selectedApplication.highest_qualification) || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Country</td>
                <td className="border px-4 py-2">
                  {selectedApplication.country || details.country || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Date of Birth</td>
                <td className="border px-4 py-2">
                  {selectedApplication.date_of_birth || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Experience</td>
                <td className="border px-4 py-2">
                  {selectedApplication.years_of_experience ?? "-"} years
                </td>
              </tr>

              {userRoles?.includes("TUTOR") && (
                <>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2 font-semibold">Professional Bio</td>
                    <td className="border px-4 py-2 text-sm italic">
                      {selectedApplication.professional_bio || "No bio provided."}
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Specialization</td>
                    <td className="border px-4 py-2">
                      {selectedApplication.area_of_specialization || "N/A"}
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td className="border px-4 py-2 font-semibold">Skills</td>
                <td className="border px-4 py-2">
                  {selectedApplication.skills || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Religion</td>
                <td className="border px-4 py-2">
                  {selectedApplication.religion || details.religion || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Additional Info</td>
                <td className="border px-4 py-2">
                  {selectedApplication.additional_info || "None"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4 pt-4 border-t sticky bottom-[-24px] bg-white pb-2">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </Box>
    </div>
  );
};

export default EditApplication;