'use client';
import React from "react";
import { Activity, ArrowUp, User, Pencil } from "lucide-react";

const StatCard = ({ title, value, icon, delay = 0, editable = false, onEdit = () => {} }) => {
  const Icon = () => {
    switch (icon) {
      case "user": return <User className="h-5 w-5 text-purple-light" />;
      case "arrow-up": return <ArrowUp className="h-5 w-5 text-purple-light" />;
      case "activity": return <Activity className="h-5 w-5 text-purple-light" />;
      default: return null;
    }
  };

  const animationClass =
    delay === 1 ? " animate-slide-up-delay-1" :
    delay === 2 ? " animate-slide-up-delay-2" :
    delay === 3 ? " animate-slide-up-delay-3" :
    " animate-slide-up";

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black transform transition-all hover:scale-[1.02] ${animationClass}`}>
    <div className="p-6 relative z-20 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
            <Icon />
          </div>
          <h3 className="text-sm font-medium text-white/80">{title}</h3>
        </div>
        {editable && (
          <button onClick={onEdit} className="bg-white/10 rounded-full p-1 hover:bg-white/20 transition backdrop-blur-sm">
            <Pencil className="h-4 w-4 text-khelverse-purple" />
          </button>
        )}
      </div>
      <div className="flex items-end justify-center">
        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-khelverse-purple">{value}</span>
      </div>
    </div>
  </div>
  );
};

export default StatCard;
