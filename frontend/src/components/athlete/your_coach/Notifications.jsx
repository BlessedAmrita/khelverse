"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user);

  const fetchNotifications = async () => {
    try {
      const q = query(
        collection(db, "notifications"),
        where("toId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (user?.uid) fetchNotifications();
  }, [user]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-3">
          {notifications.map((note) => (
            <li key={note.id} className="bg-white text-black p-3 rounded shadow">
              <p className="font-semibold">{note.message}</p>
              <p className="text-sm text-gray-600">
                {new Date(note.timestamp?.toDate()).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No notifications</p>
      )}
    </div>
  );
}
