// 'use client';
// import React from 'react';
// import Link from 'next/link';
// import { ArrowUpRight, Activity } from 'lucide-react';

// const AthleteCard = ({ athlete }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Active':
//         return 'bg-green-500';
//       case 'Recovery':
//         return 'bg-amber-500';
//       case 'Competing':
//         return 'bg-blue-500';
//       case 'Training':
//         return 'bg-purple-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   const getPerformanceIndicator = (performance) => {
//     switch (performance) {
//       case 'Excellent':
//         return 'text-green-400';
//       case 'Good':
//         return 'text-blue-400';
//       case 'Improving':
//         return 'text-amber-400';
//       default:
//         return 'text-gray-400';
//     }
//   };

//   return (
//     <Link href={athlete.id ? `/athletes/${athlete.id}` : "#"} className="block athlete-card">
//       <div className=" bg-apts-dark text-white p-6 h-full rounded-xl border border-athletePurple-dark/40">
//         <div className=" bg-apts-dark text-white"></div>
        
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-4">
//             <div className="h-14 w-14 rounded-full bg-accent overflow-hidden">
//               <img 
//                 src={athlete.image} 
//                 alt={athlete.name} 
//                 className="h-full w-full object-cover"
//                 onError={(e) => {
//                   e.target.src = 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3';
//                 }}
//               />
//             </div>
//             <div>
//               <h3 className="font-bold text-lg text-lavender-100">{athlete.name}</h3>
//               <p className="text-muted-foreground text-sm">{athlete.sport}</p>
//             </div>
//           </div>
//           <ArrowUpRight className="h-5 w-5 text-athletePurple-light opacity-60 group-hover:opacity-100 transition-opacity" />
//         </div>
        
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className="bg-apts-lightdark p-3 rounded-lg">
//             <p className="text-xs text-muted-foreground mb-1">Age</p>
//             <p className="font-medium">{athlete.age}</p>
//           </div>
//           <div className="bg-apts-lightdark p-3 rounded-lg">
//             <p className="text-xs text-muted-foreground mb-1">Level</p>
//             <p className="font-medium">{athlete.level}</p>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className={`h-2 w-2 rounded-full ${getStatusColor(athlete.status)} animate-pulse-subtle`}></span>
//             <span className="text-sm">{athlete.status}</span>
//           </div>
          
//           <div className="flex items-center gap-1.5">
//             <Activity className={`h-4 w-4 ${getPerformanceIndicator(athlete.recentPerformance)}`} />
//             <span className={`text-sm ${getPerformanceIndicator(athlete.recentPerformance)}`}>
//               {athlete.recentPerformance}
//             </span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default AthleteCard;


'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const AthleteCard = ({ athlete }) => {
  return (
    <Link href={athlete.id ? `/athletes/${athlete.id}` : "#"} className="block group">
      <div
        className="glass-card bg-black/20 border-white/20 overflow-hidden p-5 rounded-xl border cursor-pointer
          hover:shadow-[0_10px_30px_-10px_rgba(155,135,245,0.2)] transition-shadow duration-300"
          
      >
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-apts-purple to-apts-purple/60 mr-3 overflow-hidden">
              <img
                src={
                  athlete.photoURL ||
                  'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
                }
                alt={athlete.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3';
                }}
              />
            </div>

            <div>
              <h3 className="text-apts-white font-semibold text-lg">{athlete.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-apts-white/70">{athlete.sport}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-apts-purple/20 text-apts-purple">
                  {athlete.experienceLevel ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-apts-white/70">
                Age: <span className="text-sm font-medium text-apts-white mx-1">{athlete.age ?? "N/A"}</span>
              </span>
            </div>

            <div className="flex justify-between mt-4">
              <span className="text-sm text-apts-white/70">
                Location:{" "}
                <span className="text-sm text-apts-white mx-1">{athlete.location ?? "Unknown"}</span>
              </span>
            </div>
          </div>

          <button className="w-full bg-apts-purple-dark text-lavender-100 rounded-xl apts-button mt-5">
            View Details 
          </button>
        </div>
      </div>
    </Link>
  );
};

export default AthleteCard;