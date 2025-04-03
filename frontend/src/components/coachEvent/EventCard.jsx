'use client';

import React from "react";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { format } from "date-fns";

const EventCard = ({ event }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-apts-purple/25 text-apts-purple-light";
      case "ongoing":
        return "bg-apts-green/25 text-apts-green";
      case "completed":
        return "bg-gray-500/25 text-gray-400";
      default:
        return "bg-apts-purple/25 text-apts-purple-light";
    }
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case "Elite":
        return "badge-elite";
      case "Pro":
        return "badge-pro";
      case "Advanced":
        return "badge-advanced";
      default:
        return "bg-gray-500/25 text-gray-400 px-2 py-1 rounded-md text-xs font-medium";
    }
  };

  return (
    <div className="apts-card mb-6 bg-apts-dark">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
          <div className="flex items-center gap-6 text-gray-400 text-sm mb-2">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{format(event.date, "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              <span>{event.category}</span>
            </div>
          </div>
        </div>
        <div className={`${getStatusColor(event.status)} px-3 py-1.5 rounded-md text-sm font-medium capitalize`}>
          {event.status}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-gray-300 font-medium flex items-center gap-2">
            <Users size={16} />
            Registered Athletes ({event.registeredAthletes.length})
          </h4>
          <button className="text-apts-purple-light text-sm hover:underline">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {event.registeredAthletes.slice(0, 3).map((athlete) => (
            <div key={athlete.id} className="flex items-center justify-between bg-[#232733] rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-apts-purple/30 flex items-center justify-center text-white font-bold">
                  {athlete.image ? (
                    <img src={athlete.image} alt={athlete.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    athlete.name.charAt(0)
                  )}
                </div>
                <div>
                  <h5 className="text-white font-medium">{athlete.name}</h5>
                  <p className="text-gray-400 text-xs">{athlete.sport}</p>
                </div>
              </div>
              <span className={getLevelBadgeClass(athlete.level)}>
                {athlete.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="glass-card text-white px-4 py-2 rounded-lg hover:bg-[#2a303e] transition-colors">
          Event Details
        </button>
        
      </div>
    </div>
  );
};

export default EventCard;
