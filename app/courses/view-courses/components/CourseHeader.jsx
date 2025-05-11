import { ChevronDown, Share2, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function CourseHeader() {
  return (
    <div className="flex items-center justify-between w-full bg-black text-white px-4 py-2">
      <div className="flex items-center">
        <Image
          src="/placeholder.svg?height=30&width=80"
          alt="Udemy"
          width={80}
          height={30}
          className="mr-4"
        />
        <h1 className="text-sm md:text-base font-medium truncate">
          DevOps Beginners to Advanced with Projects
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Image
            src="/placeholder.svg?height=32&width=32"
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
}
