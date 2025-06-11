'use client';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks} from '@/config/slices/taskSlice';
import { db } from '@/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// Helper to get today's date in YYYY-MM-DD format (local timezone)
const getFormattedToday = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

// Helper to get the current day of the week (0 for Sunday, 1 for Monday, etc.)
const getCurrentDayOfWeek = () => {
  const today = new Date();
  return today.getDay();
};

const TodaysTarget = () => {
  const [tasks, setLocalTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const formattedToday = getFormattedToday();

  // Function to populate today's tasks based on the active plan
  const populateTodaysTasks = useCallback(async () => {
    if (!user.uid) return;
    setLoading(true);

    try {
      const tasksDocRef = doc(db, 'users', user.uid, 'tasks', formattedToday);
      const tasksDocSnap = await getDoc(tasksDocRef);

      if (tasksDocSnap.exists()) {
        // Tasks for today already exist, just fetch them
        const fetchedTasks = tasksDocSnap.data().tasks;
        setLocalTasks(fetchedTasks);
        dispatch(setTasks({ [formattedToday]: fetchedTasks }));
        setLoading(false);
        return;
      }

      // If no tasks for today, try to populate from the active plan
      const plansCollectionRef = collection(db, 'plans');
      // IMPORTANT: If you removed 'isCurrent' from your plans, ensure 'status === "active"' is the primary filter
      const q = query(plansCollectionRef, where('athleteId', '==', user.uid), where('status', '==', 'active'));
      const planQuerySnapshot = await getDocs(q);

      if (planQuerySnapshot.empty) {
        toast.info("No active plan found to populate today's tasks. You can generate one!");
        setLoading(false);
        return;
      }

      const activePlanDoc = planQuerySnapshot.docs[0];
      const activePlan = activePlanDoc.data();
      let tasksToPopulate = [];

      if (activePlan.type === 'daily') {
        const sortedTimeSlots = Object.keys(activePlan.plan).sort((a, b) => {
            const parseTimeForSort = (timeStr) => {
                const parts = timeStr.match(/(\d+)\s*(AM|PM)/i);
                if (!parts) return 0;
                let hour = parseInt(parts[1], 10);
                const ampm = parts[2].toUpperCase();

                if (ampm === 'PM' && hour !== 12) {
                    hour += 12;
                } else if (ampm === 'AM' && hour === 12) {
                    hour = 0;
                }
                return hour;
            };
            return parseTimeForSort(a) - parseTimeForSort(b);
        });

        for (const timeSlot of sortedTimeSlots) {
            const activities = activePlan.plan[timeSlot];
            if (Array.isArray(activities)) {
                activities.forEach(activity => {
                    tasksToPopulate.push({ taskId: activity, time: timeSlot, completed: false });
                });
            }
        }
      } else if (activePlan.type === 'weekly') {
        // For weekly plans, 'plan' contains keys like "D1", "D2"
        const currentDayIndex = getCurrentDayOfWeek(); 
        // Map day index to D1, D2, etc. (assuming D1 is Monday, D2 is Tuesday, ..., D7 is Sunday)
        let dayKey;
        if (currentDayIndex === 0) { // Sunday
            dayKey = 'D7';
        } else { 
            dayKey = `D${currentDayIndex}`;
        }

        const dayActivities = activePlan.plan[dayKey];
        if (dayActivities && Array.isArray(dayActivities)) {
          tasksToPopulate = dayActivities.map(activity => ({ taskId: activity, time: null, completed: false }));
        } else {
            console.warn(`No activities found for ${dayKey} in the weekly plan.`);
            toast.info(`No specific tasks defined for ${dayKey} in your current plan.`);
        }
      } else {
        toast.warn("Unsupported plan type encountered. Please check your active plan.");
      }

      // Save the populated tasks to Firestore for today
      if (tasksToPopulate.length > 0) {
        await setDoc(tasksDocRef, { tasks: tasksToPopulate });
        setLocalTasks(tasksToPopulate);
        dispatch(setTasks({ [formattedToday]: tasksToPopulate }));
        toast.success("Today's tasks populated from your active plan!");
      } else {
        toast.info("No tasks to populate for today from your active plan.");
      }
    } catch (error) {
      console.error("Error populating today's tasks:", error);
      toast.error("Failed to populate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user.uid, dispatch, formattedToday]);

  useEffect(() => {
    if (user.uid) {
      populateTodaysTasks();
    }
  }, [user.uid, populateTodaysTasks]);

  // handleToggleTask remains the same
  const handleToggleTask = async (taskId, taskTime) => { 
    const updatedTasks = tasks.map((task) =>
      task.taskId === taskId && task.time === taskTime ? { ...task, completed: !task.completed } : task
    );
    setLocalTasks(updatedTasks);

    try {
      const tasksRef = doc(db, 'users', user.uid, 'tasks', formattedToday);
      await updateDoc(tasksRef, { tasks: updatedTasks });
      toast.success("Task updated!");
    } catch (error) {
      console.error("Error updating task completion:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };


  return (
    <div className="p-6 rounded-lg shadow-lg text-white min-w-[60%] max-w-full mx-auto flex-1">
      <h2 className="text-2xl font-bold text-apts-lavender mb-6 font-sprintura">Targets</h2>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.length === 0 && (
            <p className="text-gray-400 text-center">No tasks for today. If you have an active plan, they will appear here automatically.</p>
          )}
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              // Use a more unique key for list items, combining taskId and time (if present)
              <li key={`${task.taskId}-${task.time || 'no-time'}-${index}`} className="flex items-center justify-between text-white py-4 px-7 rounded-lg backdrop:blur-lg bg-apts-dark/50 hover:bg-apts-dark/90 transition-colors duration-300">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.completed}
                    // Pass both taskId and task.time for uniqueness if needed in handleToggleTask
                    onCheckedChange={() => handleToggleTask(task.taskId, task.time)}
                    className="w-5 h-5 rounded-md border border-gray-300"
                  />
                  <div>
                    {/* Render time only if it exists */}
                    {task.time && <span className="font-semibold text-apts-lavender text-sm mr-2">{task.time}:</span>}
                    <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.taskId}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodaysTarget;