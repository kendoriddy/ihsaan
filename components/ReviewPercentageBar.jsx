import React from "react";
import Rating from "@mui/material/Rating";

function ReviewPercentageBar({ percentage, stars, active }) {
  const color = active ? "bg-primary" : "bg-gray-400";
  return (
    <div className="flex items-center gap-4 pr-8 ">
      <div className="flex-1 ">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Rating
          name="half-rating-read"
          defaultValue={stars}
          precision={0.5}
          size="small"
          readOnly
        />
        <div className="w-6">
          {percentage}
          <span>%</span>{" "}
        </div>
      </div>
    </div>
  );
}

export default ReviewPercentageBar;
