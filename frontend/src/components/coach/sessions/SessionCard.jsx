"use client";
import React, { useState } from "react";
import { Calendar, Clock, User, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const SessionCard = ({
  id,
  title,
  date,
  time,
  athleteName,
  athleteFirstName,
  athleteLastName,
  athleteImage,
  description,
  meetLink,
  status,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription((prev) => !prev);
  const shortDescription =
    description.length > 150 ? description.slice(0, 150) + "..." : description;

  return (
    <div className="bg-gray-950  border border-white/20 rounded-lg p-5 transition-all duration-300 hover:-translate-y-1 animate-fade-in flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-lavender-200">{title}</h3>
          <Badge className={cn("text-xs font-medium", statusStyles[status], "border-none p-2 bg-athletePurple hover:bg-athletePurple")}>
            {statusTitles[status]}
          </Badge>
        </div>

        <div className="space-y-2 mb-4 text-gray-300 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-purple-light" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-light" />
            <span>{time}</span>
          </div>

          {/* Athlete Info */}
          <div className="flex items-center gap-3 mt-2">
            <User className="h-4 w-4 text-purple-light" />
            <img
              src={athleteImage}
              alt={athleteName}
              className="h-8 w-8 rounded-full object-cover border border-white/20"
            />
            <span className="text-white font-medium">{athleteFirstName} {athleteLastName}</span>
          </div>

          {/* Meet Link */}
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-2 text-purple-light" />
            {meetLink ? (
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-purple-400"
              >
                Google Meet Link
              </a>
            ) : (
              <span>No Meet Link</span>
            )}
          </div>

          {/* Description Section */}
          <div className="mt-3">
            <p className="font-semibold text-white mb-1">Description:</p>
            {showFullDescription ? (
              <div className="max-h-36 overflow-y-auto pr-2 text-sm custom-scrollbar">
                <p>{description}</p>
              </div>
            ) : (
              <p>{shortDescription}</p>
            )}
            {description.length > 150 && (
              <button
                onClick={toggleDescription}
                className="mt-1 text-sm text-purple-400 underline hover:text-purple-600"
                aria-label="Toggle description read more"
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-white/10 mt-auto">
        {status === "ongoing" && meetLink && (
          <Button
            type="button"
            variant="default"
            size="sm"
            className="text-xs bg-purple-dark text-lavender-200 hover:bg-lavender hover:text-black h-8 pulse-btn"
            onClick={() => window.open(meetLink, "_blank", "noopener,noreferrer")}
          >
            Join Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
