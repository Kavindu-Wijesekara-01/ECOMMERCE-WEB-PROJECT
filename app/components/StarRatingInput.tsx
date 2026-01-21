"use client";

import { useState } from "react";

export default function StarRatingInput() {
  // වෙනස 1: මුලින්ම rating එක 0 (කිසිම තරුවක් පාට වෙලා නෑ)
  const [rating, setRating] = useState(0); 
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col gap-1">
      {/* Form එක Submit වෙද්දි අගයක් යවන්න ඕන නිසා hidden input එකක් */}
      {/* rating 0 නම් (තෝරලා නැත්නම්), backend එකට යවද්දි ප්‍රශ්නයක් නොවෙන්න default 5 යවන්න පුළුවන්, නැත්නම් user ට තෝරන්න කියන්න validation දාන්න ඕන. */}
      {/* දැනට අපි rating එක යවනවා. Backend එකේ validation බලාගනීවි */}
      <input type="hidden" name="rating" value={rating || 5} /> 

      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          
          return (
            <button
              key={index}
              type="button"
              className="text-2xl focus:outline-none transition-transform hover:scale-110"
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              <span
                className={`${
                  // Logic: Hover කරන අගය හෝ Click කරපු අගයට වඩා අඩු හෝ සමාන නම් Orange, නැත්නම් Gray
                  ratingValue <= (hover || rating)
                    ? "text-orange-500 drop-shadow-sm" 
                    : "text-gray-300"
                } transition-colors duration-200`}
              >
                ★
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Rating එක අනුව Text එක වෙනස් වීම */}
      <p className="text-xs text-slate-500 font-medium ml-1 h-4">
        {(hover || rating) === 0 && "Select a rating"}
        {(hover || rating) === 1 && "Very Bad"}
        {(hover || rating) === 2 && "Poor"}
        {(hover || rating) === 3 && "Average"}
        {(hover || rating) === 4 && "Good"}
        {(hover || rating) === 5 && "Excellent"}
      </p>
    </div>
  );
}