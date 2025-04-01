'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import { format, subDays, eachDayOfInterval, isToday } from 'date-fns';
import { setTasks } from '@/config/slices/taskSlice';
import { BarChart, Calendar } from "lucide-react";

// Set date range (last 365 days)
const today = new Date();
const startDate = subDays(today, 365);

const Heatmap = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Get tasks from Redux
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    // Generate dummy data for past months (excluding today)
    const generatedData = eachDayOfInterval({ start: startDate, end: today }).map((date) => {
      const formattedDate = format(date, 'yyyy-MM-dd');

      // Ensure today's task count is NOT randomized
      return {
        date: formattedDate,
        count: isToday(date) ? tasks[formattedDate] ?? 0 : (Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0),
      };
    });

    setTaskData(generatedData);
  }, [dispatch, tasks]); // Depend on tasks to ensure updates persist

  // Merge with Firebase data (if available)
  const finalData = taskData.map((entry) => ({
    date: entry.date,
    count: tasks[entry.date] !== undefined ? tasks[entry.date] : entry.count, // Use Redux task count if available
  }));

  // Assign CSS classes based on task count
  const classForValue = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    return `color-scale-${Math.min(value.count, 5)}`;
  };

  //DATA CALCULATIONS
  const totalExercises = finalData.reduce((acc, day) => acc + day.count, 0);
  const activeDays = finalData.filter((day) => day.count > 0).length;
  const avgPerActiveDay = activeDays > 0 ? (totalExercises / activeDays).toFixed(2) : 0;

  return (
    <div className="glass rounded-xl p-6  animate-slide-up-delay-1">
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
          values={finalData}
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
    </div>
  );
};

export default Heatmap;

