"use client";
import quizimage1  from './quizimage/quizimage1.png'
import quizimage2  from './quizimage/quizimage2.png'
import quizimage3  from './quizimage/quizimage3.png'
import quizimage4  from './quizimage/quizimage4.png'
import quizimage5  from './quizimage/quizimage5.png'
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Image from 'next/image';
import { FaUpload } from 'react-icons/fa';
import icon from './submission.jpg'
import Header from '../../components/Header';

const assignmentsData = [
  {
    id: 1,
    image: quizimage1,
    question: "What are the five pillars of Islam?",
    created_at: "2025-02-20T10:00:00",
    deadline: "2025-03-01T23:59:59",
  },
  {
    id: 2,
    image: quizimage2,
    question: "Explain the importance of Salah (prayer) in Islam.",
    created_at: "2025-02-21T12:00:00",
    deadline: "2025-03-02T23:59:59",
  },
  {
    id: 3,
    image: quizimage3,
    question: "Why is fasting (Sawm) during Ramadan important for Muslims?",
    created_at: "2025-02-22T15:00:00",
    deadline: "2025-03-03T23:59:59",
  },
  {
    id: 4,
    image: quizimage4,
    question: "Describe the concept of Zakat and its role in helping society.",
    created_at: "2025-02-23T09:30:00",
    deadline: "2025-03-04T23:59:59",
  },
  {
    id: 5,
    image: quizimage5,
    question: "What is Hajj, and why is it a significant event in Islam?",
    created_at: "2025-02-24T14:45:00",
    deadline: "2025-03-05T23:59:59",
  },
];

export default function AssignmentPage() {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const latestDeadline = assignmentsData.reduce((latest, assignment) => {
      return dayjs(assignment.deadline).isAfter(dayjs(latest)) ? assignment.deadline : latest;
    }, assignmentsData[0].deadline);

    setExpired(dayjs().isAfter(dayjs(latestDeadline)));
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }
    alert(`Assignment submitted successfully: ${file.name}`);
    setSubmitted(true);
  };

  const handleEdit = () => {
    setFile(null);
    setSubmitted(false);
  };

  const assignmentsubmit  = (
    <div className=" p-6 w-full">
      <div className="col-span-1 bg-gray-50 py-4 rounded border border-2 border-gray-200">
        <h3 className="text-lg font-semibold px-4">Assignment Submission</h3>
        <div className='w-full bg-gray-400 h-0.5 block my-5'></div>
        {expired ? ( 
          <p className="text-red-600 font-bold my-4  px-4 p-2 mx-4 rounded border border-2 border-gray-200">Assignment is closed for submission</p>
         ) : submitted ? (
          <>
            <p className="text-green-600 text-xl text-center">✅ Submitted: {file.name}</p>
            <button
              onClick={handleEdit}
              className="my-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600  mx-auto text-white rounded hover:bg-green-600 w-60 flex flex-col justify-center "
            >
              Edit Submission
            </button>
          </>
        ) : (
          <>
          <label className="mt-2 flex items-center text-center mx-6 flex-row justify-center cursor-pointer bg-gray-200 p-2 rounded-lg ">
            <FaUpload className="text-gray-700 mr-2" />
            <span className="text-black font-bold ">Choose File</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
         {file && <p className="my-4 text-center text-gray-700 font-semibold">Selected File: {file.name}</p>}
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-green-500 mx-auto text-white rounded hover:bg-green-600 w-60 flex flex-col justify-center"
          >
            Submit Assignment
          </button>
        </>
        )} 
      </div>
     </div>

  );

  const content = (
    <div>
      
    <div className="grid grid-cols-3 gap-3">
      {/* Assignments List */}
      <div className="col-span-2 bg-gray-50 p-4 sm:w-96 w-72 rounded-lg border border-2 border-gray-200 shadow-lg">
      <div className="flex flex-row p-4 gap-4 rounded-lg shadow-sm mb-6">
      <Image src={icon} alt='icon' className='w-14 h-14' />
      <div>
    <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">Islamic Studies Assignments</h1>
    <p className='text-xs'>created 2 month ago - by <span className='text-green-500'>Hafiza Abdul-Allah</span></p>
    <div className=''>
        {assignmentsData.map((assignment) => (
          <div key={assignment.id} className=" px-4 mt-2 mb-6 border-t-0 border-b-0 border-2 border-gray-300 border border-r-0 ">
            <h2 className="text-sm font-bold my-3 text-gray-800 font-semibold text-gray-800 mb-2">
              Question {assignment.id}
            </h2>
            <Image src={assignment.image} alt="Islamic Image" className="w-full h-60 object-cover rounded mb-3" />
            <p className="font-bold  text-gray-800">{assignment.question}</p>
            <p className='text-gray-700 mb-2 text-xs'>Deadline: {assignment.deadline}</p>
          </div>
        ))}
      </div>
      </div>
      </div>
      </div>
    </div>
    </div>
  )

  return(
    <div>
      <Header />
    <div className="flex flex-row justify-around flex-wrap sm:flex-nowrap px-3 py-6">
      {content}
      {assignmentsubmit}
    </div>
  </div>
  )
}
