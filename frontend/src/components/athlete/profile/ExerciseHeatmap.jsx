import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { fetchTasks } from '@/config/slices/taskSlice';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Calendar } from "lucide-react";

const today = new Date();
const startDate = subDays(today, 365);

const ExerciseHeatmap = ({ uid, setStreak }) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user);
  const [taskData, setTaskData] = useState([]);

  // Use uid prop if passed, else fallback to redux user uid
  const userIdToFetch = uid || reduxUser?.uid;

  useEffect(() => {
    const fetchHeatmapTasks = async () => {
      if (!userIdToFetch) return;

      try {
        const tasksRef = collection(db, 'users', userIdToFetch, 'tasks');
        const snapshot = await getDocs(tasksRef);
        const taskMap = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = doc.id;
          const completedCount = data.tasks?.filter((task) => task.completed).length || 0;
          taskMap[date] = completedCount;
        });

        // Dispatch fetchTasks for redux user only (optional, or you can skip this)
        if (!uid) {
          dispatch(fetchTasks(userIdToFetch));
        }

        const newTaskData = eachDayOfInterval({ start: startDate, end: today }).map((date) => {
          const formattedDate = format(date, 'yyyy-MM-dd');
          return {
            date: formattedDate,
            count: taskMap[formattedDate] || 0,
          };
        });

        setTaskData(newTaskData);

        // Calculate current streak
        let currentStreak = 0;
        for (let i = newTaskData.length - 1; i >= 0; i--) {
          if (newTaskData[i].count > 0) {
            currentStreak++;
          } else {
            break;
          }
        }

        if (typeof setStreak === 'function') {
          setStreak(currentStreak);
        }
      } catch (error) {
        console.error('Error fetching heatmap tasks:', error);
      }
    };

    fetchHeatmapTasks();
  }, [dispatch, userIdToFetch, setStreak]);

  const classForValue = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    return `color-scale-${Math.min(value.count, 5)}`;
  };

  const totalExercises = taskData.reduce((acc, day) => acc + day.count, 0);
  const activeDays = taskData.filter((day) => day.count > 0).length;
  const avgPerActiveDay = activeDays > 0 ? (totalExercises / activeDays).toFixed(2) : 0;

  return (
    <div className="glass rounded-xl p-6 animate-slide-up-delay-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-light" />
          <h2 className="text-xl font-bold">Exercise Activity</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="px-3 py-1.5 rounded-lg bg-[#232323]">
            <p className="text-xs text-muted-foreground">Total Exercises</p>
            <p className="text-lg font-bold">{totalExercises}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#232323]">
            <p className="text-xs text-muted-foreground">Active Days</p>
            <p className="text-lg font-bold">{activeDays}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#232323]">
            <p className="text-xs text-muted-foreground">Avg per Active Day</p>
            <p className="text-lg font-bold">{avgPerActiveDay}</p>
          </div>
        </div>
      </div>

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
            gutterSize={6}
            showMonthLabels={true}
            showWeekdayLabels={false}
            horizontal={true}
          />
          <Tooltip id="task-tooltip" />
        </div>
      </div>
    </div>
  );
};

export default ExerciseHeatmap;
