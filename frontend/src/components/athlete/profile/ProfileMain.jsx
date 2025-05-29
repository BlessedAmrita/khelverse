// 'use client';
// import React, { useEffect, useState } from "react";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
// import { db } from "@/firebase/firebase";
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchUserData } from '@/config/slices/userSlice';

// import ProfileHero from "./ProfileHero";
// import StatCard from "./StatCard";
// import AchievementTimeline from "./AchievementTimeline";
// import ExerciseHeatmap from "./ExerciseHeatmap";
// import StreakCounter from "./StreakCounter";
// import MedicalRecords from "./MedicalRecords";

// function ProfileMain({ athlete }) {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const uid = user?.uid;

//   const [achievements, setAchievements] = useState([]);
//   const [streak, setStreak] = useState(0); // 💥 NEW

//   useEffect(() => {
//     if (uid && !user.firstName) {
//       dispatch(fetchUserData(uid)).then((res) => {
//         console.log("Fetched User Data:", res.payload);
//       });
//     }
//   }, [dispatch, uid, user.firstName]);

//   const fetchAchievements = async () => {
//     if (!uid) return;

//     try {
//       const snapshot = await getDocs(collection(db, "users", uid, "achievements"));
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setAchievements(data);
//     } catch (err) {
//       console.error("Failed to fetch achievements:", err);
//     }
//   };

//   useEffect(() => {
//     if (uid) fetchAchievements();
//   }, [uid]);

//   const dob = user?.additionalData?.dob;
//   const height = Number(user?.additionalData?.height) || 'N/A';
//   const weight = Number(user?.additionalData?.weight) || 'N/A';

//   const calculateAge = (dob) => {
//     if (!dob) return 'N/A';
//     const birthDate = new Date(dob);
//     if (isNaN(birthDate)) return 'N/A';
//     let age = new Date().getFullYear() - birthDate.getFullYear();
//     const m = new Date().getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) age--;
//     return age;
//   };

//   const handleEditField = async (field) => {
//     const currentValue =
//       ['dob', 'height', 'weight'].includes(field)
//         ? user?.[field] || ''
//         : user?.additionalData?.[field] || '';

//     let promptMessage = `Enter new ${field}:`;
//     if (field === 'dob') promptMessage = 'Enter DOB in YYYY-MM-DD format:';

//     const newValue = prompt(promptMessage, currentValue);
//     if (!newValue || newValue === currentValue) return;

//     try {
//       const userRef = doc(db, "users", uid);
//       await updateDoc(userRef, {
//         [`${field}`]: newValue
//       });
//       dispatch(fetchUserData(uid));
//       alert(`${field} updated successfully!`);
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Failed to update. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-black text-white py-8 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto relative">
//         <ProfileHero athlete={athlete} />

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
//           <StatCard
//             title="Age"
//             value={calculateAge(dob)}
//             icon="user"
//             delay={1}
//             editable
//             onEdit={() => handleEditField("dob")}
//           />
//           <StatCard
//             title="Height"
//             value={height !== 'N/A' ? `${height} cm` : height}
//             icon="arrow-up"
//             delay={2}
//             editable
//             onEdit={() => handleEditField("height")}
//           />
//           <StatCard
//             title="Weight"
//             value={weight !== 'N/A' ? `${weight} kg` : weight}
//             icon="activity"
//             delay={3}
//             editable
//             onEdit={() => handleEditField("weight")}
//           />
//         </div>

//         <div className="mt-10 relative">
//           <StreakCounter streak={streak} />
//           <AchievementTimeline achievements={achievements} userId={uid} refreshAchievements={fetchAchievements} />
//           <MedicalRecords />
//           <ExerciseHeatmap setStreak={setStreak} /> {/* 💥 Pass setStreak */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfileMain;


import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '@/config/slices/userSlice';

import ProfileHero from "./ProfileHero";
import StatCard from "./StatCard";
import AchievementTimeline from "./AchievementTimeline";
import ExerciseHeatmap from "./ExerciseHeatmap";
import StreakCounter from "./StreakCounter";
import MedicalRecords from "./MedicalRecords";

function ProfileMain({ athlete, readOnly = false }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const uid = user?.uid;

  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(0);

  const activeUser = readOnly ? athlete : user;
  const activeUid = readOnly ? athlete?.uid : uid;

  useEffect(() => {
    if (uid && !user.firstName) {
      dispatch(fetchUserData(uid));
    }
  }, [dispatch, uid, user.firstName]);

  useEffect(() => {
    if (readOnly && athlete?.achievements) {
      setAchievements(athlete.achievements);
    } else if (activeUid && !readOnly) {
      fetchAchievements();
    }
  }, [activeUid, readOnly, athlete]);

  const fetchAchievements = async () => {
    if (!uid) return;
    try {
      const snapshot = await getDocs(collection(db, "users", uid, "achievements"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAchievements(data);
    } catch (err) {
      console.error("Failed to fetch achievements:", err);
    }
  };

  const dob = activeUser?.additionalData?.dob;
  const height = Number(activeUser?.additionalData?.height) || 'N/A';
  const weight = Number(activeUser?.additionalData?.weight) || 'N/A';

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return 'N/A';
    let age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleEditField = async (field) => {
    const currentValue = activeUser?.additionalData?.[field] || '';
    const promptMessage = field === 'dob' ? 'Enter DOB in YYYY-MM-DD format:' : `Enter new ${field}:`;
    const newValue = prompt(promptMessage, currentValue);
    if (!newValue || newValue === currentValue) return;

    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        [`additionalData.${field}`]: newValue
      });
      dispatch(fetchUserData(uid));
      alert(`${field} updated successfully!`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update. Try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative">
        <ProfileHero athlete={athlete} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <StatCard title="Age" value={calculateAge(dob)} icon="user" delay={1} editable={!readOnly} onEdit={() => handleEditField("dob")} />
          <StatCard title="Height" value={height !== 'N/A' ? `${height} cm` : height} icon="arrow-up" delay={2} editable={!readOnly} onEdit={() => handleEditField("height")} />
          <StatCard title="Weight" value={weight !== 'N/A' ? `${weight} kg` : weight} icon="activity" delay={3} editable={!readOnly} onEdit={() => handleEditField("weight")} />
        </div>

        <div className="mt-10 relative">
          <StreakCounter streak={readOnly ? athlete?.streak : streak} />
          <AchievementTimeline achievements={achievements} userId={activeUid} refreshAchievements={fetchAchievements} readOnly={readOnly} />
          <MedicalRecords uid={activeUid} readOnly={readOnly} />
          <ExerciseHeatmap setStreak={!readOnly ? setStreak : undefined} />
        </div>
      </div>
    </div>
  );
}

export default ProfileMain;

