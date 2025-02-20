"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

const assignmentsData = [
  {
    id: 1,
    image: "/images/quran.jpg",
    question: "What are the five pillars of Islam?",
    created_at: "2025-02-20T10:00:00",
    deadline: "2025-03-01T23:59:59",
  },
  {
    id: 2,
    image: "/images/prayer.jpg",
    question: "Explain the importance of Salah (prayer) in Islam.",
    created_at: "2025-02-21T12:00:00",
    deadline: "2025-03-02T23:59:59",
  },
  {
    id: 3,
    image: "/images/fasting.jpg",
    question: "Why is fasting (Sawm) during Ramadan important for Muslims?",
    created_at: "2025-02-22T15:00:00",
    deadline: "2025-03-03T23:59:59",
  },
  {
    id: 4,
    image: "/images/zakat.jpg",
    question: "Describe the concept of Zakat and its role in helping society.",
    created_at: "2025-02-23T09:30:00",
    deadline: "2025-03-04T23:59:59",
  },
  {
    id: 5,
    image: "/images/hajj.jpg",
    question: "What is Hajj, and why is it a significant event in Islam?",
    created_at: "2025-02-24T14:45:00",
    deadline: "2025-03-05T23:59:59",
  },
];

export default function AssignmentPage() {
  const [submissions, setSubmissions] = useState({});
  const [files, setFiles] = useState({});
  const [expiredAssignments, setExpiredAssignments] = useState({});

  useEffect(() => {
    const expiredStatus = {};
    assignmentsData.forEach((assignment) => {
      expiredStatus[assignment.id] = dayjs().isAfter(dayjs(assignment.deadline));
    });
    setExpiredAssignments(expiredStatus);
  }, []);

  const handleFileChange = (id, event) => {
    const uploadedFile = event.target.files[0];
    setFiles((prev) => ({ ...prev, [id]: uploadedFile }));
  };

  const handleSubmit = (id) => {
    if (!files[id]) {
      alert("Please select a file before submitting.");
      return;
    }
    setSubmissions((prev) => ({
      ...prev,
      [id]: { fileName: files[id].name, uploadedAt: new Date() },
    }));
    alert(`Assignment ${id} submitted successfully!`);
  };

  const handleEdit = (id) => {
    setFiles((prev) => ({ ...prev, [id]: null }));
    setSubmissions((prev) => ({ ...prev, [id]: null }));
  };

  const content =  (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Islamic Studies Assignments</h1>

      {assignmentsData.map((assignment) => (
        <div key={assignment.id} className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Question {assignment.id}: {assignment.question}
          </h2>
          <img src={assignment.image} alt="Islamic Image" className="w-full h-40 object-cover rounded mb-3" />
        </div>
      ))}
    </div>
  );
  const submit = (
    <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">Assignment Submission</h3>

            {expiredAssignments[assignment.id] ? (
              <p className="text-red-600 font-bold mt-2">Assignment Expired</p>
            ) : submissions[assignment.id] ? (
              <div className="mt-4">
                <p className="text-green-600">✅ Submitted: {submissions[assignment.id].fileName}</p>
                <button
                  onClick={() => handleEdit(assignment.id)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Submission
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <input type="file" onChange={(e) => handleFileChange(assignment.id, e)} className="mb-2" />
                <button
                  onClick={() => handleSubmit(assignment.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Upload Assignment
                </button>
              </div>
            )}
          </div>
  )
  return (
    <div>
        {content}
        {submit}
    </div>
  )
}
