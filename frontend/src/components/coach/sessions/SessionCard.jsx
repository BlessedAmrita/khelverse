"use client";
import React from "react";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Status styles and titles
const statusStyles = {
  upcoming: "bg-blue-500/20 text-gray-300 border-blue-500/30 py-[3px]",
  ongoing: "bg-green-500/20 text-green-300 border-green-500/30 py-[3px]",
  completed: "bg-gray-500/20 text-gray-300 border-gray-500/30 py-[3px]",
};

const statusTitles = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

const SessionCard = ({ id, title, date, time, athlete, status }) => {
  return (
    <div className="bg-apts-dark border border-white/30 bg-transparent rounded-lg p-5 transition-all duration-300 hover:translate-y-[-5px] animate-fade-in flex flex-col h-full">
      {/* Top content section */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-lavender-200">{title}</h3>
          <Badge className={cn("text-xs font-medium", statusStyles[status])}>
            {statusTitles[status]}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-purple-light" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <Clock className="h-4 w-4 mr-2 text-purple-light" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <User className="h-4 w-4 mr-2 text-purple-light" />
            <span>{athlete}</span>
          </div>
        </div>
      </div>

      {/* Button section pinned to bottom */}
      <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
        {status === "upcoming" && (
          <Button variant="outline" size="sm" className="text-xs h-8 bg-gray-200">
            Cancel
          </Button>
        )}
        {status === "ongoing" && (
          <Button
            variant="default"
            size="sm"
            className="text-xs bg-purple-dark text-lavender-200 hover:bg-lavender hover:text-black h-8 pulse-btn"
          >
            Join Now
          </Button>
        )}
        {status === "completed" && (
          <Button variant="outline" size="sm" className="text-xs h-8 bg-gray-200">
            View Recording
          </Button>
        )}

        <Link href={`/session/${id}`}>
          <Button variant="ghost" size="sm" className="text-xs h-8 px-2 text-gray-300">
            Details <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SessionCard;
