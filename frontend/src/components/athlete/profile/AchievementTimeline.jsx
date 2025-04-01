'use client';
import React from "react";
import { Award } from "lucide-react";

const AchievementTimeline = ({ achievements }) => {
  return (
    <div className="glass rounded-xl p-6 mt-6 animate-slide-up-delay-2">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Award className="h-5 w-5 text-purple-light" />
        Achievements
      </h2>

      <div className="space-y-6 mt-6">
        {achievements.map((achievement, index) => (
          <div 
            key={achievement.id} 
            className="relative pl-6 pb-6 border-l border-muted-foreground/20 last:border-0 last:pb-0"
          >
            <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-purple"></div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                {new Date(achievement.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <h3 className="font-medium">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementTimeline;