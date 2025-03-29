import { createSlice } from '@reduxjs/toolkit';
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
  },
});
export const { setTasks, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;
