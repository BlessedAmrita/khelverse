// 'use client';
// import React, { useEffect, useState } from 'react';
// import MedicalRecordCard from './MedicalRecordCard';
// import { useSelector } from 'react-redux';
// import { db } from '@/firebase/firebase';
// import { collection, getDocs} from 'firebase/firestore';
// import NewMedicalRecordForm from './NewMedicalRecordForm';
// import { Plus } from 'lucide-react';

// const MedicalRecords = () => {
//   const user = useSelector((state) => state.user);
//   const uid = user?.uid;
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

//   const fetchMedicalRecords = async () => {
//     setLoading(true);
//     try {
//       const q = collection(db, 'users', uid, 'medicalRecords');
//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setRecords(data);
//     } catch (error) {
//       console.error("Error fetching medical records:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (uid) fetchMedicalRecords();
//   }, [uid]);

//   return (
//     <div className="glass rounded-xl p-6 mt-10 relative">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold">Medical Records</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="btn btn-sm btn-outline text-sm flex items-center gap-1"
//         >
//           <Plus className="w-4 h-4" />
//           Add Record
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-8 text-muted-foreground">Loading medical records...</div>
//       ) : records.length > 0 ? (
//         <div className="grid md:grid-cols-2 gap-4">
//           {records.map(record => (
//             <MedicalRecordCard key={record.id} record={record} />
//           ))}
//         </div>
//       ) : (
//         <p className="text-muted-foreground">No medical records found.</p>
//       )}

//       {/* Modal */}
//       {/* Modal */}
//       {showModal && (
//         <div className="inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
//           <div className="glass w-full max-w-lg mx-4 p-6 rounded-xl shadow-2xl relative animate-fade-in overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={() => setShowModal(false)}
//               className="absolute top-3 right-3 text-white hover:text-red-400 text-xl"
//             >
//               ✕
//             </button>
//             <h3 className="text-2xl font-semibold text-white mb-6 text-center">Add Medical Record</h3>
//             <NewMedicalRecordForm
//               userId={uid}
//               onSuccess={() => {
//                 setShowModal(false);
//                 fetchMedicalRecords();
//               }}
//             />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default MedicalRecords;


'use client';
import React, { useEffect, useState } from 'react';
import MedicalRecordCard from './MedicalRecordCard';
import { useSelector } from 'react-redux';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import NewMedicalRecordForm from './NewMedicalRecordForm';
import { Plus } from 'lucide-react';

const MedicalRecords = ({ uid: externalUid, readOnly = false }) => {
  const user = useSelector((state) => state.user);
  const uid = externalUid || user?.uid;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const q = collection(db, 'users', uid, 'medicalRecords');
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) fetchMedicalRecords();
  }, [uid]);

  return (
    <div className="glass rounded-xl p-6 mt-10 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Medical Records</h2>
        {!readOnly && (
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-sm btn-outline text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading medical records...</div>
      ) : records.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {records.map(record => (
            <MedicalRecordCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No medical records found.</p>
      )}

      {!readOnly && showModal && (
        <div className="inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="glass w-full max-w-lg mx-4 p-6 rounded-xl shadow-2xl relative animate-fade-in overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white hover:text-red-400 text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">Add Medical Record</h3>
            <NewMedicalRecordForm
              userId={uid}
              onSuccess={() => {
                setShowModal(false);
                fetchMedicalRecords();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
