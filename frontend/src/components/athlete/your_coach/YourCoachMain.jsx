"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

import SearchCoach from "./SearchCoach";
import ShowConnectedCoach from "./showConnectedCoach";
import Message from "./Message";
import FeatureHero from "@/components/shared/FeatureHero";
import Sessions from "./Sessions";

export default function YourCoachMain() {
  const user = useSelector((state) => state.user);
  const [connectedCoach, setConnectedCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConnectedCoach = async () => {
    if (!user?.uid) {
      console.warn("No user logged in");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.connectedCoachId) {
          const coachRef = doc(db, "users", userData.connectedCoachId);
          const coachSnap = await getDoc(coachRef);
          if (coachSnap.exists()) {
            setConnectedCoach({ id: coachSnap.id, ...coachSnap.data() });
          } else {
            setConnectedCoach(null);
          }
        } else {
          setConnectedCoach(null);
        }
      } else {
        setConnectedCoach(null);
      }
    } catch (err) {
      console.error("Error fetching connected coach:", err);
      setConnectedCoach(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedCoach();
  }, [user]);

  // Determine the width class based on connectedCoach
  const contentDivWidthClass = connectedCoach ? "w-full md:w-1/2" : "w-full";

  return (
    <div className="w-full">
      <FeatureHero
        bg_url={
          "https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741323594/MacBook_Pro_16__-_1_2_qakdds.svg"
        }
        title={"Your Coach"}
      />

      <div
        className="min-h-screen bg-repeat bg-left-top"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')",
        }}
      >
        <div className="min-h-screen bg-black/55 p-4">
          <div className="h-auto flex flex-col md:flex-row ">
            {/* Apply the dynamic width class here */}
            <div className={`p-2 ${contentDivWidthClass}`}>
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : connectedCoach ? (
                <ShowConnectedCoach coach={connectedCoach} onRemoved={fetchConnectedCoach} />
              ) : (
                <SearchCoach />
              )}
            </div>

            {/* Conditional rendering for the Message component */}
            {connectedCoach && (
              <div className="flex justify-center items-center p-4 w-full md:w-1/2">
                <Message />
              </div>
            )}
          </div>

          <div className="w-full ">
            <Sessions />
            {/* <Notifications /> */}
          </div>
        </div>
      </div>
    </div>
  );
}