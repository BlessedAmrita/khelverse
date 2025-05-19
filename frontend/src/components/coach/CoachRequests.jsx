// import { useEffect, useState } from "react";
// import { db } from "@/firebase/firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";

// export default function CoachRequests() {
//   const [requests, setRequests] = useState([]);
//   const user = useSelector((state) => state.user);

//   const fetchRequests = async () => {
//     try {
//       const q = query(
//         collection(db, "requests"),
//         where("toId", "==", user.uid),
//         where("status", "==", "pending")
//       );
//       const snapshot = await getDocs(q);
//       setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     } catch (err) {
//       toast.error("Failed to fetch requests.");
//       console.error("Error fetching requests:", err);
//       console
//     }
//   };

//   const acceptRequest = async (request) => {
//     try {
//       await updateDoc(doc(db, "requests", request.id), {
//         status: "accepted",
//       });

//       // Optionally link the coach and athlete
//       await updateDoc(doc(db, "users", request.fromId), {
//         connectedCoachId: user.uid,
//       });

//       toast.success("Request accepted!");
//       fetchRequests(); // Refresh list
//     } catch (err) {
//       toast.error("Failed to accept request.");
//       console.error("Error accepting request:", err);
//     }
//   };

//   useEffect(() => {
//     if (user.uid && user.role === "coach") fetchRequests();
//   }, [user]);

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-xl font-bold mb-4 text-center">Connection Requests</h2>
//       {requests.length === 0 ? (
//         <p className="text-center text-gray-600">No pending requests</p>
//       ) : (
//         <ul>
//           {requests.map((req) => (
//             <li
//               key={req.id}
//               className="border p-3 my-2 rounded flex justify-between items-center"
//             >
//               <span>{req.fromId}</span>
//               <button
//                 onClick={() => acceptRequest(req)}
//                 className="bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 Accept
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

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
      <h2 className="text-xl font-bold mb-4 text-center">Connection Requests</h2>
      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No pending requests</p>
      ) : (
        <ul>
          {requests.map((req) => {
            const athlete = athletes[req.fromId];
            return (
              <li
                key={req.id}
                className="border p-3 my-3 rounded flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white text-black"
              >
                {athlete ? (
                  <>
                    <img
                      src={athlete.photoURL || "/default-profile.png"}
                      alt={athlete.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-grow">
                      <p className="text-lg font-semibold">
                        {athlete.firstName} {athlete.lastName}
                      </p>
                      <p>Sport: {athlete.sport || "N/A"}</p>
                      <p>Experience: {athlete.experienceLevel || "N/A"}</p>
                      <p>Gender: {athlete.gender}</p>
                      <p className="text-sm text-gray-600">
                        Achievements: {athlete.achievements || "None"}
                      </p>
                    </div>
                    <div className="flex gap-2">
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
