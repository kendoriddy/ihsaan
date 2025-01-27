"use client"
import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
//import './StarRating.css'; // Add your own styles if needed

const StarRating = () => {
  const [rating, setRating] = useState(4);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <div className="star-container">
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          //className={`star ${index <= rating ? 'active-star' : ''} `}
          className={`${index <= rating ? 'text-yellow-500' : 'text-slate-400'} text-base`}
          onClick={() => handleStarClick(index)}
        >
          <StarIcon />
        </span>
      ))}
    </div>
  );
};

export default StarRating