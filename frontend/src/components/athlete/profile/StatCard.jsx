'use client';
import React from "react";
import { Activity, ArrowUp, User } from "lucide-react";

const StatCard = ({ title, value, icon, delay = 0 }) => {
  const Icon = () => {
    switch (icon) {
      case "user":
        return <User className="h-5 w-5 text-purple-light" />;
      case "arrow-up":
        return <ArrowUp className="h-5 w-5 text-purple-light" />;
      case "activity":
        return <Activity className="h-5 w-5 text-purple-light" />;
    }
  };

  const animationClass =
    delay === 1 ? " animate-slide-up-delay-1" :
    delay === 2 ? " animate-slide-up-delay-2" :
    delay === 3 ? " animate-slide-up-delay-3" :
    " animate-slide-up";

  return (
    <div className={`glass rounded-xl overflow-hidden ${animationClass}`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full bg-purple/10 p-2">
            <Icon />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className="flex items-end">
          <span className="text-3xl font-bold">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;