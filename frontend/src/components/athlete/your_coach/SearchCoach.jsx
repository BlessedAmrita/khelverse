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
  updateDoc,
  orderBy,
  startAt,
  endAt,
  limit,
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
  const [connectedCoach, setConnectedCoach] = useState(null);

  const user = useSelector((state) => state.user);

  const formatName = (coach) =>
    coach.firstName && coach.lastName
      ? `${coach.firstName} ${coach.lastName}`
      : coach.name || "Unnamed";

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
    if (!searchTerm.trim()) return setAutocomplete([]);
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "coach")
      );
      const snapshot = await getDocs(q);
      const matches = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((c) => {
          const fullName = formatName(c).toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        })
        .slice(0, 5);
      setAutocomplete(matches);
    } catch (err) {
      console.error("Error fetching autocomplete:", err);
    }
  };

  const fetchConnectedCoach = async () => {
    if (!user.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const connectedCoachId = userSnap.data().connectedCoachId;
        if (connectedCoachId) {
          const coachRef = doc(db, "users", connectedCoachId);
          const coachSnap = await getDoc(coachRef);
          if (coachSnap.exists()) {
            setConnectedCoach({ id: coachSnap.id, ...coachSnap.data() });
          }
        }
      }
    } catch (err) {
      console.error("Error fetching connected coach:", err);
    }
  };

  const removeConnection = async () => {
    try {
      const athleteRef = doc(db, "users", user.uid);
      await updateDoc(athleteRef, { connectedCoachId: "" });
      toast.success("Connection removed");
      setConnectedCoach(null);
    } catch (err) {
      toast.error("Failed to remove connection.");
      console.error("Error:", err);
    }
  };

  const searchCoach = async () => {
    if (!search.trim() && !city.trim() && !state.trim()) {
      return toast.error("Enter at least one filter (name, city, or state)");
    }

    try {
      const q = query(collection(db, "users"), where("role", "==", "coach"));
      const snapshot = await getDocs(q);
      let filtered = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (search.trim()) {
        filtered = filtered.filter((c) =>
          formatName(c).toLowerCase().includes(search.toLowerCase())
        );
      }
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

  useEffect(() => {
    fetchInitialCoaches();
    fetchConnectedCoach();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAutocomplete(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const displayList = search.trim() || city.trim() || state.trim() ? results : defaultCoaches;

  return (
    <div className="p-4 max-w-full mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white font-sprintura">Find Your Coach</h2>

      {connectedCoach ? (
        <div className="w-full mb-4 text-white glass-card bg-black/80 border-white/20 overflow-hidden p-5 rounded-xl border" style={{ maxWidth: '600px', minWidth: '330px' }}>
          <div className="flex items-center gap-4">
            <img
              src={connectedCoach.photoURL || "/default-profile.png"}
              alt={formatName(connectedCoach)}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-grow">
              <p className="font-bold text-xl">{formatName(connectedCoach)}</p>
              <p className="text-white/70">Sport: <span className="text-white">{connectedCoach.sport || "N/A"}</span></p>
              <p className="text-white/70">Experience: <span className="text-white">{connectedCoach.experience ? connectedCoach.experience + " years" : "N/A"}</span></p>
              <p className="text-white/70">City: <span className="text-white">{connectedCoach.city || "N/A"}</span></p>
              <p className="text-white/70">State: <span className="text-white">{connectedCoach.state || "N/A"}</span></p>
            </div>
            <button
              onClick={removeConnection}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search by Name"
            className="p-2 border rounded w-full mb-2 text-black"
            style={{ minWidth: '330px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by City"
            className="p-2 border rounded w-full mb-2 text-black"
            style={{ minWidth: '330px' }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by State"
            className="p-2 border rounded w-full mb-2 text-black"
            style={{ minWidth: '330px' }}
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
                    setSearch(formatName(coach));
                    setAutocomplete([]);
                  }}
                >
                  <img
                    src={coach.photoURL || "/default-profile.png"}
                    alt={formatName(coach)}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{formatName(coach)}</p>
                    <p className="text-sm text-gray-600">{coach.sport}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={searchCoach}
            className="w-full bg-apts-purple-dark hover:bg-apts-purple pulse-btn text-white py-2 font-semibold rounded transition mb-4"
            style={{ minWidth: '330px' }}
          >
            Search
          </button>

          <ul>
            {displayList.map((coach) => (
              <li
                key={coach.id}
                className="my-2 w-full flex items-center gap-4 text-white glass-card bg-black/80 border-white/20 overflow-hidden p-5 rounded-xl border cursor-pointer
                hover:shadow-[0_10px_30px_-10px_rgba(155,135,245,0.2)] transition-shadow duration-300"
                style={{ maxWidth: '600px', minWidth: '330px' }}
              >
                <img
                  src={coach.photoURL || "/default-profile.png"}
                  alt={formatName(coach)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <p className="font-bold text-xl">{formatName(coach)}</p>
                  <p className="text-white/70">Sport: <span className="text-white">{coach.sport || "N/A"}</span></p>
                  <p className="text-white/70">Experience: <span className="text-white">{coach.experience ? coach.experience + " years" : "N/A"}</span></p>
                  <p className="text-white/70">City: <span className="text-white">{coach.city || "N/A"}</span></p>
                  <p className="text-white/70">State: <span className="text-white">{coach.state || "N/A"}</span></p>
                </div>
                <button
                  onClick={() => sendRequest(coach.id)}
                  className="bg-apts-purple-dark hover:bg-apts-purple pulse-btn text-white px-4 py-2 rounded font-semibold transition"
                >
                  Connect
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
