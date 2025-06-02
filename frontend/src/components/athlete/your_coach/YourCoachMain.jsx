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
    if (!user?.uid){ 
      console.warn("No user logged in");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      console.log("User snapshot:", userSnap.exists(), userSnap.data());

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.connectedCoachId) {
          console.log("Fetching connected coach with ID:", userData.connectedCoachId);
          const coachRef = doc(db, "users", userData.connectedCoachId);
          const coachSnap = await getDoc(coachRef);
          console.log("Coach snapshot:", coachSnap.exists(), coachSnap.data());
          if (coachSnap.exists()) {
            setConnectedCoach({ id: coachSnap.id, ...coachSnap.data() });
          }
        }
      }
    } catch (err) {
      console.error("Error fetching connected coach:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedCoach();
  }, [user]);

  return (
    <div className="w-full">
      <FeatureHero
        bg_url={
          "https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741323594/MacBook_Pro_16__-_1_2_qakdds.svg"
        }
        title={"Your Coach"}
      />

      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')",
        }}
      >
        <div className="min-h-screen bg-black/55 flex flex-col md:flex-row p-4">
          <div className="w-full md:w-2/5">
            {loading ? (
              <p className="text-white">Loading...</p>
            ) : connectedCoach ? (
              <ShowConnectedCoach coach={connectedCoach} onRemoved={fetchConnectedCoach} />
            ) : (
              <SearchCoach />
            )}
          </div>

          <div className="w-full md:w-3/5">
            <Message />
            <Sessions/>
            {/* <Notifications /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
