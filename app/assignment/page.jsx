"use client";
import { Button } from "@mui/material";
import { useState } from "react";
import { Home, FileText, BookOpen, ClipboardList, LayoutDashboard, MoreHorizontal } from 'lucide-react'

// Function to generate random status
const getRandomStatus = () => {
  const statuses = ["Submitted", "Started", "Pending"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Sample data for 20 assignments
const assignments = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: i % 2 === 0 ? "Individual" : "Group",
  tutor: i % 2 === 0 ? "Sheikh Qamoruddeen" : "Sheikh Sharafudden",
  course: `Course ${i + 1}`,
  type: i % 2 === 0 ? "Individual" : "Group",
  mark: `${Math.floor(Math.random() * 20)}.00`,
  status: getRandomStatus(),
  start: `19/08/24 0${i % 10}:30:00`,
  end: `24/09/24 00:00:00`,
  created: `${Math.floor(Math.random() * 12)} months ago`,
  file: "——",
  view: "View",
}));

export default function AssignmentTable() {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);

  // Filter assignments based on search input
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(search.toLowerCase()) ||
      assignment.tutor.toLowerCase().includes(search.toLowerCase()) ||
      assignment.course.toLowerCase().includes(search.toLowerCase())
  );


  const header = (
    <div className='bg-gray-50 shadow-sm py-2 px-6 flex items-center justify-between'>
        <div className='flex gap-8'>
            <div className="flex-col text-blue-400 font-bold flex items-center justify-center">
            <Button variant='link' className='text-lg'><ClipboardList/> </Button>
            <p className="text-sm text-blue-400">Quiz</p>
            </div>
            <div className="flex-col flex font-bold text-blue-400 items-center justify-center">
            <Button variant='link' className='text-lg'><BookOpen className='' /></Button>
            <p className="text-sm">Assignment</p>
            </div>
        </div>
    </div>
  )

  const content =  (
    <div className="p-4">
      {/* Entries Selection and Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <label className="flex items-center">
          Show
          <select
            className="border mx-2 p-1"
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          entries
        </label>
        <input
          type="text"
          placeholder="Search..."
          className="border p-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Tutor</th>
            <th className="border p-2">Course</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Mark</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Created</th>
            <th className="border p-2">File</th>
            <th className="border p-2">View</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.slice(0, entries).map((assignment) => (
            <tr key={assignment.id} className="text-center">
              <td className="border p-2">{assignment.title}</td>
              <td className="border p-2">{assignment.tutor}</td>
              <td className="border p-2">{assignment.course}</td>
              <td className="border p-2">{assignment.type}</td>
              <td className="border p-2">{assignment.mark}</td>
              <td
                className={`border px-2 py-1 h-3 ${
                  assignment.status === "Submitted"
                    ? "text-white bg-green-500 h-3"
                    : assignment.status === "Started"
                    ? "bg-yellow-600 text-white h-3"
                    : "bg-red-600 text-white h-3"
                }`}
              >
                {assignment.status}
              </td>
              <td className="border p-2">{assignment.start}</td>
              <td className="border p-2">{assignment.end}</td>
              <td className="border p-2">{assignment.created}</td>
              <td className="border p-2">{assignment.file}</td>
              <td className="border p-2 text-blue-500 cursor-pointer">
                {assignment.view}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return(
    <div>
        {header}

        <p className="ml-10 my-4">All Assignment</p>
        
    <div className='text-gray-600 bg-gray-100 p-2 shadow-sm text-sm my-3'>
        <span className='text-blue-600 cursor-pointer my-3'>Home</span> / <span className='font-semibold'>Assignment</span>
    </div>
<div className='bg-gray-100 flex flex-col justify-center items-center text-black py-3 rounded-md'>
        <h2 className='text-2xl font-bold mb-2'>Assignment List</h2>
        <p className=' mb-6'>See the list of all your assignment(s)</p>
    </div>
        {content}
    </div>
  )
}
