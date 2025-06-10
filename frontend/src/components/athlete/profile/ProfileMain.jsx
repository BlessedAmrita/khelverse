'use client';
import React, { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useSelector } from 'react-redux';

import ProfileHero from "./ProfileHero";
import StatCard from "./StatCard";
import AchievementTimeline from "./AchievementTimeline";
import ExerciseHeatmap from "./ExerciseHeatmap";
import StreakCounter from "./StreakCounter";
import MedicalRecords from "./MedicalRecords";

function ProfileMain({ athlete, readOnly = false }) {
  const reduxUser = useSelector((state) => state.user);  // <-- get user from redux at top level
  const [user, setUser] = useState(null); // Firestore user data
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(0);

  const activeUser = readOnly ? athlete : user;
  const activeUid = readOnly ? athlete?.uid : user?.uid;

  useEffect(() => {
    if (!readOnly && reduxUser?.uid) {
      fetchUserFromFirestore(reduxUser.uid);
    }
  }, [readOnly, reduxUser?.uid]);

  const fetchUserFromFirestore = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser({ uid, ...userDoc.data() });
      }
    } catch (err) {
      console.error("Failed to fetch user from Firestore:", err);
    }
  };

  useEffect(() => {
  if (readOnly && athlete?.uid) {
    fetchAchievements(athlete.uid); // fetch using athlete UID
  } else if (activeUid && !readOnly) {
    fetchAchievements(activeUid);
  }
}, [activeUid, readOnly, athlete]);



  const fetchAchievements = async (uid) => {
  try {
    const snapshot = await getDocs(collection(db, "users", uid, "achievements"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAchievements(data);
  } catch (err) {
    console.error("Failed to fetch achievements:", err);
  }
};


  const dob = activeUser?.dob;
  const height = Number(activeUser?.height) || 'N/A';
  const weight = Number(activeUser?.weight) || 'N/A';

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
    const currentValue = activeUser?.[field] || '';
    const promptMessage = field === 'dob' ? 'Enter DOB in YYYY-MM-DD format:' : `Enter new ${field}:`;
    const newValue = prompt(promptMessage, currentValue);
    if (!newValue || newValue === currentValue) return;

    try {
      await updateDoc(doc(db, "users", activeUid), {
        [`${field}`]: newValue
      });
      fetchUserFromFirestore(activeUid); // Refresh UI
      alert(`${field} updated successfully!`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update. Try again.");
    }
  };
 
  if (!activeUser) return <div className="text-white p-4">Loading profile...</div>;

  return (
    <div className="min-h-screen w-full bg-black text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative">
      <div
    className="min-h-screen bg-repeat bg-left-top"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
      <div className="min-h-screen bg-black/55">
        <ProfileHero athlete={activeUser} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <StatCard title="Age" value={calculateAge(dob)} icon="user" delay={1} editable={!readOnly} onEdit={() => handleEditField("dob")} />
          <StatCard title="Height" value={height !== 'N/A' ? `${height} cm` : height} icon="arrow-up" delay={2} editable={!readOnly} onEdit={() => handleEditField("height")} />
          <StatCard title="Weight" value={weight !== 'N/A' ? `${weight} kg` : weight} icon="activity" delay={3} editable={!readOnly} onEdit={() => handleEditField("weight")} />
        </div>

        <div className="mt-10 relative">
          <StreakCounter streak={streak} />
          <AchievementTimeline achievements={achievements} userId={activeUid} refreshAchievements={fetchAchievements} readOnly={readOnly} />
          <MedicalRecords uid={activeUid} readOnly={readOnly} />
          <ExerciseHeatmap
            uid={readOnly ? athlete?.uid : undefined}
            setStreak={setStreak}
          />

        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default ProfileMain;
