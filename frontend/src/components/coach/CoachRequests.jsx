'use client';
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function CoachRequests() {
  const [requests, setRequests] = useState([]);
  const [athletes, setAthletes] = useState({});
  const user = useSelector((state) => state.user);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, "requests"),
        where("toId", "==", user.uid),
        where("status", "==", "pending")
      );
      const snapshot = await getDocs(q);
      const requestData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestData);

      // Fetch athlete profiles
      const athleteDetails = {};
      await Promise.all(
        requestData.map(async (req) => {
          const athleteDoc = await getDoc(doc(db, "users", req.fromId));
          if (athleteDoc.exists()) {
            athleteDetails[req.fromId] = athleteDoc.data();
          }
        })
      );
      setAthletes(athleteDetails);
    } catch (err) {
      toast.error("Failed to fetch requests.");
      console.error("Error fetching requests:", err);
    }
  };

  const acceptRequest = async (request) => {
    try {
      // 1. Update request status
      await updateDoc(doc(db, "requests", request.id), {
        status: "accepted",
      });

      // 2. Update athlete profile (connectedCoachId)
      await updateDoc(doc(db, "users", request.fromId), {
        connectedCoachId: user.uid,
      });

      // 3. Update coach profile (add athlete to connectedAthletes list)
      await updateDoc(doc(db, "users", user.uid), {
        connectedAthletes: arrayUnion(request.fromId),
      });

      toast.success("Request accepted!");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to accept request.");
      console.error("Accept error:", err);
    }
  };

  const rejectRequest = async (request) => {
    try {
      await updateDoc(doc(db, "requests", request.id), {
        status: "rejected",
      });
      toast("Request rejected.");
      fetchRequests();
    } catch (err) {
      toast.error("Failed to reject request.");
      console.error("Reject error:", err);
    }
  };

  useEffect(() => {
    if (user.uid && user.role === "coach") fetchRequests();
  }, [user]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-200">Connection Requests</h2>
      {requests.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No pending requests</p>
      ) : (
        <ul>
          {requests.map((req) => {
            const athlete = athletes[req.fromId];
            return (
              <li
                key={req.id}
                className="my-2 mx-auto w-2/3 items-center gap-4 text-white glass-card bg-black/80 border-white/20 overflow-hidden p-5 rounded-xl border cursor-pointer
                hover:shadow-[0_10px_30px_-10px_rgba(155,135,245,0.2)] transition-shadow duration-300"
                style={{ }} 
              >
                {athlete ? (
                  <>
                  <div className="flex gap-4 mx-auto mb-4 justify-end items-center">
                    <img
                      src={athlete.photoURL || "/default-profile.png"}
                      alt={athlete.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <p className="text-lg font-semibold">
                        {athlete.firstName} {athlete.lastName}
                      </p>
                      <p className="text-white/70">Sport: <span className="text-white ">{athlete.sport || "N/A"}</span></p>
                      <p className="text-white/70">Experience: <span className="text-white ">{athlete.experienceLevel || "N/A"}</span></p>
                      <p className="text-white/70">Gender: <span className="text-white ">{athlete.gender}</span></p>
                      <p className="text-white/70">
                        Achievements: <span className="text-white ">{athlete.achievements || "None"}</span>
                      </p>
                      <div className="flex mt-4 gap-2 ">
                      <button
                        onClick={() => acceptRequest(req)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(req)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                    </div>
                    </div>
                    
                  </>
                ) : (
                  <span className="text-red-500">Athlete data unavailable</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}