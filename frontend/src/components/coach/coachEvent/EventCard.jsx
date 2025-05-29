'use client';

// import React from "react";
// import { Calendar, MapPin, Users, Trophy } from "lucide-react";
// import { format } from "date-fns";

// const EventCard = ({ event }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "upcoming":
//         return "bg-apts-purple/25 text-apts-purple-light";
//       case "ongoing":
//         return "bg-apts-green/25 text-apts-green";
//       case "completed":
//         return "bg-gray-500/25 text-gray-400";
//       default:
//         return "bg-apts-purple/25 text-apts-purple-light";
//     }
//   };

//   const getLevelBadgeClass = (level) => {
//     switch (level) {
//       case "Elite":
//         return "badge-elite";
//       case "Pro":
//         return "badge-pro";
//       case "Advanced":
//         return "badge-advanced";
//       default:
//         return "bg-gray-500/25 text-gray-400 px-2 py-1 rounded-md text-xs font-medium";
//     }
//   };

//   return (
//     <div className="apts-card mb-6 bg-apts-dark">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
//           <div className="flex items-center gap-6 text-gray-400 text-sm mb-2">
//             <div className="flex items-center gap-1">
//               <Calendar size={16} />
//               <span>{format(event.date, "MMMM d, yyyy")}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <MapPin size={16} />
//               <span>{event.location}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Trophy size={16} />
//               <span>{event.category}</span>
//             </div>
//           </div>
//         </div>
//         <div className={`${getStatusColor(event.status)} px-3 py-1.5 rounded-md text-sm font-medium capitalize`}>
//           {event.status}
//         </div>
//       </div>

//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-2">
//           <h4 className="text-gray-300 font-medium flex items-center gap-2">
//             <Users size={16} />
//             Registered Athletes ({event.registeredAthletes.length})
//           </h4>
//           <button className="text-apts-purple-light text-sm hover:underline">
//             View All
//           </button>
//         </div>
        
//         <div className="space-y-3">
//           {event.registeredAthletes.slice(0, 3).map((athlete) => (
//             <div key={athlete.id} className="flex items-center justify-between bg-[#232733] rounded-lg p-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-apts-purple/30 flex items-center justify-center text-white font-bold">
//                   {athlete.image ? (
//                     <img src={athlete.image} alt={athlete.name} className="w-full h-full rounded-full object-cover" />
//                   ) : (
//                     athlete.name.charAt(0)
//                   )}
//                 </div>
//                 <div>
//                   <h5 className="text-white font-medium">{athlete.name}</h5>
//                   <p className="text-gray-400 text-xs">{athlete.sport}</p>
//                 </div>
//               </div>
//               <span className={getLevelBadgeClass(athlete.level)}>
//                 {athlete.level}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-between">
//         <button className="glass-card text-white px-4 py-2 rounded-lg hover:bg-[#2a303e] transition-colors">
//           Event Details
//         </button>
        
//       </div>
//     </div>
//   );
// };

// export default EventCard;
import React from 'react';
import { Calendar, MapPin, Users, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const EventCard = ({ event, onViewAthletes }) => {
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(event.uniqueCode);
    toast({
      title: "Code Copied!",
      description: "Event code has been copied to clipboard.",
    });
  };

  return (
    <Card className="bg-gray-900 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-white text-xl font-bold">{event.name}</CardTitle>
          <Badge variant="secondary" className="bg-athletePurple text-white font-bold hover:bg-athletePurple">
            {event.registeredAthletes.length} Athletes
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar size={16} />
          <span>{event.date} at {event.time}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        {event.description && (
          <p className="text-gray-400 text-sm">{event.description}</p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Event Code:</span>
            <code className="bg-gray-800 px-2 py-1 rounded text-purple-400 font-mono">
              {event.uniqueCode}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyCode}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
            >
              <Copy size={14} />
            </Button>
          </div>
          <Button
            onClick={() => onViewAthletes(event)}
            className="bg-apts-purple-dark  hover:bg-apts-purple pulse-btn text-white"
            size="sm"
          >
            <Users size={14} className="mr-1" />
            View Athletes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
