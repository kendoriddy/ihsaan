"use client"

import Header from "../../components/Header";
import Image from "next/image";
import { quizs } from "./data/DataQuiz";
import Link from "next/link";
import DashboardSidebar from '../../components/DashboardSidebar';
import { usePathname } from 'next/navigation';

export default function QuizPage (){


    const currentRoute = usePathname();


  const content =(
    <div className="max-w-7xl mx-auto p-6 lg:-translate-x-5 md:translate-x-0">
        <h1 className="text-2xl text-center mb-5 font-bold">Quiz List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        {
            quizs.map((quiz) => (

                <div className="border border-2 border-gray-100 p-4 hover:scale-105 mb-5 rounded-lg shadow-xl">
                    <p className="text-center text-xl">{quiz.title}</p>
                    <div className="w-full h-0.5 bg-gray-400 block my-1"></div>
                    <p className="font-bold text-xl my-3">Tutor: <span className="text-sm">{quiz.tutor}</span></p>
                    <Image src={quiz.image} alt='quiz' className="h-80" />
                    <Link href={`/read`} className="mx-auto text-center">
                    <button className="mx-auto w-40 flex items-center justify-center mt-5 sec text-center bg-blue-600 p-2 rounded  text-white hover:bg-green-600 ">{quiz.button}</button>
                    </Link>
                </div>
            ))
        }
      </div>
</div>
    );
  

    return (
        <div>
          <Header />
          <div className="flex mt-20">
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
}

