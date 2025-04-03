'use client';

import React from "react";

function StatsCard({ title, value, icon, change, iconBgColor = "bg-apts-purple" }) {
  return (
    <div className="apts-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-400 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm flex items-center mt-2 ${change.positive ? 'text-apts-green' : 'text-red-500'}`}>
              <span className="mr-1">{change.positive ? '↑' : '↓'}</span>
              {change.value}
            </p>
          )}
        </div>
        <div className={`${iconBgColor} p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
