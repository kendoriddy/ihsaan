"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import http from "../../../hooks/axios/axios";
import EditQuestion from './EditQuiz'
import EditQuestionPatch from './EditPatchQuiz'
import DeleteQuestion from './DeleteQuiz'

const QuizDetail = ({ params }) => {
  const router = useRouter();
  const { id } = params; // Get quiz ID from URL

  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewEditPut , setViewEditPut] = useState(false)
  const [viewEditPatch , setViewEditPatch] = useState(false)
  const [viewEditDelete , setViewEditDelete] = useState(false)

  useEffect(() => {
    if (id) fetchQuestion(id);
  }, [id]);

  const fetchQuestion = async (questionId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await http.get(`/assessment/mcquestions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert("Please select an answer!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await http.post(
        "/assessment/mcquestions/submit-answers/",
        { question_id: id, selected_option: selectedOption },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Answer submitted successfully!");
      router.push("/quiz"); // Redirect to quiz list after submitting
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Try again.");
    }
  };

  const handleViewPut = () =>{
    setViewEditPut(!viewEditPut)
  }
  const handleViewPatch = () =>{
    setViewEditPatch(!viewEditPatch)
  }
  const handleViewDelete = () =>{
    setViewEditDelete(!viewEditDelete)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      {loading ? (
        <p className="loading"></p>
      ) : question ? (
        <div className="border p-6 shadow-lg rounded-lg">
          <h1 className="sm:text-xl text-lg font-bold">{question.question_text}</h1>
          <div className="mt-4">
            {question.options &&
              Object.entries(question.options).map(([key, option]) => (
                <label key={key} className="block my-2 cursor-pointer">
                  <input
                    type="radio"
                    name="answer"
                    value={key}
                    checked={selectedOption === key}
                    onChange={() => setSelectedOption(key)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
          </div>
          <button
            onClick={handleSubmit}
            
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-green-600"
          >
           {loading ? <p className="loading"></p> : "Submit Answer"} 
          </button>
          <div className="flex gap-12 items-center my-10">
        <button title="Edit Put" onClick={handleViewPut}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 rounded-full bg-gray-200 p-1">
      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
    </button>
    <button title="Edit Patch" onClick={handleViewPatch}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 rounded-full bg-gray-200 p-1">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
    </button>
    <button title="Delete" onClick={handleViewDelete}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 rounded-full bg-gray-200 p-1">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>

    </button>
      </div>
        </div>
      ) : (
        <p className="text-center font-bold ">Question not found.</p>
      )}
      
      <div>{
        question && (
        <>
       <div className={`fixed trans top-0 flex justify-center items-center right-0 w-full h-full ${viewEditPut ? "block" : 'hidden'}`}>
            <EditQuestion questionId={question.id} handleViewPut={handleViewPut} />
        </div>
        <div className={`fixed trans top-0 flex justify-center items-center right-0 w-full h-full ${viewEditPatch ? "block" : 'hidden'}`}>
            <EditQuestionPatch questionId={question.id} handleViewPatch={handleViewPatch} />
        </div>
         
        <div className={`fixed trans top-0 flex justify-center items-center right-0 w-full h-full ${viewEditDelete ? "block" : 'hidden'}`}>
            <DeleteQuestion questionId={question.id} handleViewDelete={handleViewDelete} />
        </div>
        </>
      )
        }
      </div>
    </div>
  );
};

export default QuizDetail;
