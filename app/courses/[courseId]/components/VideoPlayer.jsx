import { Play } from "lucide-react";

const VideoPlayer = ({ videoUrl, title }) => {
  return (
    <div className="bg-black rounded-lg shadow-xl overflow-hidden mb-6">
      {videoUrl ? (
        <video
          key={videoUrl}
          controls
          className="w-full h-auto"
          style={{ maxHeight: "70vh" }}
          autoPlay
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-96 flex items-center justify-center bg-gray-200 text-gray-500">
          <p>Select a video from the course content to play.</p>
        </div>
      )}
      {title && (
        <div className="p-4 bg-gray-700 text-white">
          <h2 className="text-xl font-semibold truncate">{title}</h2>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
