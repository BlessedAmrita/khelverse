'use client';
import React from "react";
import { Activity } from "lucide-react";

const StreakCounter = ({ streak }) => {
  return (
    <div className="glass rounded-xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-light" />
          Current Streak
        </h2>
      </div>

      <div className="flex items-center justify-center py-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-purple blur-2xl opacity-20 animate-pulse-glow"></div>
          <div className="relative glass-dark rounded-full w-24 h-24 flex items-center justify-center border-2 border-purple">
            <span className="text-3xl font-bold">{streak}</span>
          </div>
        </div>
        <div className="ml-5">
          <h3 className="text-lg font-medium mb-1">Days</h3>
          <p className="text-sm text-muted-foreground">Keep it up!</p>
        </div>
      </div>

      <div className="mt-4 bg-[#232323] rounded-lg p-3">
        <p className="text-xs text-muted-foreground text-center">
          You're in the top 5% of consistent athletes on APTS
        </p>
      </div>
    </div>
  );
};

export default StreakCounter;