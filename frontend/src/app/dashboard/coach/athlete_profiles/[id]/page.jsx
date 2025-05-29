// 'use client';
// import React, { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/firebase/firebase';
// import ProfileMain from '@/components/athlete/profile/ProfileMain'; // Adjust if the path is different

// const AthleteDetailPage = ({ params }) => {
//   const { id } = params;
//   const [athlete, setAthlete] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAthlete = async () => {
//       try {
//         const docRef = doc(db, 'users', id);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setAthlete({ id, ...docSnap.data() });
//         } else {
//           console.warn('No athlete found');
//         }
//       } catch (error) {
//         console.error('Error fetching athlete:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAthlete();
//   }, [id]);

//   if (loading) return <div className="text-white text-center p-8">Loading athlete details...</div>;
//   if (!athlete) return <div className="text-red-500 text-center p-8">Athlete not found.</div>;

//   return <ProfileMain athlete={athlete} readOnly />;
// };

// export default AthleteDetailPage;


'use client';
import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import ProfileMain from '@/components/athlete/profile/ProfileMain';

const AthleteDetailPage = ({ params }) => {
  const { id } = use(params); // ✅ unwrap Promise using React.use()
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAthlete({ id, ...docSnap.data() });
        } else {
          console.warn('No athlete found');
        }
      } catch (error) {
        console.error('Error fetching athlete:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAthlete();
  }, [id]);

  if (loading) return <div className="text-white text-center p-8">Loading athlete details...</div>;
  if (!athlete) return <div className="text-red-500 text-center p-8">Athlete not found.</div>;

  return <ProfileMain athlete={athlete} readOnly />;
};

export default AthleteDetailPage;
