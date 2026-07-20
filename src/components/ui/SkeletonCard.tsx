import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E1E4EA] overflow-hidden shadow-sm flex flex-col justify-between h-[360px] animate-pulse">
      {/* Visual Placeholder */}
      <div className="bg-[#F1F3F6] h-40 w-full" />

      {/* Content Placeholders */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <div className="h-4 bg-[#F1F3F6] rounded-md w-3/4" />
          {/* Desc Line 1 */}
          <div className="h-3 bg-[#F1F3F6] rounded-md w-full" />
          {/* Desc Line 2 */}
          <div className="h-3 bg-[#F1F3F6] rounded-md w-5/6" />
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center">
          <div className="h-3 bg-[#F1F3F6] rounded-md w-1/4" />
          <div className="h-3 bg-[#F1F3F6] rounded-md w-1/3" />
        </div>
      </div>

      {/* Button Placeholder */}
      <div className="p-4 pt-0">
        <div className="h-8 bg-[#F1F3F6] rounded-lg w-full" />
      </div>
    </div>
  );
}
