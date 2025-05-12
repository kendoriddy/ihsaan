import React from "react";

const CoursesList = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses?.results?.map((courseObj) => {
        const { id, course_details } = courseObj;
        const { code, title, programme_name, image_url } = course_details;

        return (
          <div key={id} className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-1">{title}</h2>
            <p className="text-sm text-gray-500 mb-1">{programme_name}</p>
            <p className="text-sm text-gray-600 mb-2">{code}</p>
            {image_url ? (
              <img
                src={image_url}
                alt={title}
                className="mb-2 w-full h-40 object-cover rounded"
              />
            ) : (
              <div className="mb-2 w-full h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                No Image Available
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CoursesList;
