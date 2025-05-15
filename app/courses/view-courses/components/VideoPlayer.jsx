import { Play } from "lucide-react";

export default function VideoPlayer() {
  return (
    <div className="relative w-full bg-gradient-to-r from-cyan-800 to-purple-900 aspect-video flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            DECODING DEVOPS
          </h2>
          <div className="w-full h-0.5 bg-cyan-400 mb-2"></div>
        </div>
      </div>
      <button className="relative z-10 bg-black bg-opacity-50 rounded-full p-5 hover:bg-opacity-70 transition-all">
        <Play className="h-10 w-10 text-white fill-white" />
      </button>
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-70">
        Ihsaan
      </div>
    </div>
  );
}
