"use client"
import React, { useState } from "react";
import DashboardSidebar from '../../components/DashboardSidebar'
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { usePathname } from "next/navigation";
const quizQuestions = [
  { question: "What is the first pillar of Islam?", options: ["Salah", "Zakat", "Shahada", "Sawm"], correctAnswer: "Shahada", name:'Question 1' },
  { question: "How many times do Muslims pray in a day?", options: ["3", "5", "7", "10"], correctAnswer: "5",name:'Question 2' },
  { question: "What is the holy book of Islam?", options: ["Torah", "Bible", "Quran", "Vedas"], correctAnswer: "Quran", name:'Question 3' },
  { question: "In which month do Muslims fast?", options: ["Muharram", "Rajab", "Ramadan", "Shawwal"], correctAnswer: "Ramadan", name:'Question 4' },
  { question: "What is the direction of prayer for Muslims?", options: ["West", "East", "Kaaba", "North"], correctAnswer: "Kaaba", name:'Question 5' },
  { question: "Who is the last prophet in Islam?", options: ["Moses", "Jesus", "Muhammad", "Abraham"], correctAnswer: "Muhammad", name:'Question 6' },
  { question: "What is the night journey of Prophet Muhammad called?", options: ["Hajj", "Isra and Miraj", "Jihad", "Umrah"], correctAnswer: "Isra and Miraj", name:'Question 7' },
  { question: "How many chapters are in the Quran?", options: ["114", "120", "99", "132"], correctAnswer: "114", name:'Question 8' },
  { question: "What is the term for giving charity in Islam?", options: ["Hajj", "Zakat", "Fitrah", "Sawm"], correctAnswer: "Zakat", name:'Question 9' },
  { question: "Which angel brought revelation to Prophet Muhammad?", options: ["Mikail", "Israfil", "Jibril", "Azrael"], correctAnswer: "Jibril",name:'Question 10' },
  { question: "What is the Islamic term for pilgrimage?", options: ["Hajj", "Umrah", "Tawaf", "Ziyarat"], correctAnswer: "Hajj", name:'Question 11' },
  { question: "What is the name of the first wife of Prophet Muhammad?", options: ["Aisha", "Fatima", "Hafsa", "Khadija"], correctAnswer: "Khadija",name:'Question 12' },
  { question: "What is the first word revealed in the Quran?", options: ["Pray", "Iqra", "Islam", "Allah"], correctAnswer: "Iqra",name:'Question 13' },
  { question: "What is the name of the Islamic call to prayer?", options: ["Takbir", "Azan", "Iqama", "Dua"], correctAnswer: "Azan",name:'Question 14' },
  { question: "What is the significance of Laylatul Qadr?", options: ["The first day of Hajj", "The night of power", "Prophet's birthday", "Start of Ramadan"], correctAnswer: "The night of power",name:'Question 15' },
  { question: "How many years did Prophet Muhammad preach in Mecca?", options: ["13", "10", "20", "15"], correctAnswer: "13",name:'Question 16' },
  { question: "What is the Islamic term for permissible food?", options: ["Haram", "Halal", "Makruh", "Sunnah"], correctAnswer: "Halal", name:'Question 17' },
  { question: "What is the main language of the Quran?", options: ["Urdu", "Arabic", "Persian", "Hebrew"], correctAnswer: "Arabic",name:'Question 18' },
  { question: "Who was the first caliph after Prophet Muhammad?", options: ["Umar", "Ali", "Abu Bakr", "Uthman"], correctAnswer: "Abu Bakr",name:'Question 19' },
  { question: "Who is the first messenger of Allah?", options: ["Nuh", "Muhammad", "Isaa", "Musa"], correctAnswer: "Nuh",name:'Question 20' }

];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill([]));

  const handleAnswer = (event) => {
    const value = event.target.value;
    const newAnswers = [...answers];
    
    if (newAnswers[currentQuestion].includes(value)) {
      newAnswers[currentQuestion] = newAnswers[currentQuestion].filter(ans => ans !== value);
    } else {
      newAnswers[currentQuestion] = [value]; // Ensures only one selection per question
    }
    
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const pendingQuestions = answers.filter(answer => answer.length === 0).length;
  const currentRoute = usePathname();

  const content = (
    <div className="flex justify-around items-center sm:flex-wrap bg-gray-100 p-4">
   
    <div className="max-w-4xl sm:w-8/12 bg-gray-100 p-4">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-row justify-center mb-8 items-center">
        <div className="flex flex-col border rounded-l w-24 p-3 text-center items-center border-2 border-black font-bold uppercase">
            <p>{quizQuestions.length}</p>
            <p>Total</p>
        </div>
        <div className="flex flex-col w-24  text-green-700 border-2 border-l-0 border-black shadow-xl p-3 text-center items-center font-bold uppercase">
            <p> {currentQuestion + 1}</p>
            <p>Answered</p>
        </div>
        <div className="flex flex-col w-24 text-red-600 rounded-r border-l-0 border-2 border-black shadow-xl p-3 text-center items-center  font-bold uppercase">
            <p>{pendingQuestions - 1}</p>
            <p>Pending</p>
        </div>
        </div>
        <div>
            <div className="flex flex-row mb-10 justify-between items-center">
                <h1 className="font-bold text-2xl uppercase">{quizQuestions[currentQuestion].name}</h1>
                <div className="border border-2 border-green-500 rounded-lg p-2 text-center uppercase">
                    <p className="font-bold">Time Left</p>
                    <p>25:02</p>
                </div>
            </div>
        </div>
        <p className="text-lg text-gray-700 mb-4">{quizQuestions[currentQuestion].question}</p>
        <div className="space-y-2">
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <label key={index} className="flex items-center my-3 space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name={`quiz-${currentQuestion}`}
                value={option}
                checked={answers[currentQuestion].includes(option)}
                onChange={handleAnswer}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            // onClick={prevQuestion}

          >
            Submit
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            onClick={nextQuestion}
            disabled={currentQuestion === quizQuestions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    <div className="sm:w-1/4 bg-white shadow-lg rounded-2xl p-4 mr-6 ">
    <h2 className="text-xl font-bold mb-4">Quiz Questions</h2>
    <div className="bg-white rounded-lg p-4 flex h-60 sm:h-96 scroll-wi rounded-lg overflow-hidden scrollb  scroll-p-0 scroll-smooth scrollbar scrollbar-thin scrollbar-thumb-blue-300  sm:scrollbar-track-black scrollbar-track-thin my-2 gap-3">
    <ul>
      {quizQuestions.map((q, index) => (
        <li
          key={index}
          className={`p-2 cursor-pointer ${index === currentQuestion ? "bg-blue-500 text-white w-20" : "bg-gray-200"} rounded-md mb-2 w-72`}
          onClick={() => setCurrentQuestion(index)}
        >
          {q.name}
        </li>
      ))}
    </ul>
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
        <div className="w-3/4 p-4">
          {content}
        </div>
      </div>
     
    </div>
  );
  
};

export default Quiz;