// NEW DESIGN FOR STREAK COUNTER
// 'use client';
// import React from "react";
// import { Flame } from "lucide-react";

// const StreakCounter = ({ streak = 0 }) => {
//   return (
//     <div className="glass p-4 rounded-xl flex items-center gap-4 mb-8">
//       <Flame className="text-red-500 h-8 w-8" />
//       <div>
//         <h2 className="text-lg font-semibold">Current Streak</h2>
//         <p className="text-2xl font-bold text-yellow-400">{streak} days</p>
//       </div>
//     </div>
//   );
// };

// export default StreakCounter;


'use client';
import React from "react";
import { Flame } from "lucide-react";


const StreakCounter = ({ streak = 0 }) => {
  return (
    <div className="bg-transparent rounded-xl p-2 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2 font-sprintura">
          {/* <Activity className="h-5 w-5 text-purple-light" /> */}
          <Flame className="text-purple-light h-8 w-8" />
          Current Streak
        </h2>
      </div>

      {/* Streak Circle */}
      <div className="flex items-center justify-center py-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-purple blur-2xl opacity-20 animate-pulse-glow"></div>
          <div className="relative glass-dark rounded-full w-24 h-24 flex items-center justify-center border-2 border-purple">
            <span className="text-3xl font-bold">{streak}</span>
          </div>
        </div>
        <div className="ml-5">
          <h3 className="text-lg font-medium mb-1">Days</h3>
          <p className="text-sm text-muted-foreground">Keep going!</p>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="mt-4 bg-[#232323] rounded-lg p-3">
        <p className="text-xs text-muted-foreground text-center">
          You're in the top 5% of consistent athletes on APTS
        </p>
      </div> */}
    </div>
  );
};

export default StreakCounter;
