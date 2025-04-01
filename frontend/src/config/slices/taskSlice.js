import { createSlice } from '@reduxjs/toolkit';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Firebase imports

const initialState = {
  tasks: {},
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    updateTask: (state, action) => {
      const { date, taskCount } = action.payload;
      state.tasks[date] = taskCount;
    },
    // ✅ Added deleteTask reducer
    deleteTask: (state, action) => {
      const { date, taskId } = action.payload;
      if (state.tasks[date]) {
        state.tasks[date] = state.tasks[date].filter((task) => task.taskId !== taskId);
      }
    },
  },
});

// Thunk to fetch tasks from Firebase
export const fetchTasks = () => async (dispatch) => {
  const db = getFirestore(); // Initialize Firestore
  const tasksCollection = collection(db, 'tasks'); // Assuming 'tasks' collection in Firestore
  const tasksSnapshot = await getDocs(tasksCollection); // Fetch tasks data

  const tasks = {};
  tasksSnapshot.forEach((doc) => {
    const data = doc.data();
    tasks[data.date] = data.taskCount; // Assuming data has 'date' and 'taskCount'
  });

  dispatch(setTasks(tasks)); // Dispatch the fetched tasks to Redux store
};

export const { setTasks, updateTask, deleteTask } = tasksSlice.actions; // ✅ Now exporting deleteTask
export default tasksSlice.reducer;
