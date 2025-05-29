// 'use client';
// import React, { useState } from 'react';
// import { Search } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import AthleteCard from './AthleteCard';

// const ATHLETES = [
//   {
//     id: '1',
//     name: 'Vikram Malhotra',
//     sport: 'Sprinter',
//     level: 'Elite',
//     age: 24,
//     status: 'Active',
//     recentPerformance: 'Good',
//     image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
//   },
//   {
//     id: '2',
//     name: 'Priya Sharma',
//     sport: 'Marathoner',
//     level: 'Professional',
//     age: 22,
//     status: 'Recovery',
//     recentPerformance: 'Excellent',
//     image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
//   },
//   {
//     id: '3',
//     name: 'Arjun Mehta',
//     sport: 'Badminton',
//     level: 'Collegiate',
//     age: 20,
//     status: 'Active',
//     recentPerformance: 'Improving',
//     image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
//   },
//   {
//     id: '4',
//     name: 'Megha Joshi',
//     sport: 'Track & Field',
//     level: 'Elite',
//     age: 19,
//     status: 'Competing',
//     recentPerformance: 'Excellent',
//     image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
//   },
//   {
//     id: '5',
//     name: 'Rohan Patil',
//     sport: 'Tennis',
//     level: 'Professional',
//     age: 25,
//     status: 'Active',
//     recentPerformance: 'Good',
//     image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
//   },
//   {
//     id: '6',
//     name: 'Devansh Nair',
//     sport: 'Figure Skating',
//     level: 'Elite',
//     age: 18,
//     status: 'Training',
//     recentPerformance: 'Excellent',
//     image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
//   }
// ];

// const Athletes = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filter, setFilter] = useState('All');

//   const filteredAthletes = ATHLETES.filter(athlete => {
//     const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           athlete.sport.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filter === 'All' || athlete.status === filter;
//     return matchesSearch && matchesFilter;
//   });

//   const statusOptions = ['All', 'Active', 'Recovery', 'Competing', 'Training'];

//   return (
//     <div className="min-h-screen bg-gradient-athlete p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         <header className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-lavender-200 mb-2">
//             My Athletes
//           </h1>
//           <p className="text-muted-foreground">
//             Monitor and manage all athletes under your coaching
//           </p>
//         </header>

//         <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
//           <div className="relative w-full sm:max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Search athletes..."
//               className="pl-10 bg-gray-200 border-none"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
//             {statusOptions.map(status => (
//               <button
//                 key={status}
//                 onClick={() => setFilter(status)}
//                 className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
//                   filter === status
//                     ? 'bg-purple-dark text-lavender-100'
//                     : 'bg-gray-200 text-black hover:bg-secondary/80'
//                 }`}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>

//         {filteredAthletes.length === 0 ? (
//           <div className="text-center py-12 bg-secondary/50 rounded-lg">
//             <p className="text-muted-foreground">No athletes found matching your criteria</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredAthletes.map(athlete => (
//               <AthleteCard key={athlete.id} athlete={athlete} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Athletes;

'use client';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AthleteCard from "./AthleteCard";
import toast from "react-hot-toast";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    ? age - 1
    : age;
};

const Athletes = () => {
  const user = useSelector((state) => state.user);
  const [athletes, setAthletes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConnectedAthletes = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "athlete"),
        where("connectedCoachId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const athleteList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAthletes(athleteList);
    } catch (err) {
      console.error("Failed to fetch athletes:", err);
      toast.error("Error fetching athletes");
    }
  };

  useEffect(() => {
    if (user.uid && user.role === "coach") {
      fetchConnectedAthletes();
    }
  }, [user]);

  const filteredAthletes = athletes.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-auto bg-gradient-athlete p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-lavender-200 mb-2 font-sprintura">
            My Athletes
          </h1>
          <p className="text-muted-foreground ">
            Monitor and manage all athletes under your coaching
          </p>
        </header>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search athletes..."
              className="pl-10 bg-gray-100 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredAthletes.length === 0 ? (
          <div className="text-center py-12 bg-transparent rounded-lg">
            <p className="text-muted-foreground text-lg">
              No athletes found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.map((athlete) => (
              <AthleteCard
                key={athlete.id}
                athlete={{
                  id: athlete.id, // ✅ Include ID here
                  name: (athlete.firstName && athlete.lastName)
                    ? `${athlete.firstName} ${athlete.lastName}`
                    : athlete.name,
                  sport: athlete.sport,
                  age: calculateAge(athlete.dob),
                  experienceLevel: athlete.experienceLevel,
                  photoURL: athlete.photoURL,
                  location: `${athlete.city ?? ''}, ${athlete.state ?? ''}`, // ✅ Optional
                }}
              />

            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Athletes;