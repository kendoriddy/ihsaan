import { Task } from "@mui/icons-material";
import { COUNSELLORS } from "@/constants";
import { useRouter } from "next/navigation";

const Councellor = () => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`/counsellors/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Councellors</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COUNSELLORS.map((mentor) => (
          <div
            key={mentor.id}
            onClick={() => handleCardClick(mentor.id)}
            className="cursor-pointer bg-white rounded-lg shadow-lg p-4 relative"
          >
            {/* Mentor Image */}
            <div className="h-32 rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <img
                src={mentor.image.src}
                alt={mentor.name}
                className="w-16 h-16 rounded-full border-4 border-white absolute top-[110px]"
              />
            </div>

            {/* Mentor Info */}
            <div className="text-center mt-8">
              <h2 className="font-bold text-lg">{mentor.name}</h2>
              <p className="text-gray-600">{mentor.role}</p>
              <p className="text-gray-500 text-sm mt-2">{mentor.description}</p>
            </div>

            {/* Follow button */}
            <button className="absolute top-6 right-6 bg-white border rounded-full px-3 py-1 text-sm text-blue-600 shadow">
              + Follow
            </button>

            {/* Stats */}
            <div className="flex justify-between items-center mt-4 text-gray-600 text-sm border-t pt-2">
              <div className="flex items-center">
                <span className="material-icons text-blue-500">
                  <Task />
                </span>
                <span className="ml-1">{mentor.profileCompletionRate}% profile</span>
              </div>
              <div className="flex items-center">
                <span className="material-icons text-yellow-500">Ratings</span>
                <span className="ml-1">{mentor.rating}/5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Councellor;
