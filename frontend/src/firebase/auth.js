import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { setUser, logoutUser } from '@/config/slices/userSlice';
import { store } from '@/config/store';

export const signInWithGoogle = async (dispatch) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // ✅ Existing user → Retrieve data from Firestore
      const userData = userSnap.data();
      dispatch(setUser({ ...userData, isAuthenticated: true }));

      if (userData.isAuthenticated && userData.role) {
        // 🔥 If user has completed onboarding, return their role
        return { user: userData, isNewUser: false };
      } else {
        // 🚨 If user exists but hasn't completed onboarding, return with onboarding needed
        return { user: userData, isNewUser: true };
      }
    } else {
      // 🆕 New user → Create initial entry in Firestore
      const newUser = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: '', // ⚠️ Role not set yet (filled in onboarding)
        isOnboarded: false,
        isAuthenticated: false, // 🚨 User hasn't completed onboarding
      };

      await setDoc(userRef, newUser); // Save in Firestore
      dispatch(setUser(newUser));

      return { user: newUser, isNewUser: true }; // 🔥 New user needs onboarding
    }
  } catch (error) {
    console.error('🔥 Error signing in with Google:', error);
    return { user: null, isNewUser: null }; // Return error state
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
        store.dispatch(setUser({ ...userData, isAuthenticated: !!userData.role }));
      } else {
        store.dispatch(logoutUser()); // Ensure Redux resets if user doesn't exist in Firestore
      }
    } else {
      store.dispatch(logoutUser());
    }
  });
};

