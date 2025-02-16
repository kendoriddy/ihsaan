import { MENTORS } from "@/constants";

function ProfileCompletionRate() {
  return (
    <div>
      <div>
        {MENTORS[0].profileCompletionRate === 100
          ? "Proile completed"
          : "Complete your profile"}
      </div>
      <div className="bg-gray-500 h-4 w-full rounded-md overflow-hidden">
        <div
          style={{
            height: "100%",
            width: `${MENTORS[0].profileCompletionRate}%`,
            backgroundColor: "rgb(243, 65, 3)",
          }}></div>
      </div>
    </div>
  );
}

export default ProfileCompletionRate;
