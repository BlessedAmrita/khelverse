'use client';

import React from "react";
import { Filter, Search } from "lucide-react";

function EventFilter({ onFilterChange, onSearchChange, activeFilter }) {
  const filters = [
    { id: "all", label: "All Events" },
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? "bg-purple-dark text-lavender-100"
                : "bg-[#232733] text-gray-300 hover:bg-[#2a303e]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      
      <div className="flex gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-[#232733] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-apts-purple w-full md:w-64"
            placeholder="Search events..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <button className="bg-[#232733] text-gray-300 p-2 rounded-lg hover:bg-[#2a303e]">
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
}

export default EventFilter;
