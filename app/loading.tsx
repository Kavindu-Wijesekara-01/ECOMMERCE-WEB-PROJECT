import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col h-screen w-full items-center justify-center bg-[#0f172a] gap-2">
      
      {/*--- Animation Ring ---*/}
      <div className="relative flex items-center justify-center">
        {/* Pulse Effect Ring */}
        <div className="absolute -inset-4 rounded-full border-2 border-orange-500/30 animate-pulse"></div>
        
        {/* Spinning Ring */}
        <div className="h-24 w-24 animate-spin rounded-full border-[4px] border-orange-500 border-t-transparent"></div>
      </div>

      {/*--- Text Section ---*/}
      <div className="mt-8 flex flex-col items-center">
        {/* SPECIAL STYLING:
            text-white -> අකුරු සුදු පාටයි
            [-webkit-text-stroke:2px_#f97316] -> මේකෙන් තමයි වටේට Orange ඉරක් අඳින්නේ
        */}
        <h1 className="text-2xl font-extrabold tracking-wider text-white ">
          PC Solution
        </h1>
      </div>

      <p className="text-xs font-medium tracking-[0.3em] text-slate-500 animate-pulse mt-2">
        LOADING...
      </p>
    </div>
  );
}