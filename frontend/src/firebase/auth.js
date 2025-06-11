import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { setUser, logoutUser } from '@/config/slices/userSlice';
import { store } from '@/config/store';

export const signInWithGoogle = async (dispatch) => {
  const provider = new GoogleAuthProvider();

  // Request calendar events scope so the accessToken has permission for Google Calendar API
  provider.addScope('https://www.googleapis.com/auth/calendar');
  provider.addScope('https://www.googleapis.com/auth/calendar.events');
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      dispatch(setUser({ ...userData, isAuthenticated: true }));

      if (userData.isAuthenticated && userData.role) {
        return { user: userData, isNewUser: false };
      } else {
        return { user: userData, isNewUser: true };
      }
    } else {
      const newUser = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: '',
        isOnboarded: false,
        isAuthenticated: false,
      };

      await setDoc(userRef, newUser);
      dispatch(setUser(newUser));

      return { user: newUser, isNewUser: true };
    }
  } catch (error) {
    console.error('🔥 Error signing in with Google:', error);
    return { user: null, isNewUser: null };
  }
};

// **🔥 Logout Function**
export const logout = async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(logoutUser());
  } catch (error) {
    console.error('🔥 Error logging out:', error);
  }
};


// **💡 Listen to Auth State Changes & Sync with Redux**
export const monitorAuthState = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        // Ensure isAuthenticated is set based on the presence of a role
        store.dispatch(setUser({ ...userData, isAuthenticated: !!userData.role }));
      } else {
        // If user exists in Firebase Auth but not in Firestore 'users' collection,
        // it means they haven't completed onboarding or there's an issue.
        // Log them out from Redux for consistency.
        store.dispatch(logoutUser());
      }
    } else {
      store.dispatch(logoutUser());
    }
  });
};
// import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth, db } from '@/firebase/firebase';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { setUser, logoutUser } from '@/config/slices/userSlice';
// import { store } from '@/config/store';

// export const signInWithGoogle = async (dispatch) => {
//   const provider = new GoogleAuthProvider();

//   // Request calendar events scope so the accessToken has permission for Google Calendar API
//   provider.addScope('https://www.googleapis.com/auth/calendar');
//   provider.addScope('https://www.googleapis.com/auth/calendar.events');
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const accessToken = credential.accessToken; // ✅ this is the one you need
//     const user = result.user;
//     const userRef = doc(db, 'users', user.uid);
//     const userSnap = await getDoc(userRef);

//     if (userSnap.exists()) {
//       const userData = userSnap.data();
//       dispatch(setUser({ ...userData, isAuthenticated: true }));

//       if (userData.isAuthenticated && userData.role) {
//         return { user: userData, isNewUser: false };
//       } else {
//         return { user: userData, isNewUser: true };
//       }
//     } else {
//       const newUser = {
//         uid: user.uid,
//         name: user.displayName,
//         email: user.email,
//         photoURL: user.photoURL,
//         role: '',
//         isOnboarded: false,
//         isAuthenticated: false,
//       };

//       await setDoc(userRef, newUser);
//       dispatch(setUser(newUser));

//       return { user: newUser, isNewUser: true };
//     }
//   } catch (error) {
//     console.error('🔥 Error signing in with Google:', error);
//     return { user: null, isNewUser: null };
//   }
// };

// // **🔥 Logout Function**
// export const logout = async (dispatch) => {
//   try {
//     await signOut(auth);
//     dispatch(logoutUser());
//   } catch (error) {
//     console.error('🔥 Error logging out:', error);
//   }
// };

// // **💡 Listen to Auth State Changes & Sync with Redux**
// export const monitorAuthState = () => {
//   onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       const userRef = doc(db, 'users', user.uid);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         store.dispatch(setUser({ ...userData, isAuthenticated: !!userData.role }));
//       } else {
//         store.dispatch(logoutUser()); // Ensure Redux resets if user doesn't exist in Firestore
//       }
//     } else {
//       store.dispatch(logoutUser());
//     }
//   });
// };
