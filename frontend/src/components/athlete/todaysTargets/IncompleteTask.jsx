'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const IncompleteTasks = () => {
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchIncompleteTasks = async () => {
      if (!user.uid) return;

      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const querySnapshot = await getDocs(tasksRef);

      // Get correct IST date
      const todayIST = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD'); 
      const oneWeekAgoIST = dayjs().tz('Asia/Kolkata').subtract(7, 'days').format('YYYY-MM-DD');

      let incomplete = [];

      querySnapshot.forEach((doc) => {
        const date = doc.id; // Firestore doc ID is assumed to be YYYY-MM-DD
        if (date !== todayIST && date >= oneWeekAgoIST) { // Exclude today's tasks
          const tasks = doc.data().tasks;
          const pendingTasks = tasks.filter(task => !task.completed);
          if (pendingTasks.length) {
            incomplete.push({ date, tasks: pendingTasks });
          }
        }
      });

      setIncompleteTasks(incomplete);
    };

    fetchIncompleteTasks();
  }, [user.uid]);

  return (
    <div className="sticky top-0 max-h-screen overflow-y-auto bg-black p-6 rounded-lg text-white shadow-lg w-[400px]">
      <h2 className="text-xl font-bold text-lavender mb-4">Past Incomplete Tasks</h2>
      {incompleteTasks.length > 0 ? (
        incompleteTasks.map(({ date, tasks }) => (
          <div key={date} className="mb-6">
            <h3 className="text-lg font-semibold text-lavender">{dayjs(date).format('DD MMM YYYY')}</h3>
            <ul className="mt-2 space-y-2">
              {tasks.map((task) => (
                <li key={task.taskId} className="bg-lavender/20 p-3 rounded-lg">{task.taskId}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-gray-400 italic">No past pending tasks. Keep up the great work!🏀</p>
      )}
    </div>
  );
};

export default IncompleteTasks;
