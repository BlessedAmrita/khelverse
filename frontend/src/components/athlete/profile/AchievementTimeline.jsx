// 'use client';
// import React, { useState } from "react";
// import { Award, Plus } from "lucide-react";
// import NewAchievementForm from "./NewAchievementForm";

// const AchievementTimeline = ({ achievements, userId, refreshAchievements }) => {
//   const [showAll, setShowAll] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const visibleAchievements = showAll ? achievements : achievements.slice(0, 3);

//   const handleAchievementAdded = () => {
//     setShowModal(false);
//     refreshAchievements(); // Reload DB achievements
//   };

//   return (
//     <div className="glass rounded-xl p-6 mt-6 animate-slide-up-delay-2">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold flex items-center gap-2">
//           <Award className="h-5 w-5 text-purple-light" />
//           Achievements
//         </h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="btn btn-sm btn-outline text-sm flex items-center gap-1"
//         >
//           <Plus className="w-4 h-4" />
//           Add Achievement
//         </button>
//       </div>

//       <div className="space-y-6 mt-6">
//         {visibleAchievements.length === 0 ? (
//           <p className="text-sm text-muted-foreground">No achievements added yet.</p>
//         ) : (
//           visibleAchievements.map((achievement) => (
//             <div
//               key={achievement.id}
//               className="relative pl-6 pb-6 border-l border-muted-foreground/20 last:border-0 last:pb-0"
//             >
//               <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-apts-purple"></div>
//               <div className="space-y-1">
//                 <div className="text-sm text-muted-foreground">
//                   {new Date(achievement.date).toLocaleDateString('en-US', {
//                     year: 'numeric', month: 'short', day: 'numeric'
//                   })}
//                 </div>
//                 <h3 className="font-medium">{achievement.title}</h3>
//                 {achievement.description && (
//                   <p className="text-sm text-muted-foreground">{achievement.description}</p>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {achievements.length > 3 && (
//         <button
//           onClick={() => setShowAll(!showAll)}
//           className="mt-4 text-apts-purple font-medium hover:underline"
//         >
//           {showAll ? 'Show Less' : 'Show More'}
//         </button>
//       )}
//       {showModal && (
//         <div className="inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
//           <div className="glass p-6 rounded-xl w-full max-w-lg relative animate-fade-in shadow-lg text-white max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-white hover:text-red-400 text-xl"
//             >
//               ✕
//             </button>
//             <h3 className="text-xl font-semibold mb-4">Adding Achievement...</h3>
//             <NewAchievementForm userId={userId} onSuccess={handleAchievementAdded} />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AchievementTimeline;


'use client';
import React, { useState } from "react";
import { Award, Plus } from "lucide-react";
import NewAchievementForm from "./NewAchievementForm";

const AchievementTimeline = ({ achievements, userId, refreshAchievements, readOnly = false }) => {
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);


  // const visibleAchievements = showAll ? achievements : achievements.slice(0, 3);
  // const visibleAchievements = showAll ? (achievements || []) : (achievements?.slice(0, 3) || []);
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const visibleAchievements = showAll ? safeAchievements : safeAchievements.slice(0, 3);



  const handleAchievementAdded = () => {
    setShowModal(false);
    refreshAchievements();
  };

  return (
    <div className="glass rounded-xl p-6 mt-6 animate-slide-up-delay-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-light" />
          Achievements
        </h2>
        {!readOnly && (
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-sm btn-outline text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Achievement
          </button>
        )}
      </div>

      <div className="space-y-6 mt-6">
        {visibleAchievements.length === 0 ? (
          <p className="text-sm text-muted-foreground">No achievements added yet.</p>
        ) : (
          visibleAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="relative pl-6 pb-6 border-l border-muted-foreground/20 last:border-0 last:pb-0"
            >
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-apts-purple"></div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  {new Date(achievement.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
                <h3 className="font-medium">{achievement.title}</h3>
                {achievement.description && (
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {achievements.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-apts-purple font-medium hover:underline"
        >
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      )}

      {!readOnly && showModal && (
        <div className="inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="glass p-6 rounded-xl w-full max-w-lg relative animate-fade-in shadow-lg text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white hover:text-red-400 text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Adding Achievement...</h3>
            <NewAchievementForm userId={userId} onSuccess={handleAchievementAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementTimeline;

