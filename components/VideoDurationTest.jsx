// Test component for video duration extraction
// This is just for testing purposes and can be removed after verification

import React, { useState } from "react";
import {
  getVideoDuration,
  formatDurationFromSeconds,
} from "@/utils/utilFunctions";

const VideoDurationTest = () => {
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const durationInSeconds = await getVideoDuration(file);
      const formattedDuration = formatDurationFromSeconds(durationInSeconds);
      setDuration(formattedDuration);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-4">Video Duration Test</h3>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {loading && <p>Extracting duration...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {duration && <p className="text-green-600">Duration: {duration}</p>}
    </div>
  );
};

export default VideoDurationTest;
