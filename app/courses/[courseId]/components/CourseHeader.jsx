import { ChevronDown, Share2, MoreVertical, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/constants";

const CourseHeader = ({ title, programmeName }) => {
  return (
    <div className="flex items-center justify-between w-full bg-primary text-white px-4 py-2">
      <div className="flex items-center">
        <Link
          href="/courses/my-courses"
          className="mr-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Image
          src={IMAGES.logo2}
          alt="Ihsaan"
          width={80}
          height={30}
          className="mr-4"
        />
        <h1 className="text-sm md:text-base font-medium truncate mr-4">
          {title || "Course Title"}
        </h1>
        {programmeName && (
          <h3 className="text-sm text-gray-300 mt-1">
            Programme: {programmeName}
          </h3>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Image
            src={IMAGES.logo2}
            alt="User"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="hidden md:inline-block ml-2 text-sm">
            Your progress
          </span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </div>
        <button className="hidden md:flex items-center border border-white rounded px-3 py-1 text-sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </button>
        <button className="p-1">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CourseHeader;
