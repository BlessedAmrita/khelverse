"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  limit,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function SearchCoach() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [autocomplete, setAutocomplete] = useState([]);
  const [results, setResults] = useState([]);
  const [defaultCoaches, setDefaultCoaches] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const user = useSelector((state) => state.user);

  const fetchInitialCoaches = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "coach"),
        orderBy("name"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      setDefaultCoaches(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching default coaches:", err);
    }
  };

  const fetchAllCoaches = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "coach"),
        orderBy("name")
      );
      const snapshot = await getDocs(q);
      setDefaultCoaches(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setShowAll(true);
    } catch (err) {
      console.error("Error fetching all coaches:", err);
    }
  };

  const fetchAutocomplete = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setAutocomplete([]);
      return;
    }
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "coach"),
        orderBy("name"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      setAutocomplete(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching autocomplete:", err);
    }
  };

  useEffect(() => {
    fetchInitialCoaches();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAutocomplete(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const searchCoach = async () => {
    if (!search.trim() && !city.trim() && !state.trim()) {
      return toast.error("Enter at least one filter (name, city, or state)");
    }

    try {
      const q = search.trim()
        ? query(
            collection(db, "users"),
            where("role", "==", "coach"),
            orderBy("name"),
            startAt(search),
            endAt(search + "\uf8ff")
          )
        : query(
            collection(db, "users"),
            where("role", "==", "coach")
          );

      const snapshot = await getDocs(q);
      let filtered = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Apply city/state filters (case-insensitive)
      if (city.trim()) {
        filtered = filtered.filter((c) =>
          (c.city || "").toLowerCase().includes(city.toLowerCase())
        );
      }
      if (state.trim()) {
        filtered = filtered.filter((c) =>
          (c.state || "").toLowerCase().includes(state.toLowerCase())
        );
      }

      setResults(filtered);
      setAutocomplete([]);
    } catch (err) {
      toast.error("Error fetching coaches");
      console.error("Error searching coaches:", err);
    }
  };

  const sendRequest = async (coachId) => {
    if (!user.uid) return toast.error("You're not logged in.");

    const athleteRef = doc(db, "users", user.uid);
    const athleteSnap = await getDoc(athleteRef);

    if (athleteSnap.exists() && athleteSnap.data().connectedCoachId) {
      return toast.error("Already connected to a coach.");
    }

    try {
      await addDoc(collection(db, "requests"), {
        fromId: user.uid,
        toId: coachId,
        status: "pending",
        timestamp: new Date(),
      });
      toast.success("Request sent!");
    } catch (err) {
      toast.error("Failed to send request.");
      console.error("Error sending request:", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Find Your Coach</h2>

      <input
        type="text"
        placeholder="Search by Name"
        className="p-2 border rounded w-full mb-2 text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by City"
        className="p-2 border rounded w-full mb-2 text-black"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by State"
        className="p-2 border rounded w-full mb-2 text-black"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />

      {autocomplete.length > 0 && (
        <ul className="border rounded mb-2 max-h-48 overflow-y-auto bg-white text-black">
          {autocomplete.map((coach) => (
            <li
              key={coach.id}
              className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-3"
              onClick={() => {
                setSearch(coach.name);
                setAutocomplete([]);
              }}
            >
              <img
                src={coach.photoURL || "/default-profile.png"}
                alt={coach.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{coach.name}</p>
                <p className="text-sm text-gray-600">{coach.sport}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={searchCoach}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-4"
      >
        Search
      </button>

      <ul>
        {(search.trim() || city.trim() || state.trim() ? results : defaultCoaches).map((coach) => (
          <li
            key={coach.id}
            className="border p-3 rounded my-2 flex items-center gap-4 bg-white text-black"
          >
            <img
              src={coach.photoURL || "/default-profile.png"}
              alt={coach.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-grow">
              <p className="font-bold">{coach.firstName} {coach.lastName}</p>
              <p>Sport: {coach.sport || "N/A"}</p>
              <p>City: {coach.city || "N/A"}</p>
              <p>State: {coach.state || "N/A"}</p>
              <p>Experience: {coach.experience ? coach.experience + " years" : "N/A"}</p>
            </div>
            <button
              onClick={() => sendRequest(coach.id)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Connect
            </button>
          </li>
        ))}
      </ul>

      {!search && !city && !state && !showAll && (
        <button
          onClick={fetchAllCoaches}
          className="w-full mt-2 bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
        >
          Load More Coaches
        </button>
      )}
    </div>
  );
}

