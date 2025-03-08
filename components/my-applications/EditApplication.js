import { Box } from "@mui/material";
import React from "react";

const EditApplication = ({ selectedApplication, handleClose }) => {
  return (
    <div>
      {" "}
      <Box className="bg-white p-6 rounded-lg overflow-scroll md:w-[60%] h-[90%] mx-auto mt-20">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Your Application</h2>
          <button
            className="text-red-600 hover:text-blue-600 transition-all duration-300"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
        {/* Tutor Details */}
        <div className="py-4">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {/* <tr className="bg-gray-100">
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">
                  {selectedApplication.first_name}{" "}
                  {selectedApplication.last_name}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Email</td>
                <td className="border px-4 py-2">
                  {selectedApplication.email}
                </td>
              </tr> */}
              <tr className="bg-gray-100">
                <td className="border px-4 py-2 font-semibold">
                  Tutor Application Status
                </td>
                <td className="border px-4 py-2">
                  {selectedApplication.tutor_application_status}
                </td>
              </tr>
              {selectedApplication.tutor_rejection_reason && (
                <tr className="bg-gray-100">
                  <td className="border px-4 py-2 font-semibold">
                    Tutor Rejection Reason
                  </td>
                  <td className="border px-4 py-2">
                    {selectedApplication.tutor_rejection_reason}
                  </td>
                </tr>
              )}
              <tr>
                <td className="border px-4 py-2 font-semibold">Gender</td>
                <td className="border px-4 py-2">
                  {selectedApplication.gender}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Qualification
                </td>
                <td className="border px-4 py-2">
                  {selectedApplication.highest_qualification}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Country</td>
                <td className="border px-4 py-2">
                  {selectedApplication.country}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Date of Birth
                </td>
                <td className="border px-4 py-2">
                  {selectedApplication.date_of_birth}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Marital Status
                </td>
                <td className="border px-4 py-2">
                  {selectedApplication.marital_status}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Experience</td>
                <td className="border px-4 py-2">
                  {selectedApplication.years_of_experience || "-"} years
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Professional Bio
                </td>
                <td className="border px-4 py-2">
                  {selectedApplication.professional_bio}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Additional Info
                </td>
                <td className="border px-4 py-2">
                  {selectedApplication.additional_info}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Skills</td>
                <td className="border px-4 py-2">
                  {selectedApplication.skills}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Religion</td>
                <td className="border px-4 py-2">
                  {selectedApplication.religion}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Area of Specialization
                </td>
                <td className="border px-4 py-2">
                  {selectedApplication.area_of_specialization}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleClose}
            className="mr-2 px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
        </div>
      </Box>
    </div>
  );
};

export default EditApplication;
