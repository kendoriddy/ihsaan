import { Clock } from "lucide-react";

export default function CourseDescription() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Begin Your DevOps Career As a Newbie | AWS, Linux, Scripting, Jenkins,
        Ansible, GitOps, Docker, Kubernetes, & Terraform.
      </h1>

      <div className="flex items-center mb-4">
        <div className="flex items-center mr-6">
          <span className="text-amber-500 font-bold mr-1">4.6</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 text-amber-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">(37,503 ratings)</span>
        </div>

        <div className="text-sm text-gray-600 mr-6">
          <span className="font-bold text-black">224,784</span> Students
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>
            <span className="font-bold text-black">53.5</span> hours total
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600 flex items-center">
        <span>Last updated May 2025</span>
      </div>
    </div>
  );
}
