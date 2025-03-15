"use client";
import Button from "@/components/Button";
import { useFetch } from "@/hooks/useHttp/useHttp";
import { useState } from "react";

const QuizList = ({ setCurrentScreen }) => {
  const [fetchAll, setFetchAll] = useState(false);
  const [totalCourses, setTotalCourses] = useState(10);

  const {
    isLoading,
    data: CoursesList,
    isFetching,
    refetch,
  } = useFetch(
    "questions",
    `https://ihsaanlms.onrender.com/course/courses/?page_size=${
      fetchAll ? totalCourses : 10
    }`,
    (data) => {
      if (data?.total && !fetchAll) {
        setTotalCourses(data.total);
        setFetchAll(true);
        refetch();
      }
    }
  );

  const Courses = CoursesList && CoursesList?.data?.results;
  console.log("courses", Courses);

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-semibold mb-6">Courses List</h2>
      {!Courses && (
        <p className="py-8 font-bold text-lg animate-pulse">
          Loading courses...
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Courses &&
          Courses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-300 rounded-md p-4 flex flex-col items-center justify-between shadow-sm"
            >
              <div className="text-center">
                <h3 className="text-lg font-medium">{course.code}</h3>
                <p className="text-sm text-gray-500">Tutor: {course.name}</p>
              </div>
              <Button
                onClick={() => {
                  localStorage.setItem("selectedCourse", course.id);
                  setCurrentScreen("instructions");
                }}
                className="mt-4 px-10 py-2"
                size="large"
                color="secondary"
              >
                Take Quiz
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default QuizList;
