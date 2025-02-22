import quizimage5  from '../submit/quizimage/quizimage6.png'
import icon from './submission.jpg'
import React from "react";
import Header from '../../components/Header';
import Image from "next/image";
const AssignmentSubmission = () => {
  const content = (
    <div className=" mx-auto p-6 flex-wrap flex flex-row gap-4 lg:flex-nowrap rounded-lg">
      {/* Assignment Details */}
      <div className="flex flex-row p-4 gap-4    rounded-lg sm:w-5/12 border border-2 border-gray-200 shadow-sm mb-6">
        <Image src={icon} alt='icon' className='w-14 h-14' />
      <div className="bg-white ">
        <h2 className="text-xl font-semibold text-gray-800">Individual - BUAD 811</h2>
        <p className="text-gray-600 text-sm mt-1">Created 6 months ago - by <span className="text-blue-500">Muhammad Maryam</span></p>
        <p className="mt-2 text-gray-700">
          Identify five (5) financial instruments that are traded on the stock exchange and discuss each of these instruments.
        </p>
        <div className="mt-3 text-gray-700">
          <div className="flex flex-row flex-wrap gap-2 sm:gap-0 whitespace-nowrap mb-3">
          <span className="bg-gray-200 px-3 text-xs py-1 rounded-md mr-2">Start: 2024-08-07 08:30:00</span>
          <span className="bg-gray-200 px-3 py-1 text-xs rounded-md mr-2">End: 2024-09-23 06:30:00</span>
          </div>
          <span className="bg-gray-200 px-3 text-xs mt-5 py-1 rounded-md">Mark Obtainable: 15.00</span>
        </div>
      </div>
      </div>

      {/* Submission & Comments */}
      <div className='rounded-lg shadow-sm border border-2 border-gray-200'>
      <h3 className="text-lg font-semibold p-4"> Submission and Comments</h3>
      <div className='w-full bg-gray-400 h-0.5 block mb-5'></div>
      <div className="bg-white p-4 ">

        <div className="bg-blue-100 text-blue-800 p-3 rounded mb-4 font-semibold">
          ⭐ You scored 12.00 out of 15.00 marks.
        </div>
        <div className="flex items-start space-x-4 border border-2 border-gray-200 p-4">
          <Image
            src={quizimage5}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="text-md font-semibold">OLADITAN SALIU</h3>
            <p className="text-gray-500 text-sm">6 months ago</p>
            <p className="mt-2 text-gray-700 text-sm">
              AN INDIVIDUAL ASSIGNMENT OF THE COURSE FINANCIAL SYSTEM AND BANK MANAGEMENT (BUAD 811) <br />
              SUBMITTED BY <br />
              OLADITAN SALIU OLAMILEKAN <br />
              19TH AUGUST, 2024
            </p>
            <div className="flex flex-row sm:gap-5 gap-2 items-center">
            <button className=" mt-3 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sm:size-5 size-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
            </button>
            <button className="inline-flex items-center sm:text-sm text-xs gap-2 mt-3 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sm:size-4 size-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
        </svg>

            Preview
            </button>
            </div>
            </div>
        </div>
        <p className="mt-4 text-gray-600 text-sm border border-2 border-gray-200 text-blue-800 p-3 rounded mb-4">Assignment is closed for submission</p>
      </div>
      </div>
    </div>
  );
  return (
    <div>
      <Header />
      {content}
    </div>
  )
};

export default AssignmentSubmission;
