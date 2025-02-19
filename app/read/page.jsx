"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Header from "../../components/Header";
import DashboardSidebar from "../../components/DashboardSidebar";

const QuizInstructions = () => {

  const currentRoute = usePathname();

  const content = (
    <div className="flex items-center justify-center min-h-screen  py-4">
      <div className="max-w-xl mx-auto w-full bg-gray-100 -mt-16 shadow-2xl lg:-translate-x-10 md:translate-x-0 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Read Carefully</h2>
        <ul className="list-decimal list-inside space-y-3 text-gray-700 font-bold">
          <li>This quiz consists of 20 multiple-choice questions.</li>
          <li>Each question has four answer options; select the most correct one.</li>
          <li>You can only answer one question at a time.</li>
          <li>Use the "Next" and "Previous" buttons to navigate.</li>
          <li>Once answered, you cannot change your response.</li>
          <li>Unanswered questions will be marked as pending.</li>
          <li>There is no time limit, so read each question carefully.</li>
          <li>Your progress will be shown with answered and pending questions.</li>
          <li>This quiz is for educational purposes only.</li>
          <li>Click "Submit" after completing all questions to finalize responses.</li>
        </ul>
        <div className="flex justify-center mt-6">
          <Link href={'/startquiz'}>
          <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Start Quiz
          </button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="flex mt-0">
        {/* Sidebar */}
        <div className="w-1/4">
          <DashboardSidebar currentRoute={currentRoute} />
        </div>
        
        {/* Main Content */}
        <div className="w-3/4">
          {content}
        </div>
      </div>
     
    </div>
  );
};

export default QuizInstructions;
