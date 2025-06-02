"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ShowConnectedCoach({ onRemoved }) {
  const user = useSelector((state) => state.user);
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    const fetchCoachDetails = async () => {
      if (!user?.uid) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const connectedCoachId = userDoc?.data()?.connectedCoachId;
      if (!connectedCoachId) return;

      const coachDoc = await getDoc(doc(db, "users", connectedCoachId));
      if (coachDoc.exists()) {
        setCoach({ id: coachDoc.id, ...coachDoc.data() });
      }
    };
    fetchCoachDetails();
  }, [user]);

  const handleRemoveConnection = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        connectedCoachId: null,
      });
      toast.success("Disconnected from coach.");
      setCoach(null);
      onRemoved();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove connection.");
    }
  };

  if (!coach) return null;

  return (
    <div className="p-4 max-w-full mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white font-sprintura">
        Your Connected Coach
      </h2>
      <div
        className="my-2 w-4/5 flex items-center gap-4 text-white glass-card bg-black/80 border-white/20 overflow-hidden p-5 rounded-xl border"
        style={{ maxWidth: "600px", minWidth: "330px" }}
      >
        <img
          src={coach.photoURL || "/default-profile.png"}
          alt={coach.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-grow">
          <p className="font-bold text-xl">{coach.name}</p>
          <p className="text-white/70">
            Sport: <span className="text-white">{coach.sport || "N/A"}</span>
          </p>
          <p className="text-white/70">
            Experience:{" "}
            <span className="text-white">
              {coach.experience ? coach.experience + " years" : "N/A"}
            </span>
          </p>
          <p className="text-white/70">
            City: <span className="text-white">{coach.city || "N/A"}</span>
          </p>
          <p className="text-white/70">
            State: <span className="text-white">{coach.state || "N/A"}</span>
          </p>
        </div>
        <button
          onClick={() => handleRemoveConnection(coach.id, user.uid)}
          className="bg-apts-purple-dark hover:bg-apts-purple pulse-btn text-white px-4 py-2 rounded font-semibold transition"
        >
          Remove Connection
        </button>

      </div>
    </div>
  );
}
