'use client';
import { useState} from "react";

export default function Home() {
  const [exercise, setExercise] = useState("Hammer Curl");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [currentSet, setCurrentSet] = useState(0);
  const [count, setCount] = useState(0);
  const [isWorkingOut, setIsWorkingOut] = useState(false); // Track if workout is ongoing
  const [statusCheckInterval, setStatusCheckInterval] = useState(null); // To store interval ID

  const startWorkout = async () => {
    const response = await fetch("http://127.0.0.1:5000/start_exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exercise_type: exercise, sets: sets, reps: reps }),
    });

    if (response.ok) {
      console.log("Workout started!");
      setCurrentSet(1);
      setCount(0);
      setIsWorkingOut(true);

      // Start checking status every 1 second (1000ms)
      const interval = setInterval(getStatus, 1000);
      setStatusCheckInterval(interval);
    } else {
      console.error("Failed to start workout.");
    }
  };

  const stopWorkout = async () => {
    const response = await fetch("http://127.0.0.1:5000/stop_exercise", { method: "POST" });

    if (response.ok) {
      console.log("Workout stopped!");
      setCurrentSet(0);
      setCount(0);
      setIsWorkingOut(false);

      // Clear the status check interval when workout is stopped
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
    } else {
      console.error("Failed to stop workout.");
    }
  };

  const getStatus = async () => {
    const response = await fetch("http://127.0.0.1:5000/get_status", { method: "GET" });

    if (response.ok) {
      const data = await response.json();
      if (!data.exercise_running && isWorkingOut) {
        // Workout has ended
        resetWorkoutUI();
        return;
      }

      // Update current set and reps
      setCurrentSet(data.current_set);
      setCount(data.current_reps);
    } else {
      console.error("Error checking status:", response);
    }
  };

  const resetWorkoutUI = () => {
    setIsWorkingOut(false);
    setCurrentSet(0);
    setCount(0);
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black p-6">
      <p className="text-gray-500">AI-powered exercise tracking and feedback</p>

      <div className="mt-6 flex flex-wrap gap-6">
        {/* Left Side: Video Feed */}
        <div className="bg-white rounded-lg shadow-lg p-4 w-[700px]">
          <div className="bg-gray-200 h-[500px] rounded-md flex items-center justify-center">
            <img
              src="http://127.0.0.1:5000/video_feed"
              alt="Live Workout Feed"
              className="h-[500px] w-full rounded-md"
            />
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
          {/* Select Exercise */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Select Exercise</h3>
            <div className="flex gap-2">
              {[{name:"Squat",data:"squat"}, {name:"Push Up",data:"push_up"}, {name:"Hammer Curl",data:"hammer_curl"}].map((ex) => (
                <button
                  key={ex.data}
                  onClick={() => setExercise(ex.data)}
                  className={`px-3 py-2 rounded-md w-[150px] hover:bg-lavender hover:text-black transition-all duration-500 ${exercise === ex.data ? "bg-lavender text-black" : "bg-black text-lavender"}`}
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          {/* Configure Workout */}
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Configure Workout</h3>
            <div className="flex gap-2 mt-2">
              <div className="flex flex-col flex-1">
                <label>Sets : </label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label>Reps : </label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="border p-2 w-full"
                />
              </div>
            </div>
          </div>

          {/* Start/Stop Buttons */}
          <div className="mt-4 flex gap-2 text-[16px]">
            <button
              className="bg-black text-lavender hover:bg-lavender hover:text-black px-4 py-3 rounded-md transition-all duration-500 w-1/2"
              onClick={startWorkout}
              disabled={isWorkingOut}
            >
              Start Workout
            </button>
            <button
              className="bg-black text-lavender hover:bg-lavender hover:text-black px-4 py-3 rounded-md transition-all duration-500 w-1/2"
              onClick={stopWorkout}
              disabled={!isWorkingOut}
            >
              Stop Workout
            </button>
          </div>

          {/* Current Status */}
          <div className="mt-4 flex flex-col gap-[10px]">
            <h3 className="font-semibold text-lg">Current Status</h3>
            <div className="flex justify-between">
              <p>Exercise : </p>
              <p className="text-black font-semibold">{exercise}</p>
            </div>
            <div className="flex justify-between">
              <p>Set : </p>
              <p className="text-black font-semibold">{currentSet} / {sets}</p>
            </div>
            <div className="flex justify-between">
              <p>Repetitions : </p>
              <p className="text-black font-semibold">{count} / {reps}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
