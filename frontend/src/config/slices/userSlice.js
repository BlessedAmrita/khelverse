import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/firebase/firebase'; // Firestore instance
import { doc, getDoc } from 'firebase/firestore';

// 🔹 Async Thunk to Fetch User Data from Firestore
export const fetchUserData = createAsyncThunk('user/fetchUserData', async (uid, { rejectWithValue }) => {
  try {
    if (!uid) throw new Error('No UID provided');

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { uid, ...userSnap.data() }; // Return user data
    } else {
      return rejectWithValue('User data not found');
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// 🔹 Initial State (Minimal but Essential Fields)
const initialState = {
  uid: null,
  name: null,
  email: null,
  photoURL: null,
  isAuthenticated: false,
  isOnboarded: false,
  role: 'guest',
  additionalData: {}, // Store role-specific data separately
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.uid = action.payload.uid || state.uid;
      state.name = action.payload.name || state.name;
      state.email = action.payload.email || state.email;
      state.photoURL = action.payload.photoURL || state.photoURL;
      state.isOnboarded = action.payload.isOnboarded ?? state.isOnboarded;
      state.role = action.payload.role || state.role;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    logoutUser: () => ({
      uid: null,
      name: null,
      email: null,
      photoURL: null,
      isAuthenticated: false,
      isOnboarded: false,
      role: 'guest',
      additionalData: {},
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.uid = action.payload.uid;
        state.name = action.payload.name || 'Unknown';
        state.email = action.payload.email || '';
        state.photoURL = action.payload.photoURL || '';
        state.isOnboarded = action.payload.isOnboarded ?? false;
        state.role = action.payload.role || 'guest';
        state.additionalData = action.payload; // Store all extra user data
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.error('Error fetching user data:', action.payload);
      });
  },
});

export const { setUser, setRole, logoutUser } = userSlice.actions;
export default userSlice.reducer;
