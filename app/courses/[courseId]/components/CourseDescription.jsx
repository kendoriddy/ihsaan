import { Clock, Users } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "Not available";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid date";
  }
};

const CourseDescription = ({
  title,
  description,
  enrolledUsersCount,
  updatedAt,
}) => {
  return (
    <div className="pt-2 pb-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm text-gray-600">
        {typeof enrolledUsersCount === "number" && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="font-medium text-gray-800">
              {enrolledUsersCount}
            </span>
            <span className="ml-1">students</span>
          </div>
        )}
        {updatedAt && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
            <span>Last updated: {formatDate(updatedAt)}</span>
          </div>
        )}
      </div>

      <div className="mt-2 py-4 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          About This Course: {title || ""}
        </h2>
        {description ? (
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        ) : (
          <p className="text-gray-600 italic">
            No description available for this course.
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseDescription;
