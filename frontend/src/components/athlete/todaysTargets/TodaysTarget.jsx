'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, updateTask, deleteTask } from '@/config/slices/taskSlice';
import { db } from '@/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { X } from 'lucide-react';

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Adjust for local timezone
const formattedDate = today.toISOString().split('T')[0]; // Now it should be the correct date

const TodaysTarget = () => {
  const [tasks, setLocalTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user.uid) return;
      const today = (() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
      })();      
      const tasksRef = doc(db, 'users', user.uid, 'tasks', today);
      const docSnap = await getDoc(tasksRef);
      if (docSnap.exists()) {
        const fetchedTasks = docSnap.data().tasks;
        setLocalTasks(fetchedTasks);
        dispatch(setTasks({ [today]: fetchedTasks }));
      }
    };
    fetchTasks();
  }, [dispatch, user.uid]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const taskData = { taskId: newTask, completed: false };
    const updatedTasks = [taskData, ...tasks];
    setLocalTasks(updatedTasks);
    
    const today = (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    })();    
    const tasksRef = doc(db, 'users', user.uid, 'tasks', today);
    await setDoc(tasksRef, { tasks: updatedTasks }, { merge: true });
    
    dispatch(updateTask({ date: today, taskCount: updatedTasks.length }));
    setNewTask('');
  };

  const handleToggleTask = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.taskId === taskId ? { ...task, completed: !task.completed } : task
    );
    setLocalTasks(updatedTasks);
    
    const today = (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    })();    
    const tasksRef = doc(db, 'users', user.uid, 'tasks', today);
    await updateDoc(tasksRef, { tasks: updatedTasks });
    
    dispatch(updateTask({ date: today, taskCount: updatedTasks.filter((task) => task.completed).length }));
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    const updatedTasks = tasks.filter((task) => task.taskId !== taskToDelete.taskId);
    setLocalTasks(updatedTasks);
    
    const today = (() => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split('T')[0];
    })();    
    const tasksRef = doc(db, 'users', user.uid, 'tasks', today);
    await updateDoc(tasksRef, { tasks: updatedTasks });
    
    dispatch(deleteTask({ date: today, taskId: taskToDelete.taskId }));
    
    // Close the modal after deleting
    setTaskToDelete(null);
  };

  return (
    <div className="p-6 rounded-lg shadow-lg text-white max-w-[800px] mx-auto flex-1">
      <div className="flex items-center space-x-4 mb-4 w-full">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="text-white"
        />
        <Button onClick={handleAddTask} className="bg-lavender text-black hover:bg-black hover:text-lavender border-2 border-lavender transition-all duration-300">
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.taskId} className="flex items-center justify-between text-white py-4 px-7 rounded-lg bg-lavender/20">
              <div className="flex items-center space-x-3">
                <Checkbox checked={task.completed} onCheckedChange={() => handleToggleTask(task.taskId)} />
                <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.taskId}</span>
              </div>

              {/* Modal per Task */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="p-2 text-sm bg-[#8c8dbc] text-black hover:bg-black hover:text-lavender border-2 hover:border-lavender border-transparent transition-all duration-300"
                    onClick={() => setTaskToDelete(task)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>

                {taskToDelete?.taskId === task.taskId && (
                  <AlertDialogContent className="bg-white dark:bg-gray-900">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deleting this task will remove it from your streak as well. Are you sure you want to delete the task: <span className="font-semibold">{task.taskId}</span>?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button variant="outline" onClick={() => setTaskToDelete(null)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDeleteTask}>Delete Task</Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodaysTarget;
