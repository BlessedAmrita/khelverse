// // src/firebase/session.js
// import { db } from "@/firebase/firebase";
// import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";

// export const saveSessionToFirestore = async (sessionData) => {
//   try {
//     // 1. Add to global sessions collection
//     const globalRef = await addDoc(collection(db, "sessions"), {
//       ...sessionData,
//       createdAt: serverTimestamp(),
//     });

//     const sessionId = globalRef.id;

//     // 2. Add to coach's subcollection
//     await setDoc(doc(db, "users", sessionData.coachId, "sessions", sessionId), {
//       ...sessionData,
//       createdAt: serverTimestamp(),
//     });

//     // 3. Add to athlete's subcollection
//     await setDoc(doc(db, "users", sessionData.athleteId, "sessions", sessionId), {
//       ...sessionData,
//       createdAt: serverTimestamp(),
//     });

//     console.log("✅ Session saved in all collections");
//   } catch (error) {
//     console.error("❌ Error saving session:", error);
//   }
// };
import { db } from "@/firebase/firebase";
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";

export const saveSessionToFirestore = async (sessionData) => {
  try {
    // 1. Add to global sessions collection
    const globalRef = await addDoc(collection(db, "sessions"), {
      ...sessionData,
      createdAt: serverTimestamp(),
    });

    const sessionId = globalRef.id;

    // 2. Add to coach's subcollection
    await setDoc(doc(db, "users", sessionData.coachId, "sessions", sessionId), {
      ...sessionData,
      createdAt: serverTimestamp(),
    });

    // 3. Add to each athlete's subcollection
    for (const athleteId of sessionData.athleteIds || []) {
      await setDoc(doc(db, "users", athleteId, "sessions", sessionId), {
        ...sessionData,
        createdAt: serverTimestamp(),
      });
    }

    console.log("✅ Session saved in all collections");
  } catch (error) {
    console.error("❌ Error saving session:", error);
  }
};
