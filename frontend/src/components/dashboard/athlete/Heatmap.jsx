'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { fetchTasks } from '@/config/slices/taskSlice'; // Redux action to fetch tasks
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Set date range (last 365 days)
const today = new Date();
const startDate = subDays(today, 365);

const Heatmap = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const tasks = useSelector((state) => state.tasks.tasks); // Get tasks from Redux
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const fetchHeatmapTasks = async () => {
      if (!user?.uid) return;

      try {
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        const snapshot = await getDocs(tasksRef);
        const taskMap = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = doc.id; // Assuming Firestore uses date as doc ID
          const completedCount = data.tasks?.filter((task) => task.completed).length || 0;
          taskMap[date] = completedCount;
        });

        dispatch(fetchTasks(user.uid)); // Ensure Redux updates
        setTaskData(
          eachDayOfInterval({ start: startDate, end: today }).map((date) => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            return {
              date: formattedDate,
              count: taskMap[formattedDate] || 0, // Use only Firebase task data
            };
          })
        );
      } catch (error) {
        console.error('Error fetching heatmap tasks:', error);
      }
    };

    fetchHeatmapTasks();
  }, [dispatch, user?.uid]);

  // Assign CSS classes based on task count
  const classForValue = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    return `color-scale-${Math.min(value.count, 5)}`;
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[150px] h-auto py-2">
      <div className="p-4 w-full h-full shadow-md rounded-lg bg-black">
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={taskData}
          classForValue={classForValue}
          tooltipDataAttrs={(value) => ({
            'data-tooltip-id': 'task-tooltip',
            'data-tooltip-content': `${value.date}: ${value.count || 0} tasks completed`,
          })}
          gutterSize={6} // Adds spacing between blocks (LeetCode style)
          showMonthLabels={true}
          showWeekdayLabels={false}
          horizontal={true}
        />
        <Tooltip id="task-tooltip" />
      </div>
    </div>
  );
};

export default Heatmap;
