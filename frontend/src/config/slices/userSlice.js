import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: null,
  name: null,
  email: null,
  photoURL: null,
  isAuthenticated: false,
  isOnboarded: false,
  role: 'guest',
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
    }),
  },
});

export const { setUser, setRole, logoutUser } = userSlice.actions;
export default userSlice.reducer;
