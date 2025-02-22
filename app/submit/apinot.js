import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const AssignmentPage = () => {
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [expired, setExpired] = useState(false);
  const deadline = "2025-03-01T23:59:59"; // Change to your deadline

  useEffect(() => {
    setExpired(dayjs().isAfter(dayjs(deadline)));
    fetchSubmission();
  }, []);

  const fetchSubmission = async () => {
    try {
      const response = await axios.get("/api/assignments");
      setSubmission(response.data);
    } catch (error) {
      console.error("Error fetching submission:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/assignments", formData);
      alert("Assignment submitted successfully!");
      fetchSubmission();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg">
      {/* Assignment Details */}
      <h2 className="text-xl font-bold">BUAD810 Individual Assignment</h2>
      <p className="text-gray-700 mt-2">
        Investment appraisal is crucial in finance...
      </p>

      {/* Assignment Image */}
      <img src="/images/assignment.png" alt="Assignment" className="mt-4 rounded-lg" />

      {/* Assignment Submission */}
      <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold">Assignment Submission</h3>

        {expired ? (
          <p className="text-red-600 font-bold mt-2">Assignment Expired</p>
        ) : submission ? (
          <div className="mt-2">
            <p className="text-green-600">You have submitted your assignment.</p>
            <button
              onClick={handleSubmit}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit Submission
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Upload Assignment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
